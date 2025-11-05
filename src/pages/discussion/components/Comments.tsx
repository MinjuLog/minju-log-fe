"use client"

import { useState } from "react"
import { Upload, ChevronUp, ChevronDown } from "lucide-react"
import type CommentType from "../types/CommentType.ts";
import Comment from "./Comment";

interface Props {
    comments: CommentType[];
}

const PAGE_SIZE = 5;

export default function CommentsPage({ comments }: Props) {
    const [hideAbusiveComments, setHideAbusiveComments] = useState(true);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    // const filteredComments = hideAbusiveComments
    //     ? comments.filter((c) => true)
    //     : comments;
    const filteredComments = comments;

    const canLoadMore = visibleCount < filteredComments.length;

    const handleLoadMore = () => {
        setVisibleCount((prev) =>
            Math.min(prev + PAGE_SIZE, filteredComments.length)
        );
    };

    return (
        <div className="flex-1 mt-20">
            {/* Header */}
            <div className="mb-6">
                <h1 className="mb-4 text-2xl font-bold text-gray-900">
                    지지 서명 {filteredComments.length}
                </h1>

                <div className="flex items-center justify-between">
                    <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                        공감순
                        <ChevronUp className="h-4 w-4" />
                        <ChevronDown className="h-4 w-4" />
                    </button>

                    <button className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        내가 쓴 지지 서명
                    </button>
                </div>
            </div>

            {/* Hide abusive comments toggle */}
            <div className="mb-6 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Upload className="h-4" />
                    <span>무차별한 지지 서명 숨기기</span>
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
                {filteredComments.slice(0, visibleCount).map((comment) => (
                    <Comment key={comment.id} comment={comment} />
                ))}

                {/* Empty state */}
                {filteredComments.length === 0 && (
                    <div className="text-center text-gray-500 text-sm py-8 border border-dashed border-gray-200 rounded-lg">
                        아직 등록된 지지 서명이 없습니다.
                    </div>
                )}

                {/* Load more */}
                {canLoadMore && (
                    <div className="flex justify-center mt-6">
                        <button
                            type="button"
                            onClick={handleLoadMore}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition"
                        >
                            더 불러오기{" "}
                            <span className="text-gray-400">
                ({visibleCount}/{filteredComments.length})
              </span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}