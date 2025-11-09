interface props {
    onQuotationClick: () => void;
}


export default function ContentFooter({ onQuotationClick }: props) {
    return (
        <>
            <div className="mt-12 flex items-center gap-3 border-t border-gray-200 pt-6">
                <button
                    onClick={onQuotationClick}
                    className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
                >
                    인용하기
                </button>
                <p className="text-sm text-gray-500">
                    해당 토픽을 인용하여 <span className="font-medium text-gray-700">동네한표</span>를 생성할 수 있어요.
                </p>
                {/*<div className="flex items-center gap-6">*/}
                {/*    <button className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900">*/}
                {/*        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
                {/*            <path*/}
                {/*                strokeLinecap="round"*/}
                {/*                strokeLinejoin="round"*/}
                {/*                strokeWidth={2}*/}
                {/*                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"*/}
                {/*            />*/}
                {/*        </svg>*/}
                {/*        <span className="text-sm">0</span>*/}
                {/*    </button>*/}

                {/*    <button className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900">*/}
                {/*        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
                {/*            <path*/}
                {/*                strokeLinecap="round"*/}
                {/*                strokeLinejoin="round"*/}
                {/*                strokeWidth={2}*/}
                {/*                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"*/}
                {/*            />*/}
                {/*        </svg>*/}
                {/*        <span className="text-sm">0</span>*/}
                {/*    </button>*/}
                {/*</div>*/}

                {/*<button className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900">*/}
                {/*    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
                {/*        <path*/}
                {/*            strokeLinecap="round"*/}
                {/*            strokeLinejoin="round"*/}
                {/*            strokeWidth={2}*/}
                {/*            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"*/}
                {/*        />*/}
                {/*    </svg>*/}
                {/*    <span className="text-sm">0</span>*/}
                {/*</button>*/}
            </div>

            {/* Author Profile Card */}
            {/*<div className="mt-6 rounded-2xl bg-gray-50 p-6">*/}
            {/*    <div className="flex items-center justify-between">*/}
            {/*        <div className="flex-1">*/}
            {/*            <button className="group mb-2 flex items-center gap-1 transition-colors hover:text-blue-600">*/}
            {/*                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600">{author}</h3>*/}
            {/*                <svg*/}
            {/*                    className="h-5 w-5 text-gray-400 group-hover:text-blue-600"*/}
            {/*                    fill="none"*/}
            {/*                    stroke="currentColor"*/}
            {/*                    viewBox="0 0 24 24"*/}
            {/*                >*/}
            {/*                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />*/}
            {/*                </svg>*/}
            {/*            </button>*/}
            {/*            <p className="mb-4 text-sm text-gray-600">{company}</p>*/}
            {/*            <div className="flex items-center gap-3">*/}
            {/*                <span className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-700">글 작성 {writeCount}회</span>*/}
            {/*                <span className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-700">전문가 답변 {replyCount}회</span>*/}
            {/*            </div>*/}
            {/*        </div>*/}

            {/*        <div className="relative ml-6">*/}
            {/*            <img*/}
            {/*                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-M4DYF3fAbCGJMXRI99HUrhffDAKsWt.png"*/}
            {/*                alt="송인호 변호사"*/}
            {/*                className="h-20 w-20 rounded-full object-cover"*/}
            {/*            />*/}
            {/*            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">*/}
            {/*                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">*/}
            {/*                    <path*/}
            {/*                        fillRule="evenodd"*/}
            {/*                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"*/}
            {/*                        clipRule="evenodd"*/}
            {/*                    />*/}
            {/*                </svg>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </>
    )
}