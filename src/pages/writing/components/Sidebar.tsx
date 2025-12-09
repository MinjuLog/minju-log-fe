interface props {
    loading: boolean;
    handleSubmit: () => void;
}

export default function Sidebar({ loading, handleSubmit }: props) {
    return (
        <div className="w-80">
            <button
                disabled={loading}
                onClick={handleSubmit}
                className="mb-6 w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-70 flex justify-center items-center gap-2"
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
                        게시 중
                    </>
                ) : (
                    "게시하기"
                )}
            </button>

            <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                    <div
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-xs font-medium text-white">
                        i
                    </div>
                    <h3 className="font-medium text-gray-900">꼭 확인해 주세요.</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex gap-2">
                        <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400"/>
                        <span>내가 올린 동네한표는 타 사이트에서 검색될 통해 노출될 수 있어요.</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400"/>
                        <span>동네한표는 수정할 수 없어요.</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400"/>
                        <span>정치적인 성향의 글은 무통보 삭제될 수 있어요.</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}