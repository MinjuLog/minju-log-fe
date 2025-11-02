import { useEffect, useMemo, useRef } from "react";
import type CategoryType from "../types/CategoryType.ts";

interface Props {
    categories: CategoryType[];                 // { id: number; text: string }
    selectedCategoryIds?: number[] | null;      // 선택된 id 리스트
    setSelectedCategoryIds: (ids: number[]) => void;
    isCategoryDropdownOpen: boolean;
    setIsCategoryDropdownOpen: (isOpen: boolean) => void;
}

export default function CategorySelection({
                                              categories,
                                              selectedCategoryIds,
                                              setSelectedCategoryIds,
                                              isCategoryDropdownOpen,
                                              setIsCategoryDropdownOpen,
                                          }: Props) {
    const selectedIds = selectedCategoryIds ?? [];
    const btnRef = useRef<HTMLButtonElement | null>(null);
    const popRef = useRef<HTMLDivElement | null>(null);

    // 바깥 클릭 시 닫기
    useEffect(() => {
        function onClickOutside(e: MouseEvent) {
            if (!isCategoryDropdownOpen) return;
            const t = e.target as Node;
            if (btnRef.current?.contains(t) || popRef.current?.contains(t)) return;
            setIsCategoryDropdownOpen(false);
        }
        window.addEventListener("mousedown", onClickOutside);
        return () => window.removeEventListener("mousedown", onClickOutside);
    }, [isCategoryDropdownOpen, setIsCategoryDropdownOpen]);

    const summaryText = useMemo(() => {
        if (selectedIds.length === 0) return "카테고리 선택";
        if (selectedIds.length === categories.length) return "전체";
        // 최대 2개까지 이름 노출 + 나머지 개수
        const names = categories
            .filter(c => selectedIds.includes(c.id))
            .map(c => c.text);
        if (names.length <= 2) return names.join(", ");
        return `${names.slice(0, 2).join(", ")} 외 ${names.length - 2}`;
    }, [selectedIds, categories]);

    const toggleOne = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedCategoryIds(selectedIds.filter(x => x !== id));
        } else {
            setSelectedCategoryIds([...selectedIds, id]);
        }
    };

    const allSelected = selectedIds.length === categories.length && categories.length > 0;

    const toggleAll = () => {
        if (allSelected) setSelectedCategoryIds([]);
        else setSelectedCategoryIds(categories.map(c => c.id));
    };

    return (
        <div className="mb-8">
            <label className="mb-2 block text-sm font-medium text-gray-900">카테고리</label>

            <div className="relative">
                <button
                    ref={btnRef}
                    type="button"
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-left text-gray-500 hover:border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    aria-haspopup="listbox"
                    aria-expanded={isCategoryDropdownOpen}
                >
                    <span className="truncate">{summaryText}</span>
                    <svg
                        className={`h-5 w-5 shrink-0 transition-transform ${
                            isCategoryDropdownOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isCategoryDropdownOpen && (
                    <div
                        ref={popRef}
                        className="absolute z-10 mt-2 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
                        role="listbox"
                    >
                        <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-3 py-2">
              <span className="text-xs font-medium text-gray-500">
                총 {categories.length}개 · 선택 {selectedIds.length}개
              </span>
                            <button
                                type="button"
                                onClick={toggleAll}
                                className="rounded-md px-2 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                            >
                                {allSelected ? "전체 해제" : "전체 선택"}
                            </button>
                        </div>

                        <ul className="max-h-56 overflow-auto py-1">
                            {categories.map((c) => {
                                const checked = selectedIds.includes(c.id);
                                return (
                                    <li key={c.id}>
                                        <button
                                            type="button"
                                            onClick={() => toggleOne(c.id)}
                                            className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                                                checked ? "bg-gray-50" : ""
                                            }`}
                                            role="option"
                                            aria-selected={checked}
                                        >
                      <span
                          className={`flex h-4 w-4 items-center justify-center rounded border ${
                              checked ? "border-blue-500 bg-blue-500" : "border-gray-300 bg-white"
                          }`}
                      >
                        {checked && (
                            <svg
                                className="h-3 w-3 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M20 6L9 17l-5-5" />
                            </svg>
                        )}
                      </span>
                                            <span className="text-gray-800">{c.text}</span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>

                        <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-3 py-2">
                            <button
                                type="button"
                                onClick={() => setIsCategoryDropdownOpen(false)}
                                className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                닫기
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsCategoryDropdownOpen(false)}
                                className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                적용
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* 선택된 카테고리 배지 요약 (선택 시 표시) */}
            {selectedIds.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {categories
                        .filter(c => selectedIds.includes(c.id))
                        .map(c => (
                            <span
                                key={c.id}
                                className="text-gray-500 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-200"
                            >
                {c.text}
                                <button
                                    type="button"
                                    onClick={() => toggleOne(c.id)}
                                    className="ml-1 text-blue-500 hover:text-blue-700"
                                    aria-label={`${c.text} 해제`}
                                >
                  ×
                </button>
              </span>
                        ))}
                </div>
            )}
        </div>
    );
}