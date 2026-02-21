import axios from "axios";
import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import { useEffect, useMemo, useRef, useState } from "react";
import VoiceHeader from "../../components/VoiceHeader.tsx";
import VoiceChatPanel from "./VoiceChatPanel.tsx";
import VoiceRoomsPanel from "./VoiceRoomsPanel.tsx";
import useLivekitVoiceConnection from "./hooks/useLivekitVoiceConnection.ts";
import ConnectionStatus from "../feed/components/ConnectionStatus.tsx";
import type { ChatMessage, VoiceRoom, VoiceRoomPresencePayload, VoiceRoomUserResponse } from "./types.ts";
import {
    FEED_WS_URL,
    LIVEKIT_URL,
    callVoiceRoomPresence,
    callVoiceRoomLeaveOnPageExit,
    fetchLivekitToken,
    fetchRoomMessages,
    fetchVoiceRooms,
    parseVoiceChannelId,
    sendRoomMessage,
} from "./voiceApi.ts";

const MY_NAME = "나";
const INITIAL_CHAT: Record<string, ChatMessage[]> = {};

export default function VoicePage() {
    const [rooms, setRooms] = useState<VoiceRoom[]>([]);
    const [isRoomLoading, setIsRoomLoading] = useState(false);
    const [roomLoadError, setRoomLoadError] = useState<string | null>(null);
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [chatLoadError, setChatLoadError] = useState<string | null>(null);
    const [chatByRoom, setChatByRoom] = useState<Record<string, ChatMessage[]>>(INITIAL_CHAT);
    const [chatInput, setChatInput] = useState("");
    const [isWsConnected, setIsWsConnected] = useState(false);

    const wsClientRef = useRef<Client | null>(null);
    const channelPresenceSubRef = useRef<StompSubscription | null>(null);
    const roomChatSubRef = useRef<StompSubscription | null>(null);
    const currentUserIdRef = useRef<number>(Number(localStorage.getItem("userId") ?? NaN));
    const selectedRoomIdRef = useRef<string | null>(null);
    const roomsRef = useRef<VoiceRoom[]>([]);
    const joinedRoomIdRef = useRef<string | null>(null);
    const hasSentLeaveOnExitRef = useRef(false);

    const {
        audioContainerRef,
        joinedRoomId,
        isConnecting,
        connectionError,
        isMicEnabled,
        isSpeakerEnabled,
        micStatusMessage,
        micDeviceLabel,
        speakerDeviceLabel,
        mySpeakerLevel,
        remoteSpeakerLevels,
        joinRoom,
        leaveRoom,
        toggleMicrophone,
        toggleSpeaker,
    } = useLivekitVoiceConnection({
        livekitUrl: LIVEKIT_URL,
        participantName: MY_NAME,
        getUserId: () => localStorage.getItem("userId") ?? "",
        fetchLivekitToken,
        callVoiceRoomPresence,
    });

    const selectedRoom = useMemo(() => {
        if (!selectedRoomId) return rooms[0] ?? null;
        return rooms.find((room) => room.id === selectedRoomId) ?? rooms[0] ?? null;
    }, [rooms, selectedRoomId]);
    const joinedRoomName = useMemo(
        () => rooms.find((room) => room.id === joinedRoomId)?.name ?? null,
        [rooms, joinedRoomId],
    );

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

    useEffect(() => {
        selectedRoomIdRef.current = selectedRoomId;
    }, [selectedRoomId]);

    useEffect(() => {
        roomsRef.current = rooms;
    }, [rooms]);

    useEffect(() => {
        joinedRoomIdRef.current = joinedRoomId;
    }, [joinedRoomId]);

    useEffect(() => {
        const sendLeaveForAllRooms = () => {
            if (hasSentLeaveOnExitRef.current) return;
            hasSentLeaveOnExitRef.current = true;

            const userId = localStorage.getItem("userId") ?? "";
            const roomIds = new Set(roomsRef.current.map((room) => room.id));
            if (joinedRoomIdRef.current) {
                roomIds.add(joinedRoomIdRef.current);
            }
            roomIds.forEach((roomId) => {
                void callVoiceRoomPresence(roomId, "leave", userId);
                callVoiceRoomLeaveOnPageExit(roomId, userId);
            });
        };

        const handlePageExit = () => {
            sendLeaveForAllRooms();
        };
        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                sendLeaveForAllRooms();
            }
        };

        window.addEventListener("pagehide", handlePageExit);
        window.addEventListener("beforeunload", handlePageExit);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.removeEventListener("pagehide", handlePageExit);
            window.removeEventListener("beforeunload", handlePageExit);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            sendLeaveForAllRooms();
        };
    }, []);

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
            setIsWsConnected(true);
            subscribeVoiceChannelPresence(parsedChannelId);
            subscribeVoiceRoomChat(selectedRoomIdRef.current);
        };

        client.onDisconnect = () => {
            setIsWsConnected(false);
            channelPresenceSubRef.current?.unsubscribe();
            roomChatSubRef.current?.unsubscribe();
            channelPresenceSubRef.current = null;
            roomChatSubRef.current = null;
        };

        client.onStompError = () => {
            setIsWsConnected(false);
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
            setIsWsConnected(false);
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
            <div className="flex justify-end">
                <ConnectionStatus connected={isWsConnected} />
            </div>

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
                        setSelectedRoomId(roomId);
                        void joinRoom(roomId);
                    }}
                />

                <VoiceChatPanel
                    selectedRoomId={selectedRoom?.id ?? null}
                    joinedRoomId={joinedRoomId}
                    joinedRoomName={joinedRoomName}
                    isJoinedSelectedRoom={isJoinedSelectedRoom}
                    isConnecting={isConnecting}
                    connectionError={connectionError}
                    isChatLoading={isChatLoading}
                    chatLoadError={chatLoadError}
                    isMicEnabled={isMicEnabled}
                    isSpeakerEnabled={isSpeakerEnabled}
                    micStatusMessage={micStatusMessage}
                    micDeviceLabel={micDeviceLabel}
                    speakerDeviceLabel={speakerDeviceLabel}
                    mySpeakerLevel={mySpeakerLevel}
                    remoteSpeakerLevels={remoteSpeakerLevels}
                    roomChats={roomChats}
                    chatInput={chatInput}
                    onLeaveRoom={() => {
                        void leaveRoom();
                    }}
                    onToggleMicrophone={() => {
                        void toggleMicrophone();
                    }}
                    onToggleSpeaker={toggleSpeaker}
                    onChatInputChange={setChatInput}
                    onSendChat={() => {
                        void handleSendChat();
                    }}
                />
            </div>
        </section>
    );
}
