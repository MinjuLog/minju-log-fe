"use client"

import {useEffect, useState} from "react"
import type FeedType from "../types/FeedType.ts"
import Feed from "./Feed.tsx"
import {FeedInput} from "./FeedInput.tsx";

const PAGE_SIZE = 30
function FeedsSkeleton() {
    return (
        <div className="flex-1 mt-20 animate-pulse">
            {/* Header */}
            <div className="mb-6">
                <div className="mb-4 h-6 w-48 bg-gray-200 rounded" />

                <div className="flex items-center justify-between">
                    <div className="h-5 w-24 bg-gray-200 rounded" />
                    <div className="h-8 w-32 bg-gray-200 rounded-full" />
                </div>
            </div>

            {/* feeds List Skeleton */}
            <div className="space-y-4">
                {[0, 1, 2, 3, 4].map(i => (
                    <div
                        key={i}
                        className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                    >
                        <div className="mb-3 flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-gray-200" />
                            <div className="flex-1">
                                <div className="h-4 w-32 bg-gray-200 rounded mb-1" />
                                <div className="h-3 w-20 bg-gray-200 rounded" />
                            </div>
                            <div className="h-3 w-10 bg-gray-200 rounded" />
                        </div>

                        <div className="space-y-2 mb-3">
                            <div className="h-3 w-full bg-gray-200 rounded" />
                            <div className="h-3 w-5/6 bg-gray-200 rounded" />
                            <div className="h-3 w-3/5 bg-gray-200 rounded" />
                        </div>

                        <div className="flex items-center justify-between mt-2">
                            <div className="h-4 w-20 bg-gray-200 rounded" />
                            <div className="h-8 w-16 bg-gray-200 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function Feeds() {

    const [loading, setLoading] = useState(true)
    const [feeds, setFeeds] = useState<FeedType[]>([])
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
    const [totalElements, setTotalElements] = useState<number>(0)
    const [page, setPage] = useState(0)

    useEffect(() => {
        // 필터나 discussion 바뀌면 page 0으로 돌림
        setPage(0);
        setFeeds([]); // 내부 초기화
    }, []);

    useEffect(() => {

        const load = async () => {
            try {
                setLoading(true)
                // const res = await getSignatureList(
                //     Number(discussionSequence),
                //     filterBy,
                //     page,
                //     PAGE_SIZE
                // )

                // if (!res.ok) {
                //     alert(res.message)
                //     return
                // }
                //
                // const converted = feedsConverter(res);
                // setTotalElements(res.result.totalElements);
                // setFeeds(prev =>  Array.from(
                //         new Map([...prev, ...converted].map(item => [item.id, item])).values()
                //     )
                // );
                setTotalElements(1)
                setFeeds([
                    {
                        id: "1",
                        authorId: "1",
                        authorName: "나",
                        timestamp: new Date().toISOString(),
                        content: "1",
                        likes: 1,
                        opinion: 1
                    },
                    {
                        id: crypto.randomUUID(),
                        authorId: "me",
                        authorName: "나",
                        timestamp: new Date().toISOString(),
                        content: "1",
                        likes: 1,
                        opinion: 1
                    }
                ])

            } finally {
                setLoading(false)
            }
        }

        load()
    }, [page])

    const handleCreateFeed = async (content: string) => {
        // 실제 API 호출 자리
        // await createFeed(content)

        const newFeed: FeedType = {
            id: crypto.randomUUID(),
            authorId: "me",
            authorName: "나",
            timestamp: new Date().toISOString(),
            content,
            likes: 0,
            opinion: 0,
        }

        setFeeds(prev => [newFeed, ...prev])
        setTotalElements(prev => prev + 1)
    }

    const canLoadMore = visibleCount < totalElements;

    const handleLoadMore = () => {
        setVisibleCount(prev =>
            Math.min(prev + PAGE_SIZE, totalElements)
        )
        setPage(page + 1)
    }

    if (loading) {
        return <FeedsSkeleton />
    }

    return (
        <div className="flex-1">

            {/* Header */}
            <div className="mb-6">
                <h1 className="mb-4 text-2xl font-bold text-gray-900">
                    피드 {totalElements}
                </h1>
            </div>

            {/* feeds List */}
            <div className="space-y-4">
                <FeedInput onSubmit={handleCreateFeed} />
                {feeds
                    .slice(0, visibleCount)
                    .map(feed => (
                        <Feed key={feed.id} feed={feed} />
                    ))}

                {totalElements === 0 && !loading && (
                    <div className="text-center text-gray-500 text-sm py-8 border border-dashed border-gray-200 rounded-lg">
                        아직 등록된 피드가 없습니다.
                    </div>
                )}

                {canLoadMore && (
                    <div className="flex justify-center mt-6">
                        <button
                            type="button"
                            onClick={handleLoadMore}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition"
                        >
                            더 불러오기{" "}
                            <span className="text-gray-400">
                            ({visibleCount}/{totalElements})
                        </span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}