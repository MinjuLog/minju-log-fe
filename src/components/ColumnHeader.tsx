export default function ColumnHeader() {
    return (
        <div className="flex items-start justify-between">
            <div>
                <h1 className="text-5xl font-bold text-gray-900">잉크</h1>
                <p className="mt-2 text-lg text-gray-600">전문가의 생각, 잉크로 기록되다</p>
            </div>
            <button
                className="flex items-center gap-2 rounded-lg border-2 border-blue-600 px-6 py-3 text-blue-600 transition-colors hover:bg-blue-50">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                </svg>
                <span className="font-medium">글 작성하기</span>
            </button>
        </div>
    )
}