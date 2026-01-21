import type FeedType from "../types/FeedType";
import { formatKoreanDate } from "../../../utils/formatKoreanDate";

interface Props {
    feed: FeedType;
    setFeeds: React.Dispatch<React.SetStateAction<FeedType[]>>;
    client: any;
}

const STATIC_HOST = import.meta.env.VITE_STATIC_HOST;

function applyOptimisticReaction(
    f: FeedType,
    feedId: number,
    reactionKey: string,
    renderType: "UNICODE" | "IMAGE"
): FeedType {
    if (f.id !== feedId) return f;

    const reactions = f.reactions ?? [];
    const idx = reactions.findIndex((r) => r.key === reactionKey);

    // 아직 reaction이 없는 경우: 새로 추가 (첫 누름)
    if (idx === -1) {
        return {
            ...f,
            reactions: [
                ...reactions,
                {
                    key: reactionKey,
                    renderType,
                    imageUrl: null,
                    unicode: reactionKey === "like" ? "👍" : null,
                    count: 1,
                    isPressed: true,
                },
            ],
        };
    }

    // 기존 reaction 토글
    const target = reactions[idx];
    const nextPressed = !target.isPressed;
    const nextCount = nextPressed ? target.count + 1 : Math.max(0, target.count - 1);

    const nextReactions = reactions.map((r) =>
        r.key === reactionKey ? { ...r, isPressed: nextPressed, count: nextCount } : r
    );

    return { ...f, reactions: nextReactions };
}


export default function Feed({ feed, setFeeds, client }: Props) {
    const userId = Number(localStorage.getItem("userId"));
    const isMine = userId === feed.authorId;

    const handleReactionSubmit = (renderType: "UNICODE" | "IMAGE", reactionKey: string) => {
        // 1. 서버로 전송
        client.current.publish({
            destination: "/app/feed/reaction",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ feedId: feed.id, key: reactionKey }),
        });

        // 2. 낙관적 업데이트
        setFeeds((prev) =>
            prev.map((f) => applyOptimisticReaction(f, feed.id, reactionKey, renderType))
        );
    };

    return (
        <div
            key={feed.id}
            className={`rounded-lg border p-4 bg-gray-100 ${
                isMine ? "border-gray-600" : "border-gray-200"
            }`}
        >
            <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div>
                        <div className="font-medium text-gray-900 flex items-center gap-2">
                            {feed.authorName}
                            {isMine && (
                                <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                  내 피드
                </span>
                            )}
                        </div>
                        <div className="text-xs text-gray-500">
                            {formatKoreanDate(feed.timestamp)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-3 whitespace-pre-line text-[12px] leading-relaxed text-gray-800">
                {feed.content}
            </div>

            {feed.attachments.length > 0 && (
                <div className="mb-4 grid grid-cols-2 gap-2">
                    {feed.attachments.map((att) => {
                        const url = STATIC_HOST + att.objectKey;
                        const isImage = att.contentType?.startsWith("image/");
                        const isVideo = att.contentType?.startsWith("video/");

                        return (
                            <a
                                key={att.objectKey}
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="block"
                            >
                                {isImage && (
                                    <img
                                        src={url}
                                        alt={att.originalName ?? "attachment"}
                                        className="w-full h-40 object-cover rounded-md border"
                                        loading="lazy"
                                    />
                                )}

                                {isVideo && (
                                    <video
                                        src={url}
                                        controls
                                        className="w-full h-40 rounded-md border object-cover"
                                    />
                                )}

                                {!isImage && !isVideo && (
                                    <div className="flex items-center h-10 rounded-md border bg-gray-50 hover:bg-gray-100">
                    <span className="text-sm text-gray-600 truncate px-2">
                      📎 {att.originalName ?? "파일 다운로드"}
                    </span>
                                    </div>
                                )}
                            </a>
                        );
                    })}
                </div>
            )}

            <div className="flex items-center gap-2 flex-wrap">
                {feed.reactions.map((reaction) => (
                    <button
                        key={reaction.key}
                        onClick={() => handleReactionSubmit("UNICODE", reaction.key)}
                        className={`
                                    flex items-center gap-1
                                    px-2 py-1
                                    rounded-full
                                    border
                                    text-xs
                                    bg-white
                                    transition
                                    hover:bg-gray-50
                                    ${
                                                        reaction.isPressed
                                                            ? "border-blue-400 bg-blue-50 text-blue-600"
                                                            : "border-gray-200 text-gray-600"
                                                    }
                                  `}
                    >
                        {/* 유니코드 이모지 */}
                        {reaction.unicode && <span className="leading-none">{reaction.unicode}</span>}

                        {/* 이미지 이모지 */}
                        {!reaction.unicode && reaction.imageUrl && (
                            <img
                                src={STATIC_HOST + reaction.imageUrl}
                                alt={reaction.key}
                                className="w-4 h-4"
                            />
                        )}

                        <span className="ml-0.5 font-medium">{reaction.count}</span>
                    </button>
                ))}

                {/* like가 아직 없는 경우 */}
                {!feed.reactions.some((r) => r.key === "like") && (
                    <button
                        onClick={() => handleReactionSubmit("UNICODE", "like")}
                        className="
                                    flex items-center gap-1
                                    px-2 py-1
                                    rounded-full
                                    border border-gray-200
                                    bg-white
                                    text-xs text-gray-500
                                    hover:bg-gray-50
                                    transition
                                  "
                    >
                        <span>👍</span>
                        <span className="ml-0.5 font-medium">0</span>
                    </button>
                )}
            </div>


        </div>
    );
}
