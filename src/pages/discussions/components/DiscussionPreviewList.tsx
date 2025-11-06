"use client"

import { ArrowUpDown, Search, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react"
import type DiscussionPreviewType from "../types/DiscussionPreviewType.ts"
import DiscussionPreview from "./DiscussionPreview.tsx"
import DiscussionsStatusFilter from "./DiscussionsStatusFilter.tsx"
import type DiscussionStatusMock from "../types/DiscussionStatusType.ts"

interface Props {
    status: DiscussionStatusMock[]
    discussionPreviews: DiscussionPreviewType[]
}

const PAGE_SIZE = 3
const WINDOW_SIZE = 5

export function DiscussionPreviewList({ status, discussionPreviews }: Props) {
    const [selectedStatus, setSelectedStatus] = useState(0)

    // 🔍 입력값과 실제 검색어 분리
    const [inputValue, setInputValue] = useState("")
    const [query, setQuery] = useState("")

    const [sortOrder, setSortOrder] = useState<"latest" | "popular">("latest")
    const [page, setPage] = useState(1)

    // 스크롤 고정용 ref
    const listWrapRef = useRef<HTMLDivElement | null>(null)
    const savedScrollRef = useRef<number>(0)

    // 공통: 상태변경 전에 스크롤 위치 저장
    const saveScroll = () => {
        if (listWrapRef.current) savedScrollRef.current = listWrapRef.current.scrollTop
    }
    // 공통: 렌더 후 스크롤 복원
    useLayoutEffect(() => {
        if (listWrapRef.current) {
            listWrapRef.current.scrollTop = savedScrollRef.current
        }
    })

    // 🔎 검색 제출
    const submitSearch = () => {
        saveScroll()
        setQuery(inputValue.trim())
    }

    // Enter로 검색
    const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === "Enter") {
            e.preventDefault()
            submitSearch()
        }
    }

    // X로 입력/검색 초기화
    const clearSearch = () => {
        saveScroll()
        setInputValue("")
        setQuery("")
    }

    // 필터링(상태 + 검색어)
    const filtered = useMemo(() => {
        return discussionPreviews.filter((preview) => {
            const matchesStatus = selectedStatus === 0 || preview.status === selectedStatus
            const q = query.toLowerCase()
            const matchesQuery =
                q === "" ||
                preview.title.toLowerCase().includes(q) ||
                preview.hashtags?.some((tag) => tag.toLowerCase().includes(q))
            return matchesStatus && matchesQuery
        })
    }, [discussionPreviews, selectedStatus, query])

    // 정렬
    const sorted = useMemo(() => {
        const arr = [...filtered]
        if (sortOrder === "latest") arr.sort((a, b) => b.sequence - a.sequence)
        else arr.sort((a, b) => b.votes - a.votes)
        return arr
    }, [filtered, sortOrder])

    // 조건 변경 시 1페이지로 (스크롤 유지)
    useEffect(() => {
        saveScroll()
        setPage(1)
    }, [selectedStatus, sortOrder, query])

    // 페이지 계산
    const startIdx = (page - 1) * PAGE_SIZE
    const current = sorted.slice(startIdx, startIdx + PAGE_SIZE)

    const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
    const pageNumbers = useMemo(() => {
        const half = Math.floor(WINDOW_SIZE / 2)
        let start = Math.max(1, page - half)
        let end = start + WINDOW_SIZE - 1
        if (end > totalPages) {
            end = totalPages
            start = Math.max(1, end - WINDOW_SIZE + 1)
        }
        return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    }, [page, totalPages])

    const goToPage = (p: number) => {
        if (p < 1 || p > totalPages) return
        saveScroll()
        setPage(p)
    }

    return (
        <section className="mt-16 pt-16 border-t border-border">
            <h2 className="text-3xl font-bold mb-8">지난 동네한표</h2>

            {/* 상태 필터 */}
            <DiscussionsStatusFilter
                status={status}
                selectedStatus={selectedStatus}
                setSelectedStatus={(v) => {
                    saveScroll()
                    setSelectedStatus(v)
                }}
            />

            {/* 검색 + 정렬 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
                {/* 검색창 */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder="제목이나 해시태그로 검색..."
                        className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                    />
                    {/* Clear 버튼 */}
                    {inputValue && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="absolute right-2 top-2 p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                            aria-label="검색어 지우기"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                    {/* 검색 버튼 */}
                    <button
                        type="button"
                        onClick={submitSearch}
                        className="mt-2 sm:mt-0 sm:absolute sm:right-[-54px] sm:top-0 sm:h-full px-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50"
                    >
                        검색
                    </button>
                </div>

                {/* 정렬 버튼 (토글) */}
                <button
                    onClick={() => {
                        saveScroll()
                        setSortOrder(sortOrder === "latest" ? "popular" : "latest")
                    }}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition"
                >
                    <ArrowUpDown className="w-4 h-4" />
                    <span>{sortOrder === "latest" ? "최신순" : "인기순"}</span>
                </button>
            </div>

            {/* 리스트 (스크롤 고정 대상) */}
            <div ref={listWrapRef} className="space-y-4 overflow-auto">
                {current.map((preview) => (
                    <DiscussionPreview key={preview.id} discussionPreview={preview} />
                ))}

                {sorted.length === 0 && (
                    <div className="text-center text-sm text-gray-500 border border-dashed border-gray-200 rounded-lg py-10">
                        검색 결과가 없습니다.
                    </div>
                )}
            </div>

            {/* 페이지네이션 */}
            {sorted.length > 0 && (
                <nav className="mt-6 flex items-center justify-center gap-2">
                    <button
                        onClick={() => goToPage(page - 1)}
                        disabled={page === 1}
                        className="px-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-700 disabled:opacity-50 hover:bg-gray-50"
                    >
                        이전
                    </button>

                    {pageNumbers.map((p) => (
                        <button
                            key={p}
                            onClick={() => goToPage(p)}
                            className={`px-3 py-2 rounded-md border text-sm ${
                                p === page
                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            {p}
                        </button>
                    ))}

                    <button
                        onClick={() => goToPage(page + 1)}
                        disabled={page === totalPages}
                        className="px-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-700 disabled:opacity-50 hover:bg-gray-50"
                    >
                        다음
                    </button>
                </nav>
            )}

            <p className="mt-2 text-center text-xs text-muted-foreground">
                {sorted.length}개 중 {sorted.length ? startIdx + 1 : 0}–
                {Math.min(startIdx + PAGE_SIZE, sorted.length)} 표시
            </p>
        </section>
    )
}