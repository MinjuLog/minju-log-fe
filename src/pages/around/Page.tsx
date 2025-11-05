"use client"

import { useEffect, useMemo, useState } from "react";
import AroundHeader from "../../components/AroundHeader.tsx";
import type AroundPreviewType from "./types/AroundPreviewType.ts";
import AroundPreview from "./components/AroundPreview.tsx";

const aroundPreviewMock: AroundPreviewType[] = [
    { id: 1, label: "전남 곡성군", title: "청년 농부들이 만든\n스마트팜 협동조합", bgColor: "bg-green-50", textColor: "text-green-700", titleColor: "text-gray-900", illustration: "/smartfarm.jpg" },
    { id: 2, label: "강원 춘천시", title: "도심 속 폐공장을\n청년 창업 공간으로 재탄생", bgColor: "bg-amber-50", textColor: "text-amber-700", titleColor: "text-gray-900", progress: "창업 12팀 활동 중", illustration: "/urban-renewal.jpg" },
    { id: 3, label: "전북 전주시", title: "지역 예술가와 함께 하는\n‘거리 예술 축제’ 운영", bgColor: "bg-blue-50", textColor: "text-blue-700", titleColor: "text-gray-900", badge: "참여자 3천명", illustration: "/street-art.jpg" },
    { id: 4, label: "경북 안동시", title: "전통시장 디지털화로\n소상공인 매출 30%↑", bgColor: "bg-yellow-50", textColor: "text-yellow-700", titleColor: "text-gray-900", illustration: "/digital-market.jpg" },
    { id: 5, label: "제주 서귀포시", title: "친환경 전기차 공유로\n탄소중립 도시 실현", bgColor: "bg-teal-50", textColor: "text-teal-700", titleColor: "text-gray-900", illustration: "/ev-sharing.jpg" },
    { id: 6, label: "서울 은평구", title: "주민이 직접 기획하는\n마을 의사결정 플랫폼", bgColor: "bg-pink-50", textColor: "text-pink-700", titleColor: "text-gray-900", illustration: "/community-meeting.jpg" },
    // 항목 더 늘어나도 자동으로 동작
];

const PAGE_SIZE = 6;
const WINDOW_SIZE = 5;

export default function AroundPage() {
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1); // 1-based

    // 필터링
    const filtered = useMemo(() => {
        const q = query.trim();
        if (!q) return aroundPreviewMock;
        const norm = (s: string) => s.replace(/\s+/g, "").toLowerCase();
        const nq = norm(q);
        return aroundPreviewMock.filter((item) => {
            const text = `${item.label} ${item.title}`.replace(/\n/g, " ");
            return norm(text).includes(nq);
        });
    }, [query]);

    // 총 페이지/현재 슬라이스
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const startIdx = (page - 1) * PAGE_SIZE;
    const current = filtered.slice(startIdx, startIdx + PAGE_SIZE);

    // 검색어 변경 시 페이지 리셋
    useEffect(() => {
        setPage(1);
    }, [query]);

    // 페이지 버튼 계산(슬라이딩 윈도우)
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
    };

    return (
        <div className="mx-auto max-w-7xl">
            {/* Header */}
            <AroundHeader />

            {/* 검색 */}
            <div className="mb-6 flex items-center gap-3">
                <label htmlFor="around-search" className="sr-only">검색</label>
                <input
                    id="around-search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="지역/제목으로 검색"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                />
                <span className="text-xs text-gray-500 whitespace-nowrap">
          총 {filtered.length}건
        </span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {current.map((aroundPreview) => (
                    <AroundPreview aroundPreview={aroundPreview} key={aroundPreview.id} />
                ))}

                {filtered.length === 0 && (
                    <div className="col-span-full text-center text-sm text-gray-500 border border-dashed border-gray-200 rounded-lg py-12">
                        검색 결과가 없습니다.
                    </div>
                )}
            </div>

            {/* 페이지네이션 */}
            {filtered.length > 0 && (
                <>
                    <nav className="mt-8 flex items-center justify-center gap-2" aria-label="페이지네이션">
                        <button
                            type="button"
                            onClick={() => goToPage(page - 1)}
                            disabled={page === 1}
                            className="px-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-700 disabled:opacity-50 hover:bg-gray-50"
                            aria-label="이전 페이지"
                        >
                            이전
                        </button>

                        {pageNumbers[0] > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => goToPage(1)}
                                    className="px-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50"
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

                        {pageNumbers[pageNumbers.length - 1] < totalPages && (
                            <>
                                {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                                    <span className="px-1 text-gray-400">…</span>
                                )}
                                <button
                                    type="button"
                                    onClick={() => goToPage(totalPages)}
                                    className="px-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50"
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

                    <p className="mt-2 text-center text-xs text-gray-500">
                        {filtered.length}개 중 {filtered.length === 0 ? 0 : startIdx + 1}
                        –
                        {Math.min(startIdx + PAGE_SIZE, filtered.length)} 표시
                    </p>
                </>
            )}
        </div>
    );
}