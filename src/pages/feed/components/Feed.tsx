import React, { useState } from "react";
import type FeedType from "../types/FeedType";
import { deleteFeed } from "../api/feed.ts";
import FeedAttachments from "./FeedAttachments";
import FeedCardHeader from "./FeedCardHeader";
import FeedReactions from "./FeedReactions";

interface Props {
    feed: FeedType;
    setFeeds: React.Dispatch<React.SetStateAction<FeedType[]>>;
    client: any;
}

const PRIORITY_KEY = "1f44d";

function movePriorityFirst(reactions: any[]) {
    const a = reactions.filter(r => r.reactionKey === PRIORITY_KEY);
    const b = reactions.filter(r => r.reactionKey !== PRIORITY_KEY);
    return [...a, ...b];
}


function applyOptimisticReaction(
    f: FeedType,
    feedId: number,
    reactionKey: string,
    emojiType: "DEFAULT" | "CUSTOM",
    emoji?: string,
    objectKey?: string
): FeedType {
    if (f.id !== feedId) return f;

    const reactions = f.reactions ?? [];
    const idx = reactions.findIndex((r) => r.reactionKey === reactionKey);
    let nextReactions: typeof reactions;

    if (idx === -1) {
        nextReactions = [
            ...reactions,
            {
                reactionKey,
                emojiType,
                objectKey,
                emoji,
                count: 1,
                pressedByMe: true,
            },
        ];
    } else {
        const target = reactions[idx];
        const nextPressed = !target.pressedByMe;
        const nextCount = nextPressed ? target.count + 1 : Math.max(0, target.count - 1);

        // ✅ count 0이면 삭제
        if (nextCount === 0) {
            nextReactions = reactions.filter((r) => r.reactionKey !== reactionKey);
        } else {
            nextReactions = reactions.map((r) =>
                r.reactionKey === reactionKey ? { ...r, pressedByMe: nextPressed, count: nextCount } : r
            );
        }
    }

    // ✅ 무조건 LIKE를 앞으로
    nextReactions = movePriorityFirst(nextReactions);

    return { ...f, reactions: nextReactions };
}

export default function Feed({ feed, setFeeds, client }: Props) {
    const userId = Number(localStorage.getItem("userId"));
    const isMine = userId === feed.authorId;

    const [isDeleting, setIsDeleting] = useState(false);
    const [toast, setToast] = useState("");

    const handleReactionSubmit = ({
        reactionKey,
        emoji,
        objectKey,
        emojiType,
    }: {
        reactionKey: string,
        emoji?: string | undefined,
        objectKey?: string | undefined
        emojiType: "DEFAULT" | "CUSTOM",
    }) => {
        client.current.publish({
            destination: "/app/feed/reaction",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ feedId: feed.id, key: reactionKey, emoji, objectKey }),
        });

        setFeeds((prev) =>
            prev.map((f) =>
                applyOptimisticReaction(f, feed.id, reactionKey, emojiType, emoji, objectKey)));
    };

    const handleDeleteFeed = async () => {
        if (isDeleting) return;
        const confirmed = window.confirm("삭제하시겠습니까?");
        if (!confirmed) return;
        setIsDeleting(true);
        const res = await deleteFeed(userId, feed.id);
        if (!res.ok) {
            setIsDeleting(false);
            alert(res.message);
            return;
        }
        client.current?.publish({
            destination: "/topic/room.1/delete",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ feedId: feed.id }),
        });
        setFeeds((prev) => prev.filter((f) => f.id !== feed.id));
        setIsDeleting(false);
        setToast("ok");
        window.setTimeout(() => setToast(""), 2000);
    };

    return (
        <div
            key={feed.id}
            className={`group rounded-lg border p-4 bg-gray-100 ${isMine ? "border-gray-600" : "border-gray-200"}`}
        >
            {toast && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg shadow-lg z-50 opacity-90">
                    {toast}
                </div>
            )}
            <FeedCardHeader
                authorName={feed.authorName}
                timestamp={feed.timestamp}
                isMine={isMine}
                isDeleting={isDeleting}
                onDelete={handleDeleteFeed}
            />

            <div className="mb-3 whitespace-pre-line text-[12px] leading-relaxed text-gray-800">
                {feed.content}
            </div>

            <FeedAttachments attachments={feed.attachments} />

            <FeedReactions
                feedId={feed.id}
                reactions={feed.reactions ?? []}
                onReact={handleReactionSubmit}
            />
        </div>
    );
}
