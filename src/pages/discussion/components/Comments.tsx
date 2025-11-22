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

export default function CommentsPage() {
    const { discussionSequence } = useParams<{ discussionSequence: string }>()

    const [loading, setLoading] = useState(true)
    const [comments, setComments] = useState<CommentType[]>([])
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
    const [sortBy, setSortBy] = useState<SortBy>("likes") // 기본: 공감순

    useEffect(() => {
        if (!discussionSequence) return

        const load = async () => {
            try {
                setLoading(true)

                // 서버 페이지네이션은 넉넉하게 한 번에 가져오고,
                // 화면에서는 PAGE_SIZE 기준으로 잘라서 보여줌
                const page = 0
                const size = 100

                const res = await getSignatureList(
                    Number(discussionSequence),
                    page,
                    size
                )

                if (!res.ok) {
                    alert(res.message)
                    return
                }

                const converted = commentsConverter(res)
                setComments(converted)
                setVisibleCount(PAGE_SIZE) // 새로운 데이터 기준으로 초기화
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [discussionSequence])

    const filteredComments = comments

    // 이제 ISO 타임스탬프를 받으니 간단히 new Date로 파싱
    const parseTs = (ts: string) => new Date(ts).getTime()

    const sortedComments = useMemo(() => {
        const arr = [...filteredComments]
        if (sortBy === "likes") {
            arr.sort((a, b) => b.likes - a.likes) // 공감순
        } else {
            arr.sort((a, b) => parseTs(b.timestamp) - parseTs(a.timestamp)) // 최신순
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
        setVisibleCount(PAGE_SIZE) // 정렬 바꾸면 페이지 초기화
    }

    if (loading) {
        return (
            <div className="flex-1 mt-20">
                <div className="mb-6">
                    <h1 className="mb-4 text-2xl font-bold text-gray-900">
                        찬반 서명 로딩 중...
                    </h1>
                </div>
            </div>
        )
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

                    <button className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        내가 쓴 찬반 서명
                    </button>
                </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
                {sortedComments
                    .slice(0, visibleCount)
                    .map(comment => (
                        <Comment key={comment.id} comment={comment} />
                    ))}

                {/* Empty state */}
                {sortedComments.length === 0 && !loading && (
                    <div className="text-center text-gray-500 text-sm py-8 border border-dashed border-gray-200 rounded-lg">
                        아직 등록된 찬반 서명이 없습니다.
                    </div>
                )}

                {/* Load more */}
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