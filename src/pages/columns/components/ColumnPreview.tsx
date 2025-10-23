import type {ColumnPreviewType} from "../types/ArticlePreviewType.ts";

export default function ColumnPreview({ column }: { column: ColumnPreviewType }) {
    return (
        <article
            key={column.id}
            className="flex gap-6 rounded-2xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg"
        >
            {/* Thumbnail */}
            <div className="relative h-40 w-60 flex-shrink-0 overflow-hidden rounded-xl">
                {/*<image*/}
                {/*    src={article.thumbnail || "/placeholder.svg"}*/}
                {/*    alt={article.title}*/}
                {/*    className="object-cover"*/}
                {/*/>*/}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col">
                {/* Badges */}
                <div className="flex items-center gap-2">
                    {column.isNew && (
                        <span className="rounded bg-red-50 px-2 py-1 text-xs font-bold text-red-600">NEW</span>
                    )}
                    <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                    {column.category}
                  </span>
                </div>

                {/* Title */}
                <h2 className="mt-3 text-xl font-bold text-gray-900 line-clamp-1">{column.title}</h2>

                {/* Excerpt */}
                <p className="mt-2 text-sm leading-relaxed text-gray-600 line-clamp-2">{column.excerpt}</p>

                {/* Author and Meta */}
                <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                        <div className="relative h-8 w-8 overflow-hidden rounded-full">
                            {/*<Image*/}
                            {/*    src={article.author.avatar || "/placeholder.svg"}*/}
                            {/*    alt={article.author.name}*/}
                            {/*    fill*/}
                            {/*    className="object-cover"*/}
                            {/*/>*/}
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-sm font-medium text-gray-900">{column.author.name}</span>
                            {column.author.verified && (
                                <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                        </div>
                        <span className="text-sm text-gray-500">· {column.timeAgo}</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                />
                            </svg>
                            <span>{column.bookmarks}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </svg>
                            <span>{column.comments}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                            <span>{column.views}</span>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}