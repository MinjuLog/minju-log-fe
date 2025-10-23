"use client"

import { useState } from "react"
import { Upload, ChevronUp, ChevronDown } from "lucide-react"
import type CommentProp from "../types/CommentProp.ts";
import Comment from "./Comment";

const comments: CommentProp[] = [
    {
        id: "1",
        author: "금거린금지어",
        timestamp: "25.10.16",
        badge: {
            text: "펜션 측 갑질이다",
            type: "red",
        },
        content: `펜션속 생각도 이해 되지만
쓰레기 청소값 받는거는
좀 아니라고 생각합니다.
펜션 숙박비가 반값도 아니고
손님이 매일 많은것도 아닌데
없어서 편하게 돈만 받겠다는거네요 :
사업할때 손님이 나가면 청소를 해야 되는걸 사전조사 했을텐데 :

쓰레기 심하게 버린 손님은 다음에
예약 거부를 하는게 좋을듯합니다

펜션 청소비가 싸기면 유형 처럼 변해서
펜션,호텔,모텔,여관등등 청소비가
생길까 우려됩니다.

그리고 청소비 음식을 선택한 손님
우선으로 받을 가능성이 큽니다.`,
        likes: 44,
        replies: 1,
    },
    {
        id: "2",
        parentId: "1",
        author: "이하2pdsx9",
        timestamp: "25.10.16",
        badge: {
            text: "오늘하면 그랬겠나",
            type: "blue",
        },
        content: `@금지된금지어 펜션 아저씨 한번 가고 안 오는 정우가 많아서 페이백 제도가 맞아보이네요....

유튜브에서 이 이슈로 올라온 영상 봤는데 진짜 개판 치고 가는 영상 보니까 펜션 사업 운영하는 것도 대단해보인 해요.. 진짜 진상 만나면.. 생각만 해도 끔찍하네요`,
        likes: 0,
        isReply: true,
        mentionedUser: "금지된금지어",
    },
    {
        id: "3",
        author: "이하r7t9o5",
        timestamp: "25.10.16",
        badge: {
            text: "펜션 측 갑질이다",
            type: "red",
        },
        content: `인테리어, 기물 등의 훼손, 파손 등은 손배청구가 맞지만 청소비를 받는건 좀 그렇지않나..? 모텔, 호텔 등등도 다 청소비 받겠네 ㅋㅋㅋ 사용자가 간단하게 청소하고 나가는건 배려차원인거지 의무가 아님. 사용자가 사전이 청소 안해도 월정도로 깨끗이 청소하면 돈 들어가겠지만?`,
        likes: 9,
        replies: 0,
    },
]

export default function CommentsPage() {
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
                        comments.map((comment: CommentProp) =>
                            <Comment comment={comment}/>)
                    }
                </div>
            </div>
    )
}
