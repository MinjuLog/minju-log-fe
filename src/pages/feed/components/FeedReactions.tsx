import { useRef, useState } from "react";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import type FeedType from "../types/FeedType";
import { getReactionPressedUsers } from "../api/feed";
import { ReactionImagePicker } from "./ReactionImagePicker";

const STATIC_HOST = import.meta.env.VITE_STATIC_HOST;
const PRIORITY_KEY = "1f44d";

type ReactionPayload = {
    emojiKey: string;
    emojiType: "DEFAULT" | "CUSTOM";
    unicode?: string;
    objectKey?: string;
};

type TooltipState = {
    open: boolean;
    x: number;
    y: number;
    title: string; // 예: 👍 3
    content: string; // usernames
    loading: boolean;
    reactionType: "DEFAULT" | "CUSTOM";
    objectKey?: string;
};

type Props = {
    feedId: number;
    reactions: FeedType["reactions"];
    onReact: (payload: ReactionPayload) => void;
};

function movePriorityFirst(reactions: FeedType["reactions"]) {
    const a = reactions.filter((r) => r.emojiKey === PRIORITY_KEY);
    const b = reactions.filter((r) => r.emojiKey !== PRIORITY_KEY);
    return [...a, ...b];
}

export default function FeedReactions({ feedId, reactions, onReact }: Props) {
    const userId = Number(localStorage.getItem("userId"));
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

    const [tooltip, setTooltip] = useState<TooltipState>({
        open: false,
        x: 0,
        y: 0,
        title: "",
        content: "",
        loading: false,
        reactionType: "DEFAULT",
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
        emojiKey: string,
        emojiCount: number,
        emojiLabel: string,
        reactionType: "DEFAULT" | "CUSTOM",
        objectKey?: string
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
            title: `${emojiLabel} ${emojiCount}`,
            content: "",
            loading: true,
            reactionType,
            objectKey,
        });

        hoverTimerRef.current = window.setTimeout(async () => {
            try {
                // 이전 요청 취소
                abortRef.current?.abort();
                abortRef.current = new AbortController();

                const res = await getReactionPressedUsers(
                    userId,
                    feedId,
                    emojiKey
                );

                if (!res.ok) {
                    throw new Error("Failed to fetch reaction pressed");
                }

                const usernames: string[] = res.result.usernames;

                setTooltip((t) => ({
                    ...t,
                    loading: false,
                    content: usernames.length ? usernames.join(", ") : "아직 아무도 없어요",
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

    const handleEmojiSelect = (emojiData: EmojiClickData) => {
        onReact({ emojiKey: emojiData.unified, unicode: emojiData.emoji, emojiType: "DEFAULT" });
        setEmojiPickerOpen(false);
    };

    const orderedReactions = movePriorityFirst(reactions ?? []);
    const hasPriority = reactions.some((r) => r.emojiKey === PRIORITY_KEY);

    return (
        <div className="flex items-center gap-2 flex-wrap relative">
            {!hasPriority && (
                <button
                    onClick={() => onReact({ emojiKey: PRIORITY_KEY, unicode: "👍", emojiType: "DEFAULT" })}
                    onMouseEnter={(e) => openTooltipWithFetch(e, PRIORITY_KEY, 0, "👍", "DEFAULT")}
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

            {orderedReactions.map((reaction) => (
                <button
                    key={reaction.emojiKey}
                    onClick={() =>
                        onReact({
                            emojiKey: reaction.emojiKey,
                            unicode: reaction.unicode ?? undefined,
                            objectKey: reaction.objectKey ?? undefined,
                            emojiType: reaction.emojiType ?? "DEFAULT",
                        })
                    }
                    onMouseEnter={(e) =>
                        openTooltipWithFetch(
                            e,
                            reaction.emojiKey,
                            reaction.emojiCount,
                            reaction.unicode ?? "커스텀",
                            reaction.emojiType ?? "DEFAULT",
                            reaction.objectKey ?? undefined
                        )
                    }
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
                        ${reaction.pressedByMe ? "border-blue-400 bg-blue-50 text-blue-600" : "border-gray-200 text-gray-600"}
                    `}
                    title={reaction.emojiKey}
                >
                    {reaction.unicode && <span className="leading-none">{reaction.unicode}</span>}
                    {!reaction.unicode && reaction.objectKey && (
                        <img src={STATIC_HOST + reaction.objectKey} alt={reaction.emojiKey} className="w-4 h-4" />
                    )}
                    <span className="ml-0.5 font-medium">{reaction.emojiCount}</span>
                </button>
            ))}

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
                            skinTonesDisabled={false}
                            searchDisabled={false}
                            width={320}
                        />
                    </div>
                )}
            </div>

            <ReactionImagePicker
                handleReactionSubmit={({ emojiKey, objectKey, emojiType }) =>
                    onReact({ emojiKey, objectKey, emojiType })
                }
            />

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
                    {tooltip.reactionType === "DEFAULT" ? (
                        <div className="font-semibold mb-1">{tooltip.title}</div>
                    ) : (
                        <img src={STATIC_HOST + tooltip.objectKey} alt={tooltip.title} className="w-4 h-4" />
                    )}
                    <div className="opacity-90">
                        {tooltip.loading ? "불러오는 중..." : tooltip.content || "아직 아무도 없어요"}
                    </div>
                </div>
            )}
        </div>
    );
}
