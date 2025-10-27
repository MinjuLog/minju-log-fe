"use client"

import { useState } from "react"
import { Upload, ChevronUp, ChevronDown } from "lucide-react"
import type CommentType from "../types/CommentType.ts";
import Comment from "./Comment";

interface props {
    comments: CommentType[];
}

export default function CommentsPage({ comments }: props) {
    const [hideAbusiveComments, setHideAbusiveComments] = useState(true)
    // const [sortOrder, setSortOrder] = useState<"likes" | "recent">("likes")

    return (
            <div className="mx-auto mt-20">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="mb-4 text-2xl font-bold text-gray-900">전체 댓글 49</h1>

                    <div className="flex items-center justify-between">
                        <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                            공감순
                            <ChevronUp className="h-4 w-4" />
                            <ChevronDown className="h-4 w-4" />
                        </button>

                        <button className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            내가 쓴 댓글
                        </button>
                    </div>
                </div>

                {/* Hide abusive comments toggle */}
                <div className="mb-6 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Upload className="h-4" />
                        <span>무차별한 댓글 숨기기</span>
                    </div>
                    <button
                        onClick={() => setHideAbusiveComments(!hideAbusiveComments)}
                        className={`relative h-6 w-11 rounded-full transition-colors ${
                            hideAbusiveComments ? "bg-blue-600" : "bg-gray-300"
                        }`}
                    >
            <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    hideAbusiveComments ? "translate-x-0.5" : "-translate-x-5"
                }`}
            />
                    </button>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                    {
                        comments.map((comment: CommentType) =>
                            <Comment comment={comment}/>)
                    }
                </div>
            </div>
    )
}
