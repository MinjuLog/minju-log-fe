import type { VoiceRoom } from "./types.ts";

type VoiceRoomsPanelProps = {
    rooms: VoiceRoom[];
    selectedRoomId: string | null;
    joinedRoomId: string | null;
    isConnecting: boolean;
    isRoomLoading: boolean;
    roomLoadError: string | null;
    onSelectRoom: (roomId: string) => void;
    onJoinRoom: (roomId: string) => void;
};

export default function VoiceRoomsPanel({
    rooms,
    selectedRoomId,
    joinedRoomId,
    isConnecting,
    isRoomLoading,
    roomLoadError,
    onSelectRoom,
    onJoinRoom,
}: VoiceRoomsPanelProps) {
    return (
        <aside className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:col-span-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Voice Channels</p>

            {isRoomLoading && <p className="text-sm text-gray-500">방 목록 불러오는 중...</p>}
            {roomLoadError && <p className="text-sm text-red-500">{roomLoadError}</p>}

            {!isRoomLoading && !roomLoadError && rooms.length === 0 && (
                <p className="text-sm text-gray-500">생성된 음성 채팅방이 없습니다.</p>
            )}

            <div className="space-y-2 max-h-[calc(100vh-22rem)] overflow-y-auto pr-1">
                {rooms.map((room) => {
                    const isSelected = room.id === selectedRoomId;
                    const isJoined = room.id === joinedRoomId;

                    return (
                        <div
                            key={room.id}
                            className={`group relative w-full rounded-xl border px-4 py-3 text-left transition ${
                                isSelected ? "border-blue-500 bg-blue-50/40" : "border-gray-200 hover:border-gray-300"
                            }`}
                        >
                            <button type="button" onClick={() => onSelectRoom(room.id)} className="w-full text-left">
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

                            <button
                                type="button"
                                onClick={() => onJoinRoom(room.id)}
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
    );
}
