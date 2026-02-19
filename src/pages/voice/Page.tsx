import { useMemo, useState } from "react";
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

const MY_NAME = "나";

const FIXED_ROOMS: VoiceRoom[] = [
    { id: "voice-1", name: "음성방 1", topic: "자유대화방", participants: ["민지", "지훈", "서연"] },
    { id: "voice-2", name: "음성방 2", topic: "자유대화방", participants: ["태호", "수빈"] },
    { id: "voice-3", name: "음성방 3", topic: "자유대화방", participants: ["하늘", "도윤", "유진"] },
    { id: "voice-4", name: "음성방 4", topic: "자유대화방", participants: ["시우"] },
];

const INITIAL_CHAT: Record<string, ChatMessage[]> = {
    "voice-1": [{ id: "m1", sender: "민지", text: "안녕하세요!", time: "09:10" }],
    "voice-2": [{ id: "m2", sender: "태호", text: "오늘도 자유대화방입니다.", time: "09:15" }],
    "voice-3": [{ id: "m3", sender: "하늘", text: "편하게 이야기 나눠요.", time: "09:20" }],
    "voice-4": [{ id: "m4", sender: "시우", text: "혼자 대기 중...", time: "09:22" }],
};

export default function VoicePage() {
    const [rooms, setRooms] = useState<VoiceRoom[]>(FIXED_ROOMS);
    const [selectedRoomId, setSelectedRoomId] = useState<string>(FIXED_ROOMS[0].id);
    const [joinedRoomId, setJoinedRoomId] = useState<string | null>(null);
    const [chatByRoom, setChatByRoom] = useState<Record<string, ChatMessage[]>>(INITIAL_CHAT);
    const [chatInput, setChatInput] = useState("");

    const selectedRoom = useMemo(
        () => rooms.find((room) => room.id === selectedRoomId) ?? rooms[0],
        [rooms, selectedRoomId],
    );

    const roomChats = chatByRoom[selectedRoom.id] ?? [];
    const isJoinedSelectedRoom = joinedRoomId === selectedRoom.id;

    const handleJoinRoom = (nextRoomId: string) => {
        setRooms((prev) =>
            prev.map((room) => {
                if (room.id === joinedRoomId && joinedRoomId !== nextRoomId) {
                    return { ...room, participants: room.participants.filter((name) => name !== MY_NAME) };
                }
                if (room.id === nextRoomId && !room.participants.includes(MY_NAME)) {
                    return { ...room, participants: [...room.participants, MY_NAME] };
                }
                return room;
            }),
        );
        setJoinedRoomId(nextRoomId);
    };

    const handleLeaveRoom = () => {
        if (!joinedRoomId) return;

        setRooms((prev) =>
            prev.map((room) =>
                room.id === joinedRoomId
                    ? { ...room, participants: room.participants.filter((name) => name !== MY_NAME) }
                    : room,
            ),
        );
        setJoinedRoomId(null);
    };

    const handleSendChat = () => {
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
            <VoiceHeader/>

            <div className="grid gap-6 lg:grid-cols-12 min-h-[calc(100vh-18rem)]">
                <aside className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:col-span-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Voice Channels</p>

                    <div className="space-y-2 max-h-[calc(100vh-22rem)] overflow-y-auto pr-1">
                        {rooms.map((room) => {
                            const isSelected = room.id === selectedRoom.id;
                            const isJoined = room.id === joinedRoomId;

                            return (
                                <button
                                    key={room.id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedRoomId(room.id);
                                        handleJoinRoom(room.id);
                                    }}
                                    className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                                        isSelected
                                            ? "border-blue-500"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold text-gray-900">🔊 {room.name}</p>
                                        <span className={`h-2.5 w-2.5 rounded-full ${isJoined ? "bg-green-500" : "bg-gray-300"}`} />
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
                                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                            >
                                방 나가기
                            </button>
                        ) : (
                            <span className="text-xs text-gray-500">채널을 누르면 입장됩니다</span>
                        )}
                    </div>

                    <div className="mt-4 flex-1 min-h-[24rem] max-h-[calc(100vh-22rem)] overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3">
                        {roomChats.length === 0 ? (
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
                        />
                        <button
                            type="button"
                            onClick={handleSendChat}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            전송
                        </button>
                    </div>
                </main>
            </div>
        </section>
    );
}
