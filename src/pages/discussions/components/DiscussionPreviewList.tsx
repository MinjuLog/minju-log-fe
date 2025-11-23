"use client";

import { ArrowUpDown, Search, X } from "lucide-react";
import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type KeyboardEventHandler,
} from "react";
import DiscussionPreview from "./DiscussionPreview";
import DiscussionsStatusFilter from "./DiscussionsStatusFilter";
import type { DiscussionStatusType } from "../types/DiscussionStatusType";
import type DiscussionPreviewType from "../types/DiscussionPreviewType";
import { findProposalList } from "../../../api/proposal/proposal";
import discussionPreviewConverter from "../converter/discussionPreviewConverter.ts";

const PAGE_SIZE = 3;
const WINDOW_SIZE = 5;

const statusParamMap: Record<DiscussionStatusType, string | null> = {
    전체: null,
    COLLECTING: "OPEN",
    "전달 완료": "DELIVERED",
    "보도 중": "REPORTING",
    "반영 완료": "APPLIED",
};

// 스켈레톤 카드
function DiscussionPreviewSkeleton() {
    return (
        <div
            className="border-1 bg-secondary/20 rounded-xl p-6
                       transition-all duration-300
                       animate-pulse"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex gap-2">
                    <span className="h-4 w-16 bg-gray-200 rounded" />
                    <span className="h-4 w-14 bg-gray-200 rounded" />
                    <span className="h-4 w-12 bg-gray-200 rounded" />
                </div>
                <span className="h-4 w-20 bg-gray-200 rounded" />
            </div>

            <div className="mb-4">
                <div className="h-5 w-64 bg-gray-200 rounded mb-2" />
                <div className="h-5 w-40 bg-gray-200 rounded" />
            </div>

            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    <div className="px-4 py-2 rounded-lg border-2 border-gray-200">
                        <div className="h-4 w-28 bg-gray-200 rounded" />
                    </div>
                    <div className="px-4 py-2 rounded-lg border-2 border-gray-200">
                        <div className="h-4 w-28 bg-gray-200 rounded" />
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <div className="h-3 w-10 bg-gray-200 rounded mb-2" />
                        <div className="h-4 w-8 bg-gray-200 rounded mx-auto" />
                    </div>
                    <div className="text-center">
                        <div className="h-3 w-10 bg-gray-200 rounded mb-2" />
                        <div className="h-4 w-8 bg-gray-200 rounded mx-auto" />
                    </div>
                    <div className="w-5 h-5 bg-gray-200 rounded-full" />
                </div>
            </div>
        </div>
    );
}

export function DiscussionPreviewList() {
    const [discussionPreviews, setDiscussionPreviews] = useState<DiscussionPreviewType[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedStatus, setSelectedStatus] = useState<DiscussionStatusType>("전체");
    const [inputValue, setInputValue] = useState("");
    const [query, setQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<"latest" | "popular">("latest");
    const [page, setPage] = useState(1);

    const listWrapRef = useRef<HTMLDivElement | null>(null);
    const savedScrollRef = useRef<number>(0);

    const saveScroll = () => {
        if (listWrapRef.current) {
            savedScrollRef.current = listWrapRef.current.scrollTop;
        }
    };

    useLayoutEffect(() => {
        if (listWrapRef.current) {
            listWrapRef.current.scrollTop = savedScrollRef.current;
        }
    });

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);

                const statusParam = statusParamMap[selectedStatus];

                const params: any = {};

                if (query) params.keyword = query;
                if (statusParam) params.status = statusParam;
                if (sortOrder) params.sort = sortOrder;
                if (page) params.page = page - 1;
                params.size = PAGE_SIZE;

                const res = await findProposalList(params);

                if (!res.ok) {
                    setError(res.message);
                    alert(res.message);
                    return;
                }

                const previews = discussionPreviewConverter(res);
                setDiscussionPreviews(previews);
                setTotalPages(res.totalPages);
                setTotalElements(res.totalElements);
            } finally {
                setLoading(false);
            }
        };

        saveScroll();
        load();
    }, [selectedStatus, sortOrder, query, page]);

    const submitSearch = () => {
        saveScroll();
        setPage(1);
        setQuery(inputValue.trim());
    };

    const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            submitSearch();
        }
    };

    const clearSearch = () => {
        saveScroll();
        setInputValue("");
        setQuery("");
        setPage(1);
    };

    const goToPage = (p: number) => {
        if (p < 1 || p > totalPages) return;
        saveScroll();
        setPage(p);
    };

    const pageNumbers = (() => {
        const half = Math.floor(WINDOW_SIZE / 2);
        let start = Math.max(1, page - half);
        let end = start + WINDOW_SIZE - 1;
        if (end > totalPages) {
            end = totalPages;
            start = Math.max(1, end - WINDOW_SIZE + 1);
        }
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    })();

    return (
        <section className="mt-16 pt-16 border-t border-border">
            <h2 className="text-3xl font-bold mb-8">지난 동네한표</h2>

            <DiscussionsStatusFilter
                selectedStatus={selectedStatus}
                setSelectedStatus={(v) => {
                    saveScroll();
                    setPage(1);
                    setSelectedStatus(v);
                }}
            />

            {/* 검색 + 정렬 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
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

                    <button
                        type="button"
                        onClick={submitSearch}
                        className="mt-2 sm:mt-0 sm:absolute sm:right-[-54px] sm:top-0 sm:h-full px-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50"
                    >
                        검색
                    </button>
                </div>

                <button
                    onClick={() => {
                        saveScroll();
                        setPage(1);
                        setSortOrder(sortOrder === "latest" ? "popular" : "latest");
                    }}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition"
                >
                    <ArrowUpDown className="w-4 h-4" />
                    <span>{sortOrder === "latest" ? "최신순" : "인기순"}</span>
                </button>
            </div>

            {/* 리스트 영역 */}
            <div ref={listWrapRef} className="space-y-4">
                {loading &&
                    Array.from({ length: PAGE_SIZE }).map((_, idx) => (
                        <DiscussionPreviewSkeleton key={idx} />
                    ))}

                {!loading &&
                    discussionPreviews.map((preview) => (
                        <DiscussionPreview
                            key={preview.id}
                            discussionPreview={preview}
                        />
                    ))}

                {!loading && discussionPreviews.length === 0 && (
                    <div className="text-center text-sm text-gray-500 border border-dashed border-gray-200 rounded-lg py-10">
                        검색 결과가 없습니다.
                    </div>
                )}

                {error && (
                    <p className="text-center text-xs text-red-500 mt-2">
                        {error}
                    </p>
                )}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
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

            <p className="mt-2 text-center text-xs text-gray-400">
                총 {totalElements}개 중{" "}
                {totalElements === 0
                    ? 0
                    : (page - 1) * PAGE_SIZE + 1}
                –
                {Math.min(page * PAGE_SIZE, totalElements)} 표시
            </p>
        </section>
    );
}