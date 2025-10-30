"use client"

import { useState } from "react"

interface props {
    isOpen: boolean
    onClose: () => void
    selectedId: number | null
    selectedOption: string
    onSubmit: (rebuttalText: string) => void
}

export default function SignSubmitModal({ isOpen, onClose, selectedId, selectedOption, onSubmit }: props) {
    const [rebuttalText, setRebuttalText] = useState("")

    if (!isOpen) return null

    const handleSubmit = () => {
        if (rebuttalText.trim()) {
            onSubmit(rebuttalText)
            setRebuttalText("")
            onClose()
        }
    }

    const bgMap: Record<number, string> = {
        1: "bg-blue-50",
        2: "bg-red-50",
    };

    // 글자색을 바꾸려는 의도라면 text- 사용
    const fontMap: Record<number, string> = {
        1: "text-blue-600",
        2: "text-red-600",
    };

    const bgClass = bgMap[selectedId ?? 0] ?? "bg-gray-50";
    const textClass = fontMap[selectedId ?? 0] ?? "text-gray-900";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                    aria-label="Close modal"
                >
                    <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Content */}
                <div className="p-8">
                    {/* Header */}
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        지지 서명을 남겨보세요.
                    </h2>

                    {/* Selected option display */}
                    <div className={`${bgClass} mb-6 rounded-xl p-6`}>
                        <p className={`${textClass} text-center text-xl font-bold leading-relaxed`}>
                            {selectedOption}
                        </p>
                    </div>

                    {/*/!* Warning Section *!/*/}
                    {/*<div className="mb-6">*/}
                    {/*    <div className="flex items-center gap-2 mb-3">*/}
                    {/*        <div className="w-5 h-5 bg-red-500 rounded flex items-center justify-center flex-shrink-0">*/}
                    {/*            <svg*/}
                    {/*                className="w-3 h-3 text-white"*/}
                    {/*                fill="none"*/}
                    {/*                strokeLinecap="round"*/}
                    {/*                strokeLinejoin="round"*/}
                    {/*                strokeWidth="3"*/}
                    {/*                viewBox="0 0 24 24"*/}
                    {/*                stroke="currentColor"*/}
                    {/*            >*/}
                    {/*                <path d="M5 13l4 4L19 7" />*/}
                    {/*            </svg>*/}
                    {/*        </div>*/}
                    {/*        <span className="text-red-500 font-semibold">{selectedOption}</span>*/}
                    {/*    </div>*/}

                    {/*    <p className="text-sm text-gray-600 leading-relaxed">*/}
                    {/*        진실이 중요하다고 치료한 생각입니다만, 거짓말이 무조건 잘못된 것만은 아니라고 생각합니다 물론 선의로든,*/}
                    {/*        악의로든 거짓말을 하면 최책감이 드는건 있을 수 있고 그렇지만 때로는 선택해서 하게서 한 선택일 수도 있는*/}
                    {/*        하안 거짓말이 그 선택의 기준에서 더이 될 수도 있어요 정말 피치못할 사정으로 인해 선의의 거짓말을 택할 수도*/}
                    {/*        있기 때문에요*/}
                    {/*    </p>*/}
                    {/*</div>*/}

                    {/* Text Input */}
                    <textarea
                        value={rebuttalText}
                        onChange={(e) => setRebuttalText(e.target.value)}
                        placeholder="건강한 토론 문화를 위해 불쾌감을 유발하는 욕설, 혐오, 비하 발언 등은 삭제될 수 있어요."
                        className="w-full h-24 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-6"
                    />

              {/*      /!* Recent Activity *!/*/}
              {/*      <div className="mb-6 space-y-2">*/}
              {/*          <div className="flex items-center gap-2 text-sm text-gray-600">*/}
              {/*              <div className="w-6 h-6 bg-gray-300 rounded-full flex-shrink-0" />*/}
              {/*              <span>*/}
              {/*  4시간전 <button className="text-blue-600 hover:underline font-medium">이하dd1uff</button>*/}
              {/*  님이 반박했어요.*/}
              {/*</span>*/}
              {/*          </div>*/}
              {/*          <div className="flex items-center gap-2 text-sm text-gray-600">*/}
              {/*              <div className="w-6 h-6 bg-gray-300 rounded-full flex-shrink-0" />*/}
              {/*              <span>*/}
              {/*  51분전 <button className="text-blue-600 hover:underline font-medium">RC100</button>*/}
              {/*  님이 반박했어요.*/}
              {/*</span>*/}
              {/*          </div>*/}
              {/*      </div>*/}

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleSubmit}
                            disabled={!rebuttalText.trim()}
                            className="w-full py-4 bg-blue-400 hover:bg-blue-500 disabled:bg-blue-200 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
                        >
                            지지 서명 남기기
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full text-gray-500 hover:text-gray-700 font-medium transition-colors"
                        >
                            다음에
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
