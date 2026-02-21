type ChannelType = "feed" | "voice";

type Props = {
    activeChannel: ChannelType;
    onSelectFeedChannel: () => void;
    isVoiceChannelExpanded: boolean;
    onToggleVoiceChannel: () => void;
    voiceRooms: { id: string; name: string; participants: string[] }[];
    isVoiceRoomLoading: boolean;
    voiceRoomLoadError: string | null;
    selectedVoiceRoomId: string | null;
    onSelectVoiceRoom: (roomId: string) => void;
    mySpeakerLevel: number;
    remoteLevelByName: Record<string, number>;
};

const AVATAR_THEMES = [
    "bg-red-100 text-red-700",
    "bg-amber-100 text-amber-700",
    "bg-green-100 text-green-700",
    "bg-blue-100 text-blue-700",
    "bg-pink-100 text-pink-700",
];

function getInitial(name: string): string {
    const normalized = name.replace("(나)", "").trim();
    return normalized.charAt(0).toUpperCase() || "?";
}

function getAvatarTheme(name: string): string {
    const seed = Array.from(name).reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    return AVATAR_THEMES[seed % AVATAR_THEMES.length];
}

export default function FeedChannelDock({
    activeChannel,
    onSelectFeedChannel,
    isVoiceChannelExpanded,
    onToggleVoiceChannel,
    voiceRooms,
    isVoiceRoomLoading,
    voiceRoomLoadError,
    selectedVoiceRoomId,
    onSelectVoiceRoom,
    mySpeakerLevel,
    remoteLevelByName,
}: Props) {
    return (
        <aside className="xl:col-span-2">
            <div className="sticky top-6 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
                <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Channels</p>
                <div className="space-y-1">
                    <button
                        type="button"
                        onClick={onSelectFeedChannel}
                        className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                            activeChannel === "feed" ? "bg-blue-50 font-semibold text-blue-700" : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                        <span className="mr-2">📰</span>
                        피드 채널
                    </button>

                    <div>
                        <button
                            type="button"
                            onClick={onToggleVoiceChannel}
                            className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition ${
                                activeChannel === "voice" ? "bg-blue-50 font-semibold text-blue-700" : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            <span>
                                <span className="mr-2">🔊</span>
                                보이스 채널
                            </span>
                            <span className="text-xs">{isVoiceChannelExpanded ? "▾" : "▸"}</span>
                        </button>

                        {isVoiceChannelExpanded && (
                            <div className="mt-1 space-y-1 pl-2">
                                {isVoiceRoomLoading && <p className="px-2 py-1 text-xs text-gray-500">방 목록 로딩 중...</p>}
                                {voiceRoomLoadError && <p className="px-2 py-1 text-xs text-red-500">{voiceRoomLoadError}</p>}
                                {!isVoiceRoomLoading && !voiceRoomLoadError && voiceRooms.length === 0 && (
                                    <p className="px-2 py-1 text-xs text-gray-500">음성 채팅방 없음</p>
                                )}

                                {voiceRooms.map((room) => {
                                    const isRoomActive = selectedVoiceRoomId === room.id;
                                    return (
                                        <div key={room.id} className="rounded-md border border-gray-200 bg-white">
                                            <button
                                                type="button"
                                                onClick={() => onSelectVoiceRoom(room.id)}
                                                className={`w-full rounded-t-md px-2 py-1.5 text-left text-xs transition ${
                                                    isRoomActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                                                }`}
                                            >
                                                <p className="truncate font-medium"># {room.name}</p>
                                                <p className="mt-0.5 text-[10px] text-gray-500">참여자 {room.participants.length}명</p>
                                            </button>

                                            <div className="space-y-0.5 border-t border-gray-100 px-2 py-1.5">
                                                {room.participants.length === 0 ? (
                                                    <p className="text-[10px] text-gray-400">참여자 없음</p>
                                                ) : (
                                                    room.participants.map((name) => (
                                                        <div key={`${room.id}-${name}`} className="flex items-center justify-between gap-2 pl-1">
                                                            <span className="min-w-0 flex items-center gap-1.5">
                                                                <span className="text-[10px] text-gray-400">└</span>
                                                                <span
                                                                    className={`inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-semibold ${getAvatarTheme(
                                                                        name,
                                                                    )}`}
                                                                >
                                                                    {getInitial(name)}
                                                                </span>
                                                                <span className="truncate text-[10px] text-gray-600">{name}</span>
                                                            </span>
                                                            {(() => {
                                                                const level =
                                                                    name.includes("(나)")
                                                                        ? mySpeakerLevel
                                                                        : (remoteLevelByName[name] ?? 0);
                                                                const percent = Math.max(0, Math.min(100, Math.round(level * 100)));
                                                                return (
                                                                    <span className="inline-flex flex-none items-center justify-end gap-1">
                                                                        <span className="h-1 w-12 overflow-hidden rounded bg-gray-200">
                                                                            <span
                                                                                className="block h-full rounded bg-emerald-500"
                                                                                style={{ width: `${percent}%` }}
                                                                            />
                                                                        </span>
                                                                        <span className="text-right text-[9px] text-gray-400">{percent}%</span>
                                                                    </span>
                                                                );
                                                            })()}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
}
