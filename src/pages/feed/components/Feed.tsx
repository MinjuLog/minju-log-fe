import type FeedType from "../types/FeedType.ts";
import {ThumbsUp} from "lucide-react";
import {formatKoreanDate} from "../../../utils/formatKoreanDate.ts";

interface props {
    feed: FeedType;
    setFeeds: (feeds: (prev: FeedType[]) => any) => void;
    client: any;
}

export default function Feed({ feed, setFeeds, client }: props) {
    const userId = Number(localStorage.getItem("userId"));
    const isMine = userId === feed.authorId;

    const handleLikeSubmit = () => {
        client.current.publish({
            destination: '/app/feed/like',
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                feedId: feed.id,
            }),
        });
        setFeeds(prev =>
            prev.map(f =>
                f.id === feed.id
                    ? { ...f, likes: f.likes + 1 }
                    : f
            )
        );
    };

    return (
        <div
            key={feed.id}
            className={`rounded-lg border p-4 mr-12 bg-gray-100 ${
                isMine ? "border-gray-600" : "border-gray-200"
            }`}
        >
            {/* Feed Header */}
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

            {/* Content */}
            <div className="mb-4 whitespace-pre-line text-[12px] leading-relaxed text-gray-800">
                {feed.content}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                <button
                    onClick={handleLikeSubmit}
                    className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
                >
                    <ThumbsUp className="h-4 w-4" />
                    <span className="text-sm">{feed.likes}</span>
                </button>
            </div>
        </div>
    );
}