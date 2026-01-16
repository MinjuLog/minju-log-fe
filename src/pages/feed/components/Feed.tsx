import type FeedType from "../types/FeedType";
import { ThumbsUp } from "lucide-react";
import { formatKoreanDate } from "../../../utils/formatKoreanDate";

interface props {
    feed: FeedType;
    setFeeds: (feeds: (prev: FeedType[]) => FeedType[]) => void;
    client: any;
}

const BASE_URL = "http://localhost:9000/minjulog/"

export default function Feed({ feed, setFeeds, client }: props) {
    const userId = Number(localStorage.getItem("userId"));
    const isMine = userId === feed.authorId;

    const handleLikeSubmit = () => {
        client.current.publish({
            destination: "/app/feed/like",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ feedId: feed.id }),
        });
        setFeeds((prev: FeedType[]) =>
            prev.map((f) => (f.id === feed.id ? { ...f, likes: f.likes + 1 } : f))
        );
    };

    return (
        <div
            key={feed.id}
            className={`rounded-lg border p-4 mr-12 bg-gray-100 ${
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
                        <div className="text-xs text-gray-500">{formatKoreanDate(feed.timestamp)}</div>
                    </div>
                </div>
            </div>

            <div className="mb-3 whitespace-pre-line text-[12px] leading-relaxed text-gray-800">
                {feed.content}
            </div>

            {/* Attachments: images only */}
            {feed.attachments.length > 0 && (
                <div className="mb-4 grid grid-cols-2 gap-2">
                    {feed.attachments.map((att) => (
                        <a key={att.objectKey} href={BASE_URL + att.objectKey} target="_blank" rel="noreferrer">
                            <img
                                src={BASE_URL + att.objectKey}
                                alt={att.originalName ?? "attachment"}
                                className="w-full h-40 object-cover rounded-md border"
                                loading="lazy"
                            />
                        </a>
                    ))}
                </div>
            )}

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