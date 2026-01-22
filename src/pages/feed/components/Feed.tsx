import { useRef, useState } from "react";
import type FeedType from "../types/FeedType";
import { formatKoreanDate } from "../../../utils/formatKoreanDate";
import {getReactionPressedUsers} from "../api/feed.ts";
import EmojiPicker, {type EmojiClickData} from "emoji-picker-react";

interface Props {
    feed: FeedType;
    setFeeds: React.Dispatch<React.SetStateAction<FeedType[]>>;
    client: any;
}

const STATIC_HOST = import.meta.env.VITE_STATIC_HOST;

const PRIORITY_KEY = "1f44d";

function movePriorityFirst(reactions: any[]) {
    const a = reactions.filter(r => r.key === PRIORITY_KEY);
    const b = reactions.filter(r => r.key !== PRIORITY_KEY);
    return [...a, ...b];
}


function applyOptimisticReaction(
    f: FeedType,
    feedId: number,
    reactionKey: string,
    emojiType: "DEFAULT" | "CUSTOM",
    emoji: string
): FeedType {
    if (f.id !== feedId) return f;

    const reactions = f.reactions ?? [];
    const idx = reactions.findIndex((r) => r.key === reactionKey);

    let nextReactions: typeof reactions;

    if (idx === -1) {
        nextReactions = [
            ...reactions,
            {
                key: reactionKey,
                emojiType,
                imageUrl: null,
                emoji,
                count: 1,
                isPressed: true,
            },
        ];
    } else {
        const target = reactions[idx];
        const nextPressed = !target.isPressed;
        const nextCount = nextPressed ? target.count + 1 : Math.max(0, target.count - 1);

        // ✅ count 0이면 삭제
        if (nextCount === 0) {
            nextReactions = reactions.filter((r) => r.key !== reactionKey);
        } else {
            nextReactions = reactions.map((r) =>
                r.key === reactionKey ? { ...r, isPressed: nextPressed, count: nextCount } : r
            );
        }
    }

    // ✅ 무조건 LIKE를 앞으로
    nextReactions = movePriorityFirst(nextReactions);

    return { ...f, reactions: nextReactions };
}

// ---- 여기부터 추가: hover tooltip fetch ----
type TooltipState = {
    open: boolean;
    x: number;
    y: number;
    title: string; // 예: 👍 3
    content: string; // usernames
    loading: boolean;
};

