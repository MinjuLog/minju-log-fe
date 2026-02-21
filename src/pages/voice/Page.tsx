import axios from "axios";
import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import { Room, RoomEvent, Track } from "livekit-client";
import { useEffect, useMemo, useRef, useState } from "react";
import VoiceHeader from "../../components/VoiceHeader.tsx";
import VoiceChatPanel from "./VoiceChatPanel.tsx";
import VoiceRoomsPanel from "./VoiceRoomsPanel.tsx";
import type { ChatMessage, VoiceRoom, VoiceRoomPresencePayload, VoiceRoomUserResponse } from "./types.ts";
import {
    FEED_WS_URL,
    LIVEKIT_URL,
    callVoiceRoomPresence,
    fetchLivekitToken,
    fetchRoomMessages,
    fetchVoiceRooms,
    parseVoiceChannelId,
    sendRoomMessage,
} from "./voiceApi.ts";

const MY_NAME = "나";
const INITIAL_CHAT: Record<string, ChatMessage[]> = {};
type RemoteSpeakerLevel = {
    participantId: string;
    name: string;
    level: number;
};

export default function VoicePage() {
    const [rooms, setRooms] = useState<VoiceRoom[]>([]);
    const [isRoomLoading, setIsRoomLoading] = useState(false);
    const [roomLoadError, setRoomLoadError] = useState<string | null>(null);
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [joinedRoomId, setJoinedRoomId] = useState<string | null>(null);
    const [livekitRoom, setLivekitRoom] = useState<Room | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [chatLoadError, setChatLoadError] = useState<string | null>(null);
    const [isMicEnabled, setIsMicEnabled] = useState(true);
    const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(true);
    const [micStatusMessage, setMicStatusMessage] = useState<string | null>(null);
    const [chatByRoom, setChatByRoom] = useState<Record<string, ChatMessage[]>>(INITIAL_CHAT);
    const [chatInput, setChatInput] = useState("");
    const [remoteSpeakerLevels, setRemoteSpeakerLevels] = useState<RemoteSpeakerLevel[]>([]);

    const speakerEnabledRef = useRef(isSpeakerEnabled);
    const suppressDisconnectLeaveRef = useRef(false);
    const wsClientRef = useRef<Client | null>(null);
    const channelPresenceSubRef = useRef<StompSubscription | null>(null);
    const roomChatSubRef = useRef<StompSubscription | null>(null);
    const audioContainerRef = useRef<HTMLDivElement | null>(null);
    const remoteAudioElementsRef = useRef<Map<string, HTMLMediaElement[]>>(new Map());
    const activeSpeakerLevelMapRef = useRef<Map<string, number>>(new Map());
    const currentUserIdRef = useRef<number>(Number(localStorage.getItem("userId") ?? NaN));
    const selectedRoomIdRef = useRef<string | null>(null);

    const selectedRoom = useMemo(() => {
        if (!selectedRoomId) return rooms[0] ?? null;
        return rooms.find((room) => room.id === selectedRoomId) ?? rooms[0] ?? null;
    }, [rooms, selectedRoomId]);

    const roomChats = selectedRoom ? (chatByRoom[selectedRoom.id] ?? []) : [];
    const isJoinedSelectedRoom = selectedRoom ? joinedRoomId === selectedRoom.id : false;

    const toParticipantLabel = (user: VoiceRoomUserResponse): string => {
        if (Number.isNaN(currentUserIdRef.current)) return user.username;
        return user.userId === currentUserIdRef.current ? `${user.username}(나)` : user.username;
    };

    const applyRoomUsersFromBroadcast = (roomId: string, users: VoiceRoomUserResponse[]) => {
        setRooms((prev) =>
            prev.map((room) =>
                room.id === roomId
                    ? {
                          ...room,
                          participants: users.map(toParticipantLabel),
                      }
                    : room,
            ),
        );
    };

    const upsertRoomMessage = (roomId: string, message: ChatMessage) => {
        setChatByRoom((prev) => {
            const current = prev[roomId] ?? [];
            if (current.some((item) => item.id === message.id)) return prev;
            return {
                ...prev,
                [roomId]: [...current, message],
            };
        });
    };

    const subscribeVoiceChannelPresence = (channelId: number | null) => {
        channelPresenceSubRef.current?.unsubscribe();
        channelPresenceSubRef.current = null;

        if (channelId === null || !wsClientRef.current?.connected) return;

        channelPresenceSubRef.current = wsClientRef.current.subscribe(`/topic/voice.channel.${channelId}`, (msg: IMessage) => {
            const payload: VoiceRoomPresencePayload = JSON.parse(msg.body);
            applyRoomUsersFromBroadcast(String(payload.roomId), payload.onlineUsers ?? []);
        });
    };

    const subscribeVoiceRoomChat = (roomId: string | null) => {
        roomChatSubRef.current?.unsubscribe();
        roomChatSubRef.current = null;

        if (!roomId || !wsClientRef.current?.connected) return;

        roomChatSubRef.current = wsClientRef.current.subscribe(`/topic/voice.room.${roomId}.chat`, (msg: IMessage) => {
            const payload: ChatMessage = JSON.parse(msg.body);
            upsertRoomMessage(roomId, payload);
        });
    };

    const applySpeakerState = (targetRoom: Room, enabled: boolean) => {
        targetRoom.remoteParticipants.forEach((participant) => {
            participant.trackPublications.forEach((publication) => {
                if (publication.kind === Track.Kind.Audio) {
                    publication.setSubscribed(enabled);
                }
            });
        });
    };

    const attachRemoteAudioTrack = (trackKey: string, track: Track) => {
        if (track.kind !== Track.Kind.Audio) return;
        if (!audioContainerRef.current) return;

        const mediaTrack = track as Track & {
            attach: () => HTMLMediaElement;
        };

        const element = mediaTrack.attach();
        element.autoplay = true;
        element.muted = false;
        element.setAttribute("playsinline", "true");
        audioContainerRef.current.appendChild(element);

        const existing = remoteAudioElementsRef.current.get(trackKey) ?? [];
        remoteAudioElementsRef.current.set(trackKey, [...existing, element]);

        if (speakerEnabledRef.current) {
            void element.play().catch(() => {
                // Ignore autoplay rejection; playback will resume after user interaction.
            });
        }
    };

    const detachRemoteAudioTrack = (trackKey: string, track?: Track) => {
        const elements = remoteAudioElementsRef.current.get(trackKey) ?? [];
        if (elements.length === 0) return;

        if (track) {
            const mediaTrack = track as Track & {
                detach: () => HTMLMediaElement[];
            };
            mediaTrack.detach();
        }

        elements.forEach((element) => {
            element.pause();
            element.remove();
        });
        remoteAudioElementsRef.current.delete(trackKey);
    };

    const clearAllRemoteAudioTracks = () => {
        remoteAudioElementsRef.current.forEach((elements) => {
            elements.forEach((element) => {
                element.pause();
                element.remove();
            });
        });
        remoteAudioElementsRef.current.clear();
    };

    const syncRemoteSpeakerLevels = (targetRoom: Room) => {
        const list = Array.from(targetRoom.remoteParticipants.values()).map((participant) => {
            const name = participant.name?.trim() ? participant.name : participant.identity;
            const level = activeSpeakerLevelMapRef.current.get(participant.identity) ?? 0;
            return {
                participantId: participant.identity,
                name,
                level: Math.max(0, Math.min(1, level)),
            };
        });
        setRemoteSpeakerLevels(list);
    };

    const clearRemoteSpeakerLevels = () => {
        activeSpeakerLevelMapRef.current.clear();
        setRemoteSpeakerLevels([]);
    };

    useEffect(() => {
        speakerEnabledRef.current = isSpeakerEnabled;
    }, [isSpeakerEnabled]);

    useEffect(() => {
        selectedRoomIdRef.current = selectedRoomId;
    }, [selectedRoomId]);

    useEffect(() => {
        return () => {
            livekitRoom?.disconnect();
        };
    }, [livekitRoom]);

    useEffect(() => {
        if (!FEED_WS_URL) return;
        const parsedChannelId = parseVoiceChannelId();
        if (parsedChannelId === null) return;

        const userId = localStorage.getItem("userId") ?? "";
        const client = new Client({
            brokerURL: FEED_WS_URL,
            reconnectDelay: 2000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            connectHeaders: { userId },
        });

        wsClientRef.current = client;

        client.onConnect = () => {
            subscribeVoiceChannelPresence(parsedChannelId);
            subscribeVoiceRoomChat(selectedRoomIdRef.current);
        };

        client.onDisconnect = () => {
            channelPresenceSubRef.current?.unsubscribe();
            roomChatSubRef.current?.unsubscribe();
            channelPresenceSubRef.current = null;
            roomChatSubRef.current = null;
        };

        client.onStompError = () => {
            channelPresenceSubRef.current?.unsubscribe();
            roomChatSubRef.current?.unsubscribe();
            channelPresenceSubRef.current = null;
            roomChatSubRef.current = null;
        };

        client.activate();

        return () => {
            channelPresenceSubRef.current?.unsubscribe();
            roomChatSubRef.current?.unsubscribe();
            channelPresenceSubRef.current = null;
            roomChatSubRef.current = null;
            void client.deactivate();
            wsClientRef.current = null;
        };
    }, []);

    useEffect(() => {
        subscribeVoiceRoomChat(selectedRoomId);
    }, [selectedRoomId]);

    useEffect(() => {
        const loadVoiceRooms = async () => {
            const parsedChannelId = parseVoiceChannelId();
            if (parsedChannelId === null) {
                setRoomLoadError("VITE_VOICE_CHANNEL_ID에 유효한 정수를 설정해주세요.");
                return;
            }

            setIsRoomLoading(true);
            setRoomLoadError(null);

            try {
                const userId = localStorage.getItem("userId") ?? "";
                const mappedRooms = await fetchVoiceRooms(parsedChannelId, userId, toParticipantLabel);

                setRooms(mappedRooms);
                setSelectedRoomId((prevSelectedRoomId) => {
                    if (prevSelectedRoomId && mappedRooms.some((room) => room.id === prevSelectedRoomId)) {
                        return prevSelectedRoomId;
                    }
                    return mappedRooms[0]?.id ?? null;
                });
            } catch (error) {
                const message = axios.isAxiosError(error)
                    ? error.response?.data?.message ?? "음성 채팅방 목록 조회에 실패했습니다."
                    : "음성 채팅방 목록 조회에 실패했습니다.";
                setRoomLoadError(message);
            } finally {
                setIsRoomLoading(false);
            }
        };

        void loadVoiceRooms();
    }, []);

    useEffect(() => {
        if (!selectedRoomId) return;

        const loadRoomMessages = async () => {
            setIsChatLoading(true);
            setChatLoadError(null);

            try {
                const messages = await fetchRoomMessages(selectedRoomId);
                setChatByRoom((prev) => ({
                    ...prev,
                    [selectedRoomId]: messages,
                }));
            } catch (error) {
                const message = axios.isAxiosError(error)
                    ? error.response?.data?.message ?? "채팅 메시지 조회에 실패했습니다."
                    : "채팅 메시지 조회에 실패했습니다.";
                setChatLoadError(message);
            } finally {
                setIsChatLoading(false);
            }
        };

        void loadRoomMessages();
    }, [selectedRoomId]);

    const handleJoinRoom = async (nextRoomId: string) => {
        if (isConnecting) return;
        if (!LIVEKIT_URL) {
            alert("VITE_LIVEKIT_URL 환경변수를 설정해주세요.");
            return;
        }

        setSelectedRoomId(nextRoomId);
        setIsConnecting(true);
        setConnectionError(null);
        setMicStatusMessage(null);

        const userId = localStorage.getItem("userId") ?? "";
        const previousJoinedRoomId = joinedRoomId;
        let nextLivekitRoom: Room | null = null;

        try {
            const token = await fetchLivekitToken(nextRoomId, MY_NAME, userId);

            if (livekitRoom) {
                livekitRoom.disconnect();
            }

            nextLivekitRoom = new Room();
            await nextLivekitRoom.connect(LIVEKIT_URL, token);
            const connectedRoom = nextLivekitRoom;
            applySpeakerState(connectedRoom, speakerEnabledRef.current);

            try {
                await connectedRoom.localParticipant.setMicrophoneEnabled(isMicEnabled);
                setMicStatusMessage(isMicEnabled ? "마이크 전송 중" : "마이크 꺼짐");
            } catch (micError) {
                const message =
                    micError instanceof Error
                        ? `마이크를 켤 수 없습니다: ${micError.message}`
                        : "마이크를 켤 수 없습니다. 권한/장치를 확인해주세요.";
                setMicStatusMessage(message);
                setIsMicEnabled(false);
            }

            connectedRoom.on(RoomEvent.Disconnected, () => {
                const shouldCallLeaveApi = !suppressDisconnectLeaveRef.current;
                suppressDisconnectLeaveRef.current = false;

                if (shouldCallLeaveApi) {
                    void callVoiceRoomPresence(nextRoomId, "leave", userId).catch(() => {
                        setConnectionError("연결이 끊겨 방 나가기 처리에 실패했습니다.");
                    });
                }

                setJoinedRoomId((currentJoinedRoomId) => (currentJoinedRoomId === nextRoomId ? null : currentJoinedRoomId));
                setLivekitRoom((currentRoom) => (currentRoom === connectedRoom ? null : currentRoom));
                setMicStatusMessage(null);
                clearAllRemoteAudioTracks();
                clearRemoteSpeakerLevels();
            });

            connectedRoom.on(RoomEvent.TrackPublished, (publication) => {
                if (!speakerEnabledRef.current && publication.kind === Track.Kind.Audio) {
                    publication.setSubscribed(false);
                }
            });

            connectedRoom.on(RoomEvent.TrackSubscribed, (track, publication) => {
                const trackKey = publication.trackSid ?? track.sid;
                attachRemoteAudioTrack(trackKey, track);
            });

            connectedRoom.on(RoomEvent.TrackUnsubscribed, (track, publication) => {
                const trackKey = publication.trackSid ?? track.sid;
                detachRemoteAudioTrack(trackKey, track);
            });

            connectedRoom.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
                const nextMap = new Map<string, number>();
                speakers.forEach((participant) => {
                    if (participant.identity === connectedRoom.localParticipant.identity) return;
                    nextMap.set(participant.identity, participant.audioLevel ?? 0);
                });
                activeSpeakerLevelMapRef.current = nextMap;
                syncRemoteSpeakerLevels(connectedRoom);
            });

            connectedRoom.on(RoomEvent.ParticipantConnected, () => {
                syncRemoteSpeakerLevels(connectedRoom);
            });

            connectedRoom.on(RoomEvent.ParticipantDisconnected, (participant) => {
                activeSpeakerLevelMapRef.current.delete(participant.identity);
                syncRemoteSpeakerLevels(connectedRoom);
            });

            if (previousJoinedRoomId && previousJoinedRoomId !== nextRoomId) {
                await callVoiceRoomPresence(previousJoinedRoomId, "leave", userId);
                setJoinedRoomId(null);
                suppressDisconnectLeaveRef.current = true;
            }

            await callVoiceRoomPresence(nextRoomId, "join", userId);
            setJoinedRoomId(nextRoomId);
            setLivekitRoom(connectedRoom);
            syncRemoteSpeakerLevels(connectedRoom);
        } catch (error) {
            nextLivekitRoom?.disconnect();

            const message = axios.isAxiosError(error)
                ? error.response?.data?.message ?? "LiveKit 연결 또는 음성방 참여 처리에 실패했습니다."
                : error instanceof Error
                  ? error.message
                  : "LiveKit 연결 또는 음성방 참여 처리에 실패했습니다.";

            setConnectionError(message);
            alert(message);
        } finally {
            setIsConnecting(false);
        }
    };

    const handleLeaveRoom = async () => {
        if (!joinedRoomId) return;

        const userId = localStorage.getItem("userId") ?? "";

        try {
            await callVoiceRoomPresence(joinedRoomId, "leave", userId);
        } catch (error) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message ?? "방 나가기 처리에 실패했습니다."
                : "방 나가기 처리에 실패했습니다.";
            setConnectionError(message);
        }

        suppressDisconnectLeaveRef.current = true;
        livekitRoom?.disconnect();
        clearAllRemoteAudioTracks();
        clearRemoteSpeakerLevels();
        setJoinedRoomId(null);
        setLivekitRoom(null);
        setMicStatusMessage(null);
    };

    const handleToggleMicrophone = async () => {
        if (!livekitRoom || !joinedRoomId) return;

        const nextMicEnabled = !isMicEnabled;
        try {
            await livekitRoom.localParticipant.setMicrophoneEnabled(nextMicEnabled);
            setIsMicEnabled(nextMicEnabled);
            setMicStatusMessage(nextMicEnabled ? "마이크 전송 중" : "마이크 꺼짐");
        } catch (error) {
            const message =
                error instanceof Error
                    ? `마이크 설정 실패: ${error.message}`
                    : "마이크 설정에 실패했습니다. 권한/장치를 확인해주세요.";
            setMicStatusMessage(message);
            setIsMicEnabled(false);
        }
    };

    const handleToggleSpeaker = () => {
        const nextSpeakerEnabled = !isSpeakerEnabled;
        setIsSpeakerEnabled(nextSpeakerEnabled);
        speakerEnabledRef.current = nextSpeakerEnabled;

        if (livekitRoom) {
            applySpeakerState(livekitRoom, nextSpeakerEnabled);
        }
    };

    const handleSendChat = async () => {
        if (!selectedRoom) return;

        const text = chatInput.trim();
        if (!text) return;
        if (!isJoinedSelectedRoom) {
            alert("채팅하려면 먼저 채널에 입장해주세요.");
            return;
        }

        try {
            const userId = localStorage.getItem("userId") ?? "";
            await sendRoomMessage(selectedRoom.id, text, userId);
            setChatInput("");
        } catch (error) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message ?? "메시지 전송에 실패했습니다."
                : "메시지 전송에 실패했습니다.";
            setChatLoadError(message);
        }
    };

    return (
        <section className="w-full min-h-[calc(100vh-9rem)] space-y-6">
            <div ref={audioContainerRef} className="hidden" />
            <VoiceHeader />

            <div className="grid gap-6 lg:grid-cols-12 min-h-[calc(100vh-18rem)]">
                <VoiceRoomsPanel
                    rooms={rooms}
                    selectedRoomId={selectedRoom?.id ?? null}
                    joinedRoomId={joinedRoomId}
                    isConnecting={isConnecting}
                    isRoomLoading={isRoomLoading}
                    roomLoadError={roomLoadError}
                    onSelectRoom={setSelectedRoomId}
                    onJoinRoom={(roomId) => {
                        void handleJoinRoom(roomId);
                    }}
                />

                <VoiceChatPanel
                    selectedRoomId={selectedRoom?.id ?? null}
                    joinedRoomId={joinedRoomId}
                    isJoinedSelectedRoom={isJoinedSelectedRoom}
                    isConnecting={isConnecting}
                    connectionError={connectionError}
                    isChatLoading={isChatLoading}
                    chatLoadError={chatLoadError}
                    isMicEnabled={isMicEnabled}
                    isSpeakerEnabled={isSpeakerEnabled}
                    micStatusMessage={micStatusMessage}
                    remoteSpeakerLevels={remoteSpeakerLevels}
                    roomChats={roomChats}
                    chatInput={chatInput}
                    onLeaveRoom={() => {
                        void handleLeaveRoom();
                    }}
                    onToggleMicrophone={() => {
                        void handleToggleMicrophone();
                    }}
                    onToggleSpeaker={handleToggleSpeaker}
                    onChatInputChange={setChatInput}
                    onSendChat={() => {
                        void handleSendChat();
                    }}
                />
            </div>
        </section>
    );
}
