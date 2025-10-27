import {MessageCircle, MoreHorizontal, ThumbsDown, ThumbsUp} from "lucide-react";
import type CommentType from "../types/CommentType.ts";

interface props {
    comment: CommentType;
}

export default function Comment ({ comment } : props) {
    return (
        <div
            key={comment.id}
            className={`rounded-lg border border-gray-200 p-4 ${comment.isReply ? "ml-12 bg-gray-100" : "bg-white"}`}
        >
            {/* Comment Header */}
            <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-300"/>
                    <div>
                        <div className="font-medium text-gray-900">{comment.author}</div>
                        <div className="text-xs text-gray-500">{comment.timestamp}</div>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="h-5 w-5"/>
                </button>
            </div>

            {/* Badge */}
            {comment.badge && (
                <div className="mb-3 flex items-center gap-2">
                    <div
                        className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium ${
                            comment.badge.type === "red" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                        }`}
                    >
                        {comment.badge.type === "red" ? "✓" : "✓"}
                        {comment.badge.text}
                    </div>
                </div>
            )}

            {/* Comment Content */}
            <div className="mb-4 whitespace-pre-line text-[12px] leading-relaxed text-gray-800">
                {comment.mentionedUser && <span className="font-medium text-blue-600">@{comment.mentionedUser} </span>}
                {comment.content}
            </div>

            {/* Comment Actions */}
            <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                    <ThumbsUp className="h-4 w-4"/>
                    {comment.likes > 0 && <span className="text-sm">{comment.likes}</span>}
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                    <ThumbsDown className="h-4 w-4"/>
                </button>
                {comment.replies !== undefined && comment.replies > 0 && (
                    <button className="ml-auto flex items-center gap-1 text-gray-500 hover:text-gray-700">
                        <MessageCircle className="h-4 w-4"/>
                        <span className="text-sm">{comment.replies}</span>
                    </button>
                )}
                {!comment.isReply && comment.replies === 0 && (
                    <button className="ml-auto text-gray-500 hover:text-gray-700">
                        <MessageCircle className="h-4 w-4"/>
                    </button>
                )}
            </div>
        </div>
    )
}