export default function Feed({ feed, setFeeds, client }: Props) {
    const userId = Number(localStorage.getItem("userId"));
    const isMine = userId === feed.authorId;

    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

    const handleReactionSubmit = (
        reactionKey: string,
        emoji: string
    ) => {
        client.current.publish({
            destination: "/app/feed/reaction",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ feedId: feed.id, key: reactionKey, emoji }),
        });

        setFeeds((prev) =>
            prev.map((f) => applyOptimisticReaction(f, feed.id, reactionKey, "DEFAULT", emoji)));
    };

    const handleEmojiSelect = (emojiData: EmojiClickData) => {
        handleReactionSubmit(emojiData.unified, emojiData.emoji);
        setEmojiPickerOpen(false);
    };


    // ---- tooltip state ----
    const [tooltip, setTooltip] = useState<TooltipState>({
        open: false,
        x: 0,
        y: 0,
        title: "",
        content: "",
        loading: false,
    });

    const hoverTimerRef = useRef<number | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    const closeTooltip = () => {
        if (hoverTimerRef.current) {
            window.clearTimeout(hoverTimerRef.current);
            hoverTimerRef.current = null;
        }
        abortRef.current?.abort();
        abortRef.current = null;

        setTooltip((t) => ({ ...t, open: false, loading: false }));
    };

    const openTooltipWithFetch = (
        e: React.MouseEvent<HTMLButtonElement>,
        reactionKey: string,
        count: number,
        emojiLabel: string
    ) => {
        if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current);
        }
        const TOOLTIP_OFFSET_Y = 50;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top - TOOLTIP_OFFSET_Y;

        setTooltip({
            open: true,
            x,
            y,
            title: `${emojiLabel} ${count}`,
            content: "",
            loading: true,
        });

        hoverTimerRef.current = window.setTimeout(async () => {
            try {
                // 이전 요청 취소
                abortRef.current?.abort();

                const ac = new AbortController();
                abortRef.current = ac;

                const res = await getReactionPressedUsers(
                    userId,
                    feed.id,
                    reactionKey,
                    // ac.signal
                );

                if (!res.ok) {
                    throw new Error("Failed to fetch reaction pressed");
                }

                const usernames: string[] = res.result.usernames;

                setTooltip((t) => ({
                    ...t,
                    loading: false,
                    content: usernames.length
                        ? usernames.join(", ")
                        : "아직 아무도 없어요",
                }));
            } catch (err: any) {
                if (err.name === "AbortError") return; // 정상적인 취소

                setTooltip((t) => ({
                    ...t,
                    loading: false,
                    content: "불러오지 못했어요",
                }));
            }
        }, 180);
    };

    return (
        <div
            key={feed.id}
            className={`rounded-lg border p-4 bg-gray-100 ${isMine ? "border-gray-600" : "border-gray-200"}`}
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
                        <div className="text-xs text-gray-500">{formatKoreanDate(feed.timestamp)}</div>
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

            <div className="flex items-center gap-2 flex-wrap relative">
                {!feed.reactions.some((r) => r.key === "1f44d") && (
                    <button
                        onClick={() => handleReactionSubmit(PRIORITY_KEY, "👍" )}
                        onMouseEnter={(e) => openTooltipWithFetch(e, PRIORITY_KEY, 0, "👍")}
                        onMouseLeave={closeTooltip}
                        className="
                                  flex items-center gap-1
                                  px-2 py-1
                                  rounded-full
                                  border border-gray-200
                                  bg-white
                                  text-xs text-gray-500
                                  hover:bg-gray-50
                                  transition
                                  cursor-pointer
                                "
                    >
                        <span>👍</span>
                        <span className="ml-0.5 font-medium">0</span>
                    </button>
                )}

                {feed.reactions.map((reaction) => {
                    const emojiLabel = reaction.emoji ? reaction.emoji : "reaction";

                    return (
                        <button
                            key={reaction.key}
                            onClick={() => handleReactionSubmit(reaction.key, emojiLabel)}
                            onMouseEnter={(e) => openTooltipWithFetch(e, reaction.key, reaction.count, emojiLabel)}
                            onMouseLeave={closeTooltip}
                            className={`
                                        flex items-center gap-1
                                        px-2 py-1
                                        rounded-full
                                        border
                                        text-xs
                                        bg-white
                                        transition
                                        hover:bg-gray-50
                                        cursor-pointer
                                        ${reaction.isPressed ? "border-blue-400 bg-blue-50 text-blue-600" : "border-gray-200 text-gray-600"}
                                      `}
                        >
                            {reaction.emoji && <span className="leading-none">{reaction.emoji}</span>}

                            {!reaction.emoji && reaction.imageUrl && (
                                <img src={STATIC_HOST + reaction.imageUrl} alt={reaction.key} className="w-4 h-4" />
                            )}

                            <span className="ml-0.5 font-medium">{reaction.count}</span>
                        </button>
                    );
                })}


                <div className="relative">
                    <button
                        onClick={() => setEmojiPickerOpen((v) => !v)}
                        className="
                                    flex items-center gap-1
                                    px-2 py-1
                                    rounded-full
                                    border border-dashed border-gray-300
                                    bg-white
                                    text-xs text-gray-500
                                    hover:bg-gray-50
                                    transition
                                    cursor-pointer
                                "
                    >
                        <span className="text-sm">➕</span>
                    </button>

                    {/* 이모지 피커 */}
                    {emojiPickerOpen && (
                        <div className="absolute z-50 bottom-full mb-2">
                            <EmojiPicker
                                onEmojiClick={handleEmojiSelect}
                                // theme="light"
                                skinTonesDisabled={false}
                                searchDisabled={false}
                                width={320}
                            />
                        </div>
                    )}
                </div>





                {/* ---- 검은 툴팁 ---- */}
                {tooltip.open && (
                    <div
                        className="
                                  fixed z-50
                                  -translate-x-1/2 -translate-y-2
                                  rounded-md
                                  bg-black text-white
                                  px-3 py-2
                                  text-xs
                                  shadow-lg
                                  max-w-xs
                                  pointer-events-none
                                  whitespace-pre-line
                                "
                        style={{ left: tooltip.x, top: tooltip.y }}
                    >
                        <div className="font-semibold mb-1">{tooltip.title}</div>
                        <div className="opacity-90">
                            {tooltip.loading ? "불러오는 중..." : (tooltip.content || "아직 아무도 없어요")}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
