import axios from "axios";
import { Room, RoomEvent, Track } from "livekit-client";
import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../feed/api/api.ts";
import VoiceHeader from "../../components/VoiceHeader.tsx";

type VoiceRoom = {
    id: string;
    name: string;
    topic: "자유대화방";
    participants: string[];
};

type ChatMessage = {
    id: string;
    sender: string;
    text: string;
    time: string;
};

type LivekitTokenResponse = {
    token: string;
    roomName: string;
    identity: string;
    participantName: string;
};

type VoiceRoomUserResponse = {
    userId: number;
    username: string;
};

type VoiceRoomApiResponse = {
    id: string;
    title: string;
    active: boolean;
    createdAt: string;
    onlineUsers: VoiceRoomUserResponse[];
};

const MY_NAME = "나";
const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL as string | undefined;
const LIVEKIT_TOKEN_ENDPOINT =
    (import.meta.env.VITE_LIVEKIT_TOKEN_ENDPOINT as string | undefined) ?? "/api/voice/livekit/token";
const VOICE_CHANNEL_ID = import.meta.env.VITE_VOICE_CHANNEL_ID as string | undefined;

const INITIAL_CHAT: Record<string, ChatMessage[]> = {};

export default function VoicePage() {
    const [rooms, setRooms] = useState<VoiceRoom[]>([]);
    const [isRoomLoading, setIsRoomLoading] = useState(false);
    const [roomLoadError, setRoomLoadError] = useState<string | null>(null);
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [joinedRoomId, setJoinedRoomId] = useState<string | null>(null);
    const [livekitRoom, setLivekitRoom] = useState<Room | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const [isMicEnabled, setIsMicEnabled] = useState(true);
    const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(true);
    const [micStatusMessage, setMicStatusMessage] = useState<string | null>(null);
    const [chatByRoom, setChatByRoom] = useState<Record<string, ChatMessage[]>>(INITIAL_CHAT);
    const [chatInput, setChatInput] = useState("");
    const speakerEnabledRef = useRef(isSpeakerEnabled);

    const selectedRoom = useMemo(() => {
        if (!selectedRoomId) return rooms[0] ?? null;
        return rooms.find((room) => room.id === selectedRoomId) ?? rooms[0] ?? null;
    }, [rooms, selectedRoomId]);

    const roomChats = selectedRoom ? (chatByRoom[selectedRoom.id] ?? []) : [];
    const isJoinedSelectedRoom = selectedRoom ? joinedRoomId === selectedRoom.id : false;

    useEffect(() => {
        speakerEnabledRef.current = isSpeakerEnabled;
    }, [isSpeakerEnabled]);

    useEffect(() => {
        return () => {
            livekitRoom?.disconnect();
        };
    }, [livekitRoom]);

    useEffect(() => {
        const fetchVoiceRooms = async () => {
            const parsedChannelId = Number(VOICE_CHANNEL_ID);
            if (!VOICE_CHANNEL_ID || Number.isNaN(parsedChannelId) || !Number.isInteger(parsedChannelId)) {
                setRoomLoadError("VITE_VOICE_CHANNEL_ID에 유효한 정수를 설정해주세요.");
                return;
            }

            const userId = localStorage.getItem("userId") ?? "";
            setIsRoomLoading(true);
            setRoomLoadError(null);

            try {
                const res = await api.get(`/api/voice/channels/${parsedChannelId}/rooms`, {
                    headers: {
                        "X-User-Id": userId,
                    },
                });

                const payload = res.data?.result ?? res.data;
                const roomList: VoiceRoomApiResponse[] = Array.isArray(payload)
                    ? payload
                    : Array.isArray(payload?.rooms)
                        ? payload.rooms
                        : [];

                const mappedRooms: VoiceRoom[] = roomList.map((room) => ({
                    id: String(room.id),
                    name: room.title,
                    topic: "자유대화방",
                    participants: (room.onlineUsers ?? []).map((user) => user.username),
                }));

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

        void fetchVoiceRooms();
    }, []);

    const removeMyParticipant = (targetRoomId: string | null) => {
        if (!targetRoomId) return;

        setRooms((prev) =>
            prev.map((room) =>
                room.id === targetRoomId
                    ? { ...room, participants: room.participants.filter((name) => name !== MY_NAME) }
                    : room,
            ),
        );
    };

    const addMyParticipant = (targetRoomId: string) => {
        setRooms((prev) =>
            prev.map((room) => {
                if (room.id === targetRoomId && !room.participants.includes(MY_NAME)) {
                    return {
                        ...room,
                        participants: [...room.participants, MY_NAME],
                    };
                }

                return room;
            }),
        );
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

    const fetchLivekitToken = async (roomName: string): Promise<string> => {
        const userId = localStorage.getItem("userId") ?? "";
        const payload = { roomName, participantName: MY_NAME };
        const headers = {
            "X-User-Id": userId,
        };

        const request = LIVEKIT_TOKEN_ENDPOINT.startsWith("http")
            ? axios.post<LivekitTokenResponse>(LIVEKIT_TOKEN_ENDPOINT, payload, { headers })
            : api.post<LivekitTokenResponse>(LIVEKIT_TOKEN_ENDPOINT, payload, { headers });

        const res = await request;
        return res.data.token;
    };

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

        const previousJoinedRoomId = joinedRoomId;
        let nextLivekitRoom: Room | null = null;

        try {
            const token = await fetchLivekitToken(nextRoomId);

            if (livekitRoom) {
                livekitRoom.disconnect();
            }

            nextLivekitRoom = new Room();
            await nextLivekitRoom.connect(LIVEKIT_URL, token);
            applySpeakerState(nextLivekitRoom, speakerEnabledRef.current);

            try {
                await nextLivekitRoom.localParticipant.setMicrophoneEnabled(isMicEnabled);
                setMicStatusMessage(isMicEnabled ? "마이크 전송 중" : "마이크 꺼짐");
            } catch (micError) {
                const message =
                    micError instanceof Error
                        ? `마이크를 켤 수 없습니다: ${micError.message}`
                        : "마이크를 켤 수 없습니다. 권한/장치를 확인해주세요.";
                setMicStatusMessage(message);
                setIsMicEnabled(false);
            }

            nextLivekitRoom.on(RoomEvent.Disconnected, () => {
                setJoinedRoomId((currentJoinedRoomId) => {
                    if (currentJoinedRoomId === nextRoomId) {
                        removeMyParticipant(nextRoomId);
                        return null;
                    }

                    return currentJoinedRoomId;
                });
                setLivekitRoom((currentRoom) => (currentRoom === nextLivekitRoom ? null : currentRoom));
            });

            nextLivekitRoom.on(RoomEvent.TrackPublished, (publication) => {
                if (!speakerEnabledRef.current && publication.kind === Track.Kind.Audio) {
                    publication.setSubscribed(false);
                }
            });

            if (previousJoinedRoomId && previousJoinedRoomId !== nextRoomId) {
                removeMyParticipant(previousJoinedRoomId);
            }

            addMyParticipant(nextRoomId);
            setJoinedRoomId(nextRoomId);
            setLivekitRoom(nextLivekitRoom);
        } catch (error) {
            nextLivekitRoom?.disconnect();

            const message = axios.isAxiosError(error)
                ? error.response?.data?.message ?? "LiveKit 토큰 발급에 실패했습니다."
                : error instanceof Error
                    ? error.message
                    : "LiveKit 연결에 실패했습니다.";

            setConnectionError(message);
            alert(message);
        } finally {
            setIsConnecting(false);
        }
    };

    const handleLeaveRoom = () => {
        if (!joinedRoomId) return;

        livekitRoom?.disconnect();
        removeMyParticipant(joinedRoomId);
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

    const handleSendChat = () => {
        if (!selectedRoom) return;

        const text = chatInput.trim();
        if (!text) return;
        if (!isJoinedSelectedRoom) {
            alert("채팅하려면 먼저 채널에 입장해주세요.");
            return;
        }

        const now = new Date();
        const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

        const nextMessage: ChatMessage = {
            id: `${selectedRoom.id}-${now.getTime()}`,
            sender: MY_NAME,
            text,
            time,
        };

        setChatByRoom((prev) => ({
            ...prev,
            [selectedRoom.id]: [...(prev[selectedRoom.id] ?? []), nextMessage],
        }));
        setChatInput("");
    };

    return (
        <section className="w-full min-h-[calc(100vh-9rem)] space-y-6">
            <VoiceHeader />

            <div className="grid gap-6 lg:grid-cols-12 min-h-[calc(100vh-18rem)]">
                <aside className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:col-span-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Voice Channels</p>

                    {isRoomLoading && <p className="text-sm text-gray-500">방 목록 불러오는 중...</p>}
                    {roomLoadError && <p className="text-sm text-red-500">{roomLoadError}</p>}

                    {!isRoomLoading && !roomLoadError && rooms.length === 0 && (
                        <p className="text-sm text-gray-500">생성된 음성 채팅방이 없습니다.</p>
                    )}

                    <div className="space-y-2 max-h-[calc(100vh-22rem)] overflow-y-auto pr-1">
                        {rooms.map((room) => {
                            const isSelected = room.id === selectedRoom?.id;
                            const isJoined = room.id === joinedRoomId;

                            return (
                                <div
                                    key={room.id}
                                    className={`group relative w-full rounded-xl border px-4 py-3 text-left transition ${
                                        isSelected
                                            ? "border-blue-500 bg-blue-50/40"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setSelectedRoomId(room.id)}
                                        className="w-full text-left"
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-semibold text-gray-900">🔊 {room.name}</p>
                                            <span
                                                className={`h-2.5 w-2.5 rounded-full ${
                                                    isJoined ? "bg-green-500" : "bg-gray-300"
                                                }`}
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500">참가자 {room.participants.length}명</p>
                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                            {room.participants.map((name) => (
                                                <span
                                                    key={`${room.id}-chip-${name}`}
                                                    className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600"
                                                >
                                                    {name}
                                                </span>
                                            ))}
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            void handleJoinRoom(room.id);
                                        }}
                                        disabled={isConnecting}
                                        className={`absolute right-3 top-3 rounded-md px-3 py-1 text-xs font-semibold text-white transition ${
                                            isJoined ? "bg-emerald-600" : "bg-blue-600 hover:bg-blue-700"
                                        } ${
                                            isConnecting
                                                ? "cursor-not-allowed opacity-60"
                                                : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                                        }`}
                                    >
                                        {isJoined ? "접속 중" : "입장"}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </aside>

                <main className="lg:col-span-8 flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-3 border-b border-gray-200 pb-3">
                        <h2 className="text-sm font-semibold text-gray-900">방 채팅</h2>
                        {isJoinedSelectedRoom ? (
                            <button
                                type="button"
                                onClick={handleLeaveRoom}
                                disabled={isConnecting}
                                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                            >
                                방 나가기
                            </button>
                        ) : (
                            <span className="text-xs text-gray-500">방 카드에 마우스를 올리면 입장 버튼이 나타납니다</span>
                        )}
                    </div>

                    {connectionError && <p className="mt-3 text-xs text-red-500">{connectionError}</p>}

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                joinedRoomId ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                            }`}
                        >
                            {joinedRoomId ? `연결됨: ${joinedRoomId}` : "연결 안됨"}
                        </span>
                        <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                isMicEnabled ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                            }`}
                        >
                            {isMicEnabled ? "마이크 ON (전송중)" : "마이크 OFF"}
                        </span>
                        <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                isSpeakerEnabled ? "bg-violet-100 text-violet-700" : "bg-gray-100 text-gray-600"
                            }`}
                        >
                            {isSpeakerEnabled ? "스피커 ON" : "스피커 OFF"}
                        </span>
                        <button
                            type="button"
                            onClick={() => {
                                void handleToggleMicrophone();
                            }}
                            disabled={!joinedRoomId || isConnecting}
                            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isMicEnabled ? "마이크 끄기" : "마이크 켜기"}
                        </button>
                        <button
                            type="button"
                            onClick={handleToggleSpeaker}
                            disabled={!joinedRoomId || isConnecting}
                            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSpeakerEnabled ? "스피커 끄기" : "스피커 켜기"}
                        </button>
                    </div>

                    {micStatusMessage && <p className="mt-2 text-xs text-amber-700">{micStatusMessage}</p>}

                    <div className="mt-4 flex-1 min-h-[24rem] max-h-[calc(100vh-22rem)] overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3">
                        {!selectedRoom ? (
                            <p className="text-sm text-gray-500">선택된 채팅방이 없습니다.</p>
                        ) : roomChats.length === 0 ? (
                            <p className="text-sm text-gray-500">아직 채팅이 없습니다.</p>
                        ) : (
                            <div className="space-y-3">
                                {roomChats.map((message) => (
                                    <div key={message.id} className="rounded-md bg-white p-2.5">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <span className="font-semibold text-gray-700">{message.sender}</span>
                                            <span>{message.time}</span>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-800">{message.text}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-3 flex gap-2">
                        <input
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSendChat();
                            }}
                            placeholder="메시지를 입력하세요"
                            className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={!selectedRoom}
                        />
                        <button
                            type="button"
                            onClick={handleSendChat}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={!selectedRoom}
                        >
                            전송
                        </button>
                    </div>
                </main>
            </div>
        </section>
    );
}
