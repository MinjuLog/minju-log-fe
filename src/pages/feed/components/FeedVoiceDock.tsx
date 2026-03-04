import axios from "axios";
import type { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChatMessage, VoiceRoom, VoiceRoomPresencePayload, VoiceRoomUserResponse } from "../../voice/types.ts";
import useHybridVoiceConnection from "../../voice/hooks/useHybridVoiceConnection.ts";
import {
    LIVEKIT_URL,
    callVoiceRoomLeaveOnPageExit,
    callVoiceRoomPresence,
    fetchLivekitToken,
    fetchRoomMessages,
    fetchVoiceRoomTransport,
    fetchVoiceRooms,
    parseVoiceChannelId,
    sendRoomMessage,
} from "../../voice/voiceApi.ts";

const MY_NAME = "나";
const INITIAL_CHAT: Record<string, ChatMessage[]> = {};

function formatChatTime(createdAt: string): string {
    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return "";
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function getInitial(name: string): string {
    const normalized = name.replace("(나)", "").trim();
    return normalized.charAt(0).toUpperCase() || "?";
}

type Props = {
    className?: string;
    preselectedRoomId?: string | null;
    preselectedRoomRequestKey?: number;
    onSpeakerLevelsChange?: (payload: {
        myLevel: number;
        remoteLevelByName: Record<string, number>;
        remoteLevelByIdentity: Record<string, number>;
    }) => void;
    onJoinedRoomIdChange?: (roomId: string | null) => void;
    onVoiceLeavingChange?: (leaving: boolean) => void;
    onVoiceSwitchingChange?: (switching: boolean) => void;
    wsClientRef: { current: Client | null };
    wsConnected: boolean;
};

export default function FeedVoiceDock({
    className = "",
    preselectedRoomId = null,
    preselectedRoomRequestKey = 0,
    onSpeakerLevelsChange,
    onJoinedRoomIdChange,
    onVoiceLeavingChange,
    onVoiceSwitchingChange,
    wsClientRef,
    wsConnected,
}: Props) {
    const [rooms, setRooms] = useState<VoiceRoom[]>([]);
    const [isRoomLoading, setIsRoomLoading] = useState(false);
    const [roomLoadError, setRoomLoadError] = useState<string | null>(null);
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [chatLoadError, setChatLoadError] = useState<string | null>(null);
    const [chatByRoom, setChatByRoom] = useState<Record<string, ChatMessage[]>>(INITIAL_CHAT);
    const [chatInput, setChatInput] = useState("");
    const [isRoomSwitching, setIsRoomSwitching] = useState(false);
    const [isMicDeviceMenuOpen, setIsMicDeviceMenuOpen] = useState(false);
    const [isSpeakerDeviceMenuOpen, setIsSpeakerDeviceMenuOpen] = useState(false);
    const roomTransportModeRef = useRef<Record<string, "mesh" | "sfu">>({});

    const channelPresenceSubRef = useRef<StompSubscription | null>(null);
    const roomChatSubRef = useRef<StompSubscription | null>(null);
    const currentUserIdRef = useRef<number>(Number(localStorage.getItem("userId") ?? NaN));
    const roomsRef = useRef<VoiceRoom[]>([]);
    const joinedRoomIdRef = useRef<string | null>(null);
    const hasSentLeaveOnExitRef = useRef(false);
    const chatScrollRef = useRef<HTMLDivElement | null>(null);
    const queuedSwitchRoomIdRef = useRef<string | null>(null);
    const switchingRoomRef = useRef(false);
    const selectedRoomIdRef = useRef<string | null>(null);
    const connectionModeRef = useRef<"mesh" | "sfu">("sfu");
    const switchModeRef = useRef<(mode: "mesh" | "sfu", roomIdHint?: string | null) => Promise<void>>(async () => {});
    const joinRoomRef = useRef<(roomId: string) => Promise<void>>(async () => {});
    const leaveRoomRef = useRef<() => Promise<void>>(async () => {});

    const {
        audioContainerRef,
        mode: connectionMode,
        switchMode,
        joinedRoomId,
        isConnecting,
        connectionError,
        isMicEnabled,
        isSpeakerEnabled,
        micStatusMessage,
        micDeviceLabel,
        micDevices,
        selectedMicDeviceId,
        speakerDeviceLabel,
        speakerDevices,
        selectedSpeakerDeviceId,
        mySpeakerLevel,
        remoteSpeakerLevels,
        joinRoom,
        leaveRoom,
        toggleMicrophone,
        selectMicrophoneDevice,
        selectSpeakerDevice,
        toggleSpeaker,
    } = useHybridVoiceConnection({
        livekitUrl: LIVEKIT_URL,
        participantName: MY_NAME,
        getUserId: () => localStorage.getItem("userId") ?? "",
        fetchLivekitToken,
        callVoiceRoomPresence,
        wsClientRef,
        wsConnected,
        initialMode: "sfu",
    });

    joinRoomRef.current = joinRoom;
    leaveRoomRef.current = leaveRoom;
    switchModeRef.current = switchMode;

    const selectedRoom = useMemo(() => {
        if (!selectedRoomId) return rooms[0] ?? null;
        return rooms.find((room) => room.id === selectedRoomId) ?? rooms[0] ?? null;
    }, [rooms, selectedRoomId]);

    const runQueuedRoomSwitch = async () => {
        if (switchingRoomRef.current) return;
        switchingRoomRef.current = true;
        setIsRoomSwitching(true);
        onVoiceSwitchingChange?.(true);
        try {
            while (queuedSwitchRoomIdRef.current) {
                const nextRoomId = queuedSwitchRoomIdRef.current;
                queuedSwitchRoomIdRef.current = null;
                setSelectedRoomId(nextRoomId);

                let targetMode = roomTransportModeRef.current[nextRoomId];
                if (!targetMode) {
                    try {
                        const transport = await fetchVoiceRoomTransport(nextRoomId);
                        const fetchedMode = transport?.effectiveMode;
                        if (fetchedMode === "mesh" || fetchedMode === "sfu") {
                            targetMode = fetchedMode;
                            roomTransportModeRef.current[nextRoomId] = fetchedMode;
                        }
                    } catch {
                        // Ignore mode fetch errors and fallback to current mode join flow.
                    }
                }
                if (targetMode && targetMode !== connectionModeRef.current) {
                    await switchModeRef.current(targetMode, nextRoomId);
                    continue;
                }

                if (joinedRoomIdRef.current === nextRoomId) {
                    continue;
                }

                if (joinedRoomIdRef.current) {
                    onVoiceLeavingChange?.(true);
                    await leaveRoomRef.current();
                    onVoiceLeavingChange?.(false);
                }
                await joinRoomRef.current(nextRoomId);
            }
        } finally {
            onVoiceLeavingChange?.(false);
            switchingRoomRef.current = false;
            setIsRoomSwitching(false);
            onVoiceSwitchingChange?.(false);
        }
    };

    useEffect(() => {
        if (!preselectedRoomId) return;
        queuedSwitchRoomIdRef.current = preselectedRoomId;
        void runQueuedRoomSwitch();
    }, [preselectedRoomId, preselectedRoomRequestKey]);

    const roomChats = selectedRoom ? (chatByRoom[selectedRoom.id] ?? []) : [];
    const isJoinedSelectedRoom = selectedRoom ? joinedRoomId === selectedRoom.id : false;

    useEffect(() => {
        const chatContainer = chatScrollRef.current;
        if (!chatContainer) return;
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, [roomChats, selectedRoom?.id]);

    useEffect(() => {
        if (!onSpeakerLevelsChange) return;
        const remoteLevelByName: Record<string, number> = {};
        const remoteLevelByIdentity: Record<string, number> = {};
        remoteSpeakerLevels.forEach((speaker) => {
            remoteLevelByName[speaker.name] = speaker.level;
            remoteLevelByIdentity[speaker.participantId] = speaker.level;
        });
        onSpeakerLevelsChange({
            myLevel: mySpeakerLevel,
            remoteLevelByName,
            remoteLevelByIdentity,
        });
    }, [mySpeakerLevel, onSpeakerLevelsChange, remoteSpeakerLevels]);

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
                          participants: users.map((user) => ({
                              userId: user.userId,
                              name: user.username,
                              label: toParticipantLabel(user),
                          })),
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
    const isMyMessage = (message: ChatMessage): boolean =>
        !Number.isNaN(currentUserIdRef.current) && message.senderId === currentUserIdRef.current;

    const subscribeVoiceChannelPresence = (channelId: number | null) => {
        channelPresenceSubRef.current?.unsubscribe();
        channelPresenceSubRef.current = null;

        if (channelId === null || !wsClientRef.current?.connected) return;

        channelPresenceSubRef.current = wsClientRef.current.subscribe(`/topic/voice.channel.${channelId}`, (msg: IMessage) => {
            const payload: VoiceRoomPresencePayload = JSON.parse(msg.body);
            const roomId = String(payload.roomId);
            applyRoomUsersFromBroadcast(roomId, payload.onlineUsers ?? []);

            const nextMode = payload.hybridTransport?.effectiveMode;
            if (!nextMode) return;

            const previousMode = roomTransportModeRef.current[roomId];
            roomTransportModeRef.current[roomId] = nextMode;

            if (previousMode === nextMode) return;
            if (switchingRoomRef.current) return;
            if (selectedRoomIdRef.current !== roomId && joinedRoomIdRef.current !== roomId) return;

            const roomIdHint = selectedRoomIdRef.current === roomId || joinedRoomIdRef.current === roomId ? roomId : null;
            void switchModeRef.current(nextMode, roomIdHint).catch(() => {
                setChatLoadError("연결 모드 전환에 실패했습니다.");
            });
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
        roomsRef.current = rooms;
    }, [rooms]);

    useEffect(() => {
        joinedRoomIdRef.current = joinedRoomId;
    }, [joinedRoomId]);

    useEffect(() => {
        selectedRoomIdRef.current = selectedRoomId;
    }, [selectedRoomId]);

    useEffect(() => {
        connectionModeRef.current = connectionMode;
    }, [connectionMode]);

    useEffect(() => {
        onJoinedRoomIdChange?.(joinedRoomId);
    }, [joinedRoomId, onJoinedRoomIdChange]);

    const handleLeaveRoom = async () => {
        onVoiceLeavingChange?.(true);
        try {
            await leaveRoom();
        } finally {
            onVoiceLeavingChange?.(false);
        }
    };

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
        channelPresenceSubRef.current?.unsubscribe();
        roomChatSubRef.current?.unsubscribe();
        channelPresenceSubRef.current = null;
        roomChatSubRef.current = null;

        const parsedChannelId = parseVoiceChannelId();
        if (!wsConnected || !wsClientRef.current?.connected || !joinedRoomId || parsedChannelId === null) return;

        subscribeVoiceChannelPresence(parsedChannelId);
        subscribeVoiceRoomChat(joinedRoomId);

        return () => {
            channelPresenceSubRef.current?.unsubscribe();
            roomChatSubRef.current?.unsubscribe();
            channelPresenceSubRef.current = null;
            roomChatSubRef.current = null;
        };
    }, [joinedRoomId, wsConnected]);

    useEffect(() => {
        const loadVoiceRooms = async () => {
            const parsedChannelId = parseVoiceChannelId();
            if (parsedChannelId === null) {
                setRoomLoadError("VITE_VOICE_CHANNEL_ID를 설정해주세요.");
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
            alert("채팅하려면 먼저 음성 채널에 입장해주세요.");
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
        <section className={className}>
            <div ref={audioContainerRef} className="hidden" />
            <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{selectedRoom ? `🔊 ${selectedRoom.name}` : "보이스 채널"}</h2>
                        <p className="mt-1 text-xs text-gray-500">
                            {wsConnected ? "실시간 연결됨" : "연결 중"} · {joinedRoomId ? "음성 참여 중" : "미참여"} · 모드:{" "}
                            {connectionMode === "mesh" ? "MESH" : "SFU"}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <button
                                type="button"
                                onClick={(e) => {
                                    const target = e.target as HTMLElement;
                                    if (target.closest("[data-mic-menu]")) {
                                        setIsMicDeviceMenuOpen((prev) => !prev);
                                        return;
                                    }
                                    void toggleMicrophone();
                                }}
                                disabled={!joinedRoomId || isConnecting || isRoomSwitching}
                                className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold disabled:opacity-50 ${
                                    isMicEnabled ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
                                }`}
                            >
                                <span>{isMicEnabled ? `Mic ON (${micDeviceLabel})` : `Mic OFF (${micDeviceLabel})`}</span>
                                <span data-mic-menu className="rounded px-1 text-[11px] hover:bg-black/10">
                                    ▾
                                </span>
                            </button>

                            {isMicDeviceMenuOpen && (
                                <div className="absolute right-0 z-20 mt-1 w-56 rounded-md border border-gray-200 bg-white p-1 shadow-md">
                                    {micDevices.length === 0 ? (
                                        <p className="px-2 py-2 text-xs text-gray-500">사용 가능한 마이크 없음</p>
                                    ) : (
                                        micDevices.map((device) => (
                                            <button
                                                key={device.id}
                                                type="button"
                                                onClick={() => {
                                                    void selectMicrophoneDevice(device.id);
                                                    setIsMicDeviceMenuOpen(false);
                                                }}
                                                className={`block w-full rounded px-2 py-1.5 text-left text-xs ${
                                                    selectedMicDeviceId === device.id
                                                        ? "bg-blue-50 font-semibold text-blue-700"
                                                        : "text-gray-700 hover:bg-gray-50"
                                                }`}
                                            >
                                                {device.label}
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={(e) => {
                                    const target = e.target as HTMLElement;
                                    if (target.closest("[data-speaker-menu]")) {
                                        setIsSpeakerDeviceMenuOpen((prev) => !prev);
                                        return;
                                    }
                                    toggleSpeaker();
                                }}
                                disabled={!joinedRoomId || isConnecting || isRoomSwitching}
                                className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold disabled:opacity-50 ${
                                    isSpeakerEnabled ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                                }`}
                            >
                                <span>{isSpeakerEnabled ? `Spk ON (${speakerDeviceLabel})` : `Spk OFF (${speakerDeviceLabel})`}</span>
                                <span data-speaker-menu className="rounded px-1 text-[11px] hover:bg-black/10">
                                    ▾
                                </span>
                            </button>

                            {isSpeakerDeviceMenuOpen && (
                                <div className="absolute right-0 z-20 mt-1 w-56 rounded-md border border-gray-200 bg-white p-1 shadow-md">
                                    {speakerDevices.length === 0 ? (
                                        <p className="px-2 py-2 text-xs text-gray-500">사용 가능한 스피커 없음</p>
                                    ) : (
                                        speakerDevices.map((device) => (
                                            <button
                                                key={device.id}
                                                type="button"
                                                onClick={() => {
                                                    void selectSpeakerDevice(device.id);
                                                    setIsSpeakerDeviceMenuOpen(false);
                                                }}
                                                className={`block w-full rounded px-2 py-1.5 text-left text-xs ${
                                                    selectedSpeakerDeviceId === device.id
                                                        ? "bg-blue-50 font-semibold text-blue-700"
                                                        : "text-gray-700 hover:bg-gray-50"
                                                }`}
                                            >
                                                {device.label}
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                void handleLeaveRoom();
                            }}
                            disabled={!joinedRoomId || isRoomSwitching}
                            className="rounded-md bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-600 disabled:opacity-50"
                        >
                            나가기
                        </button>
                    </div>
                </div>

                {connectionError && <p className="mb-2 text-xs text-red-500">{connectionError}</p>}
                {roomLoadError && <p className="mb-2 text-xs text-red-500">{roomLoadError}</p>}
                {chatLoadError && <p className="mb-2 text-xs text-red-500">{chatLoadError}</p>}
                {micStatusMessage && <p className="mb-2 text-xs text-amber-700">{micStatusMessage}</p>}
                {isRoomLoading && <p className="mb-2 text-xs text-gray-500">방 목록 로딩 중...</p>}
                {isRoomSwitching && <p className="mb-2 text-xs text-blue-600">이전 채팅방에서 나가는 중...</p>}

                <p className="mb-3 text-[11px] text-gray-500">
                    내 입력: {Math.round(mySpeakerLevel * 100)}% / 상대 {remoteSpeakerLevels.length}명
                </p>

                <div className="flex h-[560px] flex-col rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">채팅</p>
                    <div ref={chatScrollRef} className="mb-3 h-[470px] overflow-y-auto rounded-lg border border-gray-200 bg-white p-3">
                        {!selectedRoom ? (
                            <p className="text-sm text-gray-500">좌측에서 음성 채팅방을 선택하세요.</p>
                        ) : isChatLoading ? (
                            <p className="text-sm text-gray-500">메시지 로딩 중...</p>
                        ) : roomChats.length === 0 ? (
                            <p className="text-sm text-gray-500">아직 채팅이 없습니다.</p>
                        ) : (
                            <div className="space-y-2">
                                {roomChats.map((message) => {
                                    const mine = isMyMessage(message);

                                    return (
                                        <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                                            <div
                                                className={`max-w-[80%] rounded-xl border px-3 py-2.5 ${
                                                    mine ? "border-blue-200 bg-blue-50" : "border-gray-100 bg-gray-50"
                                                }`}
                                            >
                                                <div className={`flex items-center gap-2 text-[11px] ${mine ? "justify-end text-blue-700" : "text-gray-500"}`}>
                                                    {!mine && (
                                                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-semibold text-blue-700">
                                                            {getInitial(message.senderName)}
                                                        </span>
                                                    )}
                                                    <span className={`font-semibold ${mine ? "text-blue-700" : "text-gray-700"}`}>
                                                        {mine ? "나" : message.senderName}
                                                    </span>
                                                    <span>{formatChatTime(message.createdAt)}</span>
                                                </div>
                                                <p className={`mt-1 break-words whitespace-pre-wrap text-sm ${mine ? "text-blue-900" : "text-gray-800"}`}>
                                                    {message.content}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <input
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    void handleSendChat();
                                }
                            }}
                            disabled={!selectedRoom}
                            placeholder="메시지 입력"
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 disabled:opacity-50"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                void handleSendChat();
                            }}
                            disabled={!selectedRoom}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            전송
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
