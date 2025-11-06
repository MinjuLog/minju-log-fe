import React, { useMemo, useRef, useState } from "react";

interface props {
    selectedHashTags: string[];
    setSelectedHashTags: (value: string[]) => void;
    placeholder?: string;
    maxTags?: number;
    maxLength?: number;
}


export default function HashTagInput({
                                         selectedHashTags,
                                         setSelectedHashTags,
                                         placeholder = "해시태그를 입력하고 Enter 로 추가",
                                         maxTags = 3,
                                         maxLength = 6,
                                     }: props) {
    const [inputValue, setInputValue] = useState("");
    const [isComposing, setIsComposing] = useState(false); // ✅ IME 조합중 플래그
    const inputRef = useRef<HTMLInputElement | null>(null);

    const tags = useMemo(() => selectedHashTags ?? [], [selectedHashTags]);
    const canAddMore = tags.length < maxTags;

    const normalize = (raw: string) => {
        const cleaned = raw.trim().replace(/^#+/, "").replace(/\s+/g, " ");
        return cleaned.slice(0, maxLength);
    };

    const addTag = (raw: string) => {
        const next = normalize(raw);
        if (!next || !canAddMore || tags.includes(next)) return;
        setSelectedHashTags([...tags, next]);
        setInputValue("");
    };

    const removeTag = (t: string) => {
        setSelectedHashTags(tags.filter((x) => x !== t));
        inputRef.current?.focus();
    };

    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        const composing =
            isComposing || (e.nativeEvent)?.isComposing === true;

        if (e.key === "Enter" || e.key === "," || e.key === " ") {
            if (composing) return; // 조합 확정 먼저 끝나도록
            e.preventDefault();
            if (inputValue) addTag(inputValue);
        } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
            e.preventDefault();
            removeTag(tags[tags.length - 1]);
        }
    };

    const handleBlur: React.FocusEventHandler<HTMLInputElement> = () => {
        // 조합중에 blur 될 수 있으므로 가드
        if (!isComposing && inputValue) addTag(inputValue);
    };

    return (
        <div className="mb-8">
            <label className="mb-2 block text-sm font-medium text-gray-900">
                해시태그
            </label>

            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                {tags.map((t) => (
                    <span
                        key={t}
                        className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-200"
                    >
            #{t}
                        <button
                            type="button"
                            onClick={() => removeTag(t)}
                            className="ml-1 text-blue-500 hover:text-blue-700"
                            aria-label={`${t} 해제`}
                        >
              ×
            </button>
          </span>
                ))}

                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    // ✅ 조합 시작/종료 감지
                    onCompositionStart={() => setIsComposing(true)}
                    onCompositionEnd={() => setIsComposing(false)}
                    placeholder={canAddMore ? placeholder : "더 이상 추가할 수 없습니다"}
                    disabled={!canAddMore}
                    className="flex-1 min-w-[180px] bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
                />
            </div>

            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <span>
          총 {tags.length}개 {canAddMore ? `· 최대 ${maxTags}개` : "· 최대치 도달"}
        </span>
                <span className="hidden sm:block">Enter 로 추가, 배지의 × 클릭으로 제거</span>
            </div>
        </div>
    );
}