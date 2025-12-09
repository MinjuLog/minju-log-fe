"use client";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    selectedOption: string;
    selectedId: number | null;
    loading: boolean;
    onConfirm: () => void;
}

export default function VoteConfirmationModal({
                                                  isOpen,
                                                  onClose,
                                                  selectedOption,
                                                  selectedId,
                                                  loading,
                                                  onConfirm,
                                              }: Props) {
    if (!isOpen) return null;

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
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <button
                aria-hidden
                onClick={onClose}
                className="absolute inset-0 bg-black/50"
            />

            {/* Modal */}
            <div
                role="dialog"
                aria-modal="true"
                className="relative z-10 mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 transition-colors hover:bg-gray-300"
                    aria-label="Close modal"
                >
                    <svg
                        className="h-5 w-5 text-gray-600"
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

                {/* Header */}
                <h2 className="mb-6 text-center text-lg font-semibold text-gray-900">
                    투표 후에는 변경할 수 없어요.
                </h2>

                {/* Selected option label */}
                <p className="mb-3 text-center text-sm text-gray-600">선택한 항목</p>

                {/* Selected option display */}
                <div className={`${bgClass} mb-6 rounded-xl p-6`}>
                    <p className={`${textClass} text-center text-xl font-bold leading-relaxed`}>
                        {selectedOption}
                    </p>
                </div>

                {/* Confirm button */}
                <button
                    disabled={loading}
                    onClick={onConfirm}
                    className="w-full rounded-xl bg-blue-600 py-4 disabled:opacity-70 flex justify-center items-center gap-2 font-semibold text-white transition-colors hover:bg-blue-700"
                >
                    {loading ? (
                        <>
                            <svg
                                className="h-5 w-5 animate-spin text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                ></path>
                            </svg>
                            반영 중
                        </>
                    ) : (
                        "투표하기"
                    )}
                </button>
            </div>
        </div>
    );
}