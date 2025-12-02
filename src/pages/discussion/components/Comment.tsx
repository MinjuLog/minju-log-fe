import type CommentType from "../types/CommentType.ts";

interface props {
    comment: CommentType;
}

export default function Comment({ comment }: props) {
    const myUuid = localStorage.getItem("userId");

    const bgMap: Record<number, string> = {
        1: "mr-12 bg-blue-100",
        2: "ml-12 bg-red-100",
    };

    const isMine = myUuid === comment.authorId;

    return (
        <div
            key={comment.id}
            className={`rounded-lg border p-4 ${bgMap[comment.opinion]} ${
                isMine ? "border-gray-600" : "border-gray-200"
            }`}
        >
            {/* Comment Header */}
            <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div>
                        <div className="font-medium text-gray-900 flex items-center gap-2">
                            {comment.authorName}
                            {isMine && (
                                <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                                    내 댓글
                                </span>
                            )}
                        </div>
                        <div className="text-xs text-gray-500">
                            {comment.timestamp}
                        </div>
                    </div>
                </div>
            </div>

            {/* Opinion Badge */}
            <div className="mb-3 flex items-center gap-2">
                <div
                    className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium ${
                        comment.opinion === 2
                            ? "bg-red-50 text-red-600"
                            : "bg-blue-50 text-blue-600"
                    }`}
                >
                    ✓{" "}
                    {comment.opinion === 1
                        ? "찬성합니다."
                        : "반대합니다."}
                </div>
            </div>

            {/* Content */}
            <div className="mb-4 whitespace-pre-line text-[12px] leading-relaxed text-gray-800">
                {comment.content}
            </div>

            {/* Actions */}
            {/*<div className="flex items-center gap-4">*/}
            {/*    <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">*/}
            {/*        <ThumbsUp className="h-4 w-4" />*/}
            {/*        {comment.likes > 0 && (*/}
            {/*            <span className="text-sm">{comment.likes}</span>*/}
            {/*        )}*/}
            {/*    </button>*/}
            {/*</div>*/}
        </div>
    );
}