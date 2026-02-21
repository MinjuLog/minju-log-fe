import type React from "react";
import Feed from "./Feed";
import { FeedInput } from "./FeedInput";
import type FeedType from "../types/FeedType";

type Props = {
    feeds: FeedType[];
    setFeeds: React.Dispatch<React.SetStateAction<FeedType[]>>;
    connected: boolean;
    onFeedCreated: () => Promise<void> | void;
    visibleCount: number;
    totalElements: number;
    onLoadMore: () => void;
};

export default function FeedList({
    feeds,
    setFeeds,
    connected,
    onFeedCreated,
    visibleCount,
    totalElements,
    onLoadMore,
}: Props) {
    const canLoadMore = visibleCount < totalElements;

    return (
        <div className="xl:col-span-7 space-y-4">
            <FeedInput connected={connected} onCreated={onFeedCreated} />

            {feeds.slice(0, visibleCount).map((message) => (
                <Feed
                    key={message.id}
                    feed={message}
                    setFeeds={setFeeds}
                />
            ))}

            {totalElements === 0 && (
                <div className="text-center text-gray-500 text-sm py-8 border border-dashed border-gray-200 rounded-lg">
                    아직 등록된 피드가 없습니다.
                </div>
            )}

            {canLoadMore && (
                <div className="flex justify-center mt-6">
                    <button
                        type="button"
                        onClick={onLoadMore}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                    >
                        더 불러오기 <span className="text-gray-400">({visibleCount}/{totalElements})</span>
                    </button>
                </div>
            )}
        </div>
    );
}
