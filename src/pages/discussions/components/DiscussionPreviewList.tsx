"use client"

import { ArrowUpDown } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import type DiscussionPreviewType from "../types/DiscussionPreviewType.ts";
import DiscussionPreview from "./DiscussionPreview.tsx";
import type DiscussionCategoryType from "../types/DiscussionCategoryType.ts";
import DiscussionsCategoryFilter from "./DiscussionsCategoryFilter.tsx";

interface Props {
    categories: DiscussionCategoryType[];
    discussionPreviews: DiscussionPreviewType[];
}

const PAGE_SIZE = 3;
const WINDOW_SIZE = 5; // 숫자 버튼 최대 개수(1,2,3,4,5 형태)

export function DiscussionPreviewList({ categories, discussionPreviews }: Props) {
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [page, setPage] = useState(1); // 1-based

    // 필터링
    const filtered = useMemo(() => {
        return discussionPreviews.filter((preview) =>
            selectedCategory === 0
                ? true
                : preview.categories.some((c) => c.id === selectedCategory)
        );
    }, [discussionPreviews, selectedCategory]);

    // 총 페이지
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

    // 카테고리 변경 시 1페이지로 리셋
    useEffect(() => {
        setPage(1);
    }, [selectedCategory]);

    // 현재 페이지 데이터
    const startIdx = (page - 1) * PAGE_SIZE;
    const current = filtered.slice(startIdx, startIdx + PAGE_SIZE);

    // 페이지 버튼 범위(슬라이딩 윈도우)
    const pageNumbers = useMemo(() => {
        const half = Math.floor(WINDOW_SIZE / 2);
        let start = Math.max(1, page - half);
        let end = start + WINDOW_SIZE - 1;
        if (end > totalPages) {
            end = totalPages;
            start = Math.max(1, end - WINDOW_SIZE + 1);
        }
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }, [page, totalPages]);

    const goToPage = (p: number) => {
        if (p < 1 || p > totalPages) return;
        setPage(p);
        // 접근성: 페이지 이동 시 리스트 맨 위로 포커스 이동하고 싶다면 여기서 처리 가능
    };

    return (
        <section className="mt-16 pt-16 border-t border-border">
            <h2 className="text-3xl font-bold mb-8">지난 동네한표</h2>

            {/* Category filters */}
            <DiscussionsCategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />

            {/* Sort option */}
            <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
                <span>기본순</span>
                <ArrowUpDown className="w-4 h-4" />
            </div>

            {/* Past debates list */}
            <div className="space-y-4">
                {current.map((preview) => (
                    <DiscussionPreview
                        key={preview.id}
                        selectedCategory={selectedCategory}
                        discussionPreview={preview}
                    />
                ))}

                {/* 비어있을 때 */}
                {filtered.length === 0 && (
                    <div className="text-center text-sm text-gray-500 border border-dashed border-gray-200 rounded-lg py-10">
                        해당 카테고리에 지난 토론이 없습니다.
                    </div>
                )}
            </div>

            {/* Pagination */}
            {filtered.length > 0 && (
                <nav className="mt-6 flex items-center justify-center gap-2" aria-label="페이지네이션">
                    <button
                        type="button"
                        onClick={() => goToPage(page - 1)}
                        disabled={page === 1}
                        className="px-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-700 disabled:opacity-50 hover:bg-gray-50"
                        aria-label="이전 페이지"
                    >
                        이전
                    </button>

                    {/* 첫 페이지로 점프 버튼(필요 시 노출) */}
                    {pageNumbers[0] > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={() => goToPage(1)}
                                className="px-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50"
                                aria-label="1페이지"
                            >
                                1
                            </button>
                            {pageNumbers[0] > 2 && <span className="px-1 text-gray-400">…</span>}
                        </>
                    )}

                    {pageNumbers.map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => goToPage(p)}
                            aria-current={p === page ? "page" : undefined}
                            className={`px-3 py-2 rounded-md border text-sm ${
                                p === page
                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            {p}
                        </button>
                    ))}

                    {/* 끝 페이지로 점프 버튼(필요 시 노출) */}
                    {pageNumbers[pageNumbers.length - 1] < totalPages && (
                        <>
                            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                                <span className="px-1 text-gray-400">…</span>
                            )}
                            <button
                                type="button"
                                onClick={() => goToPage(totalPages)}
                                className="px-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50"
                                aria-label={`${totalPages}페이지`}
                            >
                                {totalPages}
                            </button>
                        </>
                    )}

                    <button
                        type="button"
                        onClick={() => goToPage(page + 1)}
                        disabled={page === totalPages}
                        className="px-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-700 disabled:opacity-50 hover:bg-gray-50"
                        aria-label="다음 페이지"
                    >
                        다음
                    </button>
                </nav>
            )}

            {/* 페이지 정보 */}
            <p className="mt-2 text-center text-xs text-muted-foreground">
                {filtered.length}개 중 {(startIdx + 1)}–{Math.min(startIdx + PAGE_SIZE, filtered.length)} 표시
            </p>
        </section>
    );
}