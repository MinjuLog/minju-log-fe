interface props {
    handleSubmit: () => void;
}

export default function Sidebar({ handleSubmit }: props) {
    return (
        <div className="w-80">
            <button
                onClick={handleSubmit}
                className="mb-6 w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                게시하기
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
                </ul>
            </div>
        </div>
    )
}