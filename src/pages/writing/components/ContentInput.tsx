interface props {
    content: string;
    setContent: (content: string) => void;
    handleImageUpload: () => void;
    contentMaxLength: number;
    contentMinLength: number;
    handleBulletList: () => void;
    handleBold: () => void;
    handleLink: () => void;
}

export default function ContentInput({ content,
                                         setContent,
                                         handleImageUpload,
                                         handleBulletList,
                                         handleBold,
                                         handleLink,
                                         contentMaxLength,
                                         contentMinLength }: props) {
    return (
        <div>
            <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-900">내용</label>
                <span className="text-sm text-gray-500">
                                        {content.length} / {contentMaxLength.toLocaleString()}자 (최소 {contentMinLength}문자)
                                      </span>
            </div>

            {/* Toolbar */}
            <div className="mb-2 flex gap-2">
                <button
                    onClick={handleImageUpload}
                    className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    title="이미지 업로드"
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                </button>
                <button
                    onClick={handleBulletList}
                    className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    title="글머리 기호"
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>
                <button
                    onClick={handleBold}
                    className="rounded p-2 font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    title="굵게"
                >
                    B
                </button>
                <button
                    onClick={handleLink}
                    className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    title="링크 삽입"
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                    </svg>
                </button>
            </div>

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value.slice(0, contentMaxLength))}
                placeholder="질문의 내용을 구체적으로 적어주세요. 전문가 및 다른회원에게 더 좋은 답변을 받을 수 있어요."
                className="h-64 w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
        </div>
    )
}