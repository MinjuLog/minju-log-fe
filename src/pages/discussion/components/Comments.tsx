"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowDownUp } from "lucide-react"
import { useParams } from "react-router-dom"

import type CommentType from "../types/CommentType"
import Comment from "./Comment"
import { getSignatureList } from "../../../api/signature/signature"
import commentsConverter from "../converter/commentsConverter"

const PAGE_SIZE = 5
type SortBy = "likes" | "latest"

function CommentsSkeleton() {
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

            {/* Comments List Skeleton */}
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

export default function CommentsPage() {
    const { discussionSequence } = useParams<{ discussionSequence: string }>()

    const [loading, setLoading] = useState(true)
    const [comments, setComments] = useState<CommentType[]>([])
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
    const [sortBy, setSortBy] = useState<SortBy>("likes")

    useEffect(() => {
        if (!discussionSequence) return

        const load = async () => {
            try {
                setLoading(true)

                const res = await getSignatureList(
                    Number(discussionSequence),
                    0,
                    PAGE_SIZE
                )

                if (!res.ok) {
                    alert(res.message)
                    return
                }

                const converted = commentsConverter(res)
                setComments(converted)
                setVisibleCount(PAGE_SIZE)
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [discussionSequence, sortBy])

    const filteredComments = comments

    const parseTs = (ts: string) => new Date(ts).getTime()

    const sortedComments = useMemo(() => {
        const arr = [...filteredComments]
        if (sortBy === "likes") {
            arr.sort((a, b) => b.likes - a.likes)
        } else {
            arr.sort((a, b) => parseTs(b.timestamp) - parseTs(a.timestamp))
        }
        return arr
    }, [filteredComments, sortBy])

    const canLoadMore = visibleCount < sortedComments.length

    const handleLoadMore = () => {
        setVisibleCount(prev =>
            Math.min(prev + PAGE_SIZE, sortedComments.length)
        )
    }

    const handleToggleSort = () => {
        setSortBy(prev => (prev === "likes" ? "latest" : "likes"))
        setVisibleCount(PAGE_SIZE)
    }

    if (loading) {
        return <CommentsSkeleton />
    }

    return (
        <div className="flex-1 mt-20">
            {/* Header */}
            <div className="mb-6">
                <h1 className="mb-4 text-2xl font-bold text-gray-900">
                    찬반 서명 {sortedComments.length}
                </h1>

                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={handleToggleSort}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                        aria-label="정렬 토글"
                        title="공감순 / 최신순 전환"
                    >
                        {sortBy === "likes" ? "공감순" : "최신순"}
                        <ArrowDownUp className="h-4 w-4" />
                    </button>

                    {/*<button className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">*/}
                    {/*    내가 쓴 찬반 서명*/}
                    {/*</button>*/}
                </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
                {sortedComments
                    .slice(0, visibleCount)
                    .map(comment => (
                        <Comment key={comment.id} comment={comment} />
                    ))}

                {sortedComments.length === 0 && !loading && (
                    <div className="text-center text-gray-500 text-sm py-8 border border-dashed border-gray-200 rounded-lg">
                        아직 등록된 찬반 서명이 없습니다.
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
                                ({visibleCount}/{sortedComments.length})
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}