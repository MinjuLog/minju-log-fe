import type { ChatMessage } from "./types.ts";

type VoiceChatPanelProps = {
    selectedRoomId: string | null;
    joinedRoomId: string | null;
    isJoinedSelectedRoom: boolean;
    isConnecting: boolean;
    connectionError: string | null;
    isChatLoading: boolean;
    chatLoadError: string | null;
    isMicEnabled: boolean;
    isSpeakerEnabled: boolean;
    micStatusMessage: string | null;
    roomChats: ChatMessage[];
    chatInput: string;
    onLeaveRoom: () => void;
    onToggleMicrophone: () => void;
    onToggleSpeaker: () => void;
    onChatInputChange: (value: string) => void;
    onSendChat: () => void;
};

function formatChatTime(createdAt: string): string {
    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return "";
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export default function VoiceChatPanel({
    selectedRoomId,
    joinedRoomId,
    isJoinedSelectedRoom,
    isConnecting,
    connectionError,
    isChatLoading,
    chatLoadError,
    isMicEnabled,
    isSpeakerEnabled,
    micStatusMessage,
    roomChats,
    chatInput,
    onLeaveRoom,
    onToggleMicrophone,
    onToggleSpeaker,
    onChatInputChange,
    onSendChat,
}: VoiceChatPanelProps) {
    return (
        <main className="lg:col-span-8 flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-gray-200 pb-3">
                <h2 className="text-sm font-semibold text-gray-900">방 채팅</h2>
                {isJoinedSelectedRoom ? (
                    <button
                        type="button"
                        onClick={onLeaveRoom}
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
            {chatLoadError && <p className="mt-2 text-xs text-red-500">{chatLoadError}</p>}

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
                    onClick={onToggleMicrophone}
                    disabled={!joinedRoomId || isConnecting}
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isMicEnabled ? "마이크 끄기" : "마이크 켜기"}
                </button>
                <button
                    type="button"
                    onClick={onToggleSpeaker}
                    disabled={!joinedRoomId || isConnecting}
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSpeakerEnabled ? "스피커 끄기" : "스피커 켜기"}
                </button>
            </div>

            {micStatusMessage && <p className="mt-2 text-xs text-amber-700">{micStatusMessage}</p>}

            <div className="mt-4 flex-1 min-h-[24rem] max-h-[calc(100vh-22rem)] overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3">
                {!selectedRoomId ? (
                    <p className="text-sm text-gray-500">선택된 채팅방이 없습니다.</p>
                ) : isChatLoading ? (
                    <p className="text-sm text-gray-500">메시지를 불러오는 중...</p>
                ) : roomChats.length === 0 ? (
                    <p className="text-sm text-gray-500">아직 채팅이 없습니다.</p>
                ) : (
                    <div className="space-y-3">
                        {roomChats.map((message) => (
                            <div key={message.id} className="rounded-md bg-white p-2.5">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="font-semibold text-gray-700">{message.senderName}</span>
                                    <span>{formatChatTime(message.createdAt)}</span>
                                </div>
                                <p className="mt-1 text-sm text-gray-800">{message.content}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-3 flex gap-2">
                <input
                    value={chatInput}
                    onChange={(e) => onChatInputChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") onSendChat();
                    }}
                    placeholder="메시지를 입력하세요"
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!selectedRoomId}
                />
                <button
                    type="button"
                    onClick={onSendChat}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!selectedRoomId}
                >
                    전송
                </button>
            </div>
        </main>
    );
}
