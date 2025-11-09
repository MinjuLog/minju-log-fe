interface props {
    tag: string;
    category: string;
    title: string;
    timeAgo: string;
    author: string;
}

export default function ContentHeader({ tag, category, title, timeAgo, author }: props) {
    return (
        <>
            <div className="mb-8">
                <div className="mb-3 flex items-center gap-2">
                    <span className="rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-600">{tag}</span>
                    <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">{category}</span>
                </div>

                <h1 className="mb-2 text-3xl font-bold text-gray-900">{title}</h1>

                <p className="text-sm text-gray-500">{timeAgo}</p>
            </div>

            {/* Author Section */}
            <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-6">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600" />
                        <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600">
                            <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{author}</p>
                    </div>
                </div>

                {/*<button className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100">*/}
                {/*    프로필 보기*/}
                {/*</button>*/}
            </div>
        </>
    )
}