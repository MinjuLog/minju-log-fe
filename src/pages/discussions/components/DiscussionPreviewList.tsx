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

interface Props {
    status: Record<DiscussionStatusType, string>;
}

const PAGE_SIZE = 3;
const WINDOW_SIZE = 5;

// DiscussionStatusType → 백엔드에 넘길 status 값 매핑
const statusParamMap: Record<DiscussionStatusType, string | null> = {
    전체: null, // 전체면 status 파라미터 미사용 또는 빈 문자열로 처리
    COLLECTING: "OPEN",
    "전달 완료": "DELIVERED",
    "보도 중": "REPORTING",
    "반영 완료": "APPLIED",
};

export function DiscussionPreviewList({ status }: Props) {
    const [discussionPreviews, setDiscussionPreviews] = useState<DiscussionPreviewType[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedStatus, setSelectedStatus] = useState<DiscussionStatusType>("전체");

    // 검색 입력값 & 실제 검색어
    const [inputValue, setInputValue] = useState("");
    const [query, setQuery] = useState("");

    // 정렬: latest(최신순) / popular(인기순)
    const [sortOrder, setSortOrder] = useState<"latest" | "popular">("latest");

    // 페이지 (1-based)
    const [page, setPage] = useState(1);

    // 스크롤 유지용 ref
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

    // 서버에 필터/검색/정렬/페이지 반영해서 요청
    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);

                const statusParam = statusParamMap[selectedStatus];
                const sortParam = sortOrder === "latest" ? "LATEST" : "POPULAR";

                const res = await findProposalList({
                    keyword: query,
                    status: statusParam ?? "",
                    sort: sortParam,
                    pageable: {
                        page: page - 1, // 서버가 0-based라고 가정
                        size: PAGE_SIZE,
                        sort: ["proposalId,desc"],
                    },
                });

                if (!res.ok) {
                    setError(res.message);
                    alert(res.message); // 임시 처리
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

    // 검색 제출
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

    // 페이지 번호 계산 (윈도우)
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

            {/* 상태 필터 */}
            <DiscussionsStatusFilter
                status={status}
                selectedStatus={selectedStatus}
                setSelectedStatus={(v) => {
                    saveScroll();
                    setPage(1);
                    setSelectedStatus(v);
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

                {/* 정렬 버튼 토글 */}
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
                {loading && (
                    <div className="text-center text-sm text-gray-500 py-6">
                        불러오는 중입니다...
                    </div>
                )}

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