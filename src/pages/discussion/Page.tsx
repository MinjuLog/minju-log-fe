"use client"
import MainVotes from "./components/MainVotes.tsx";
import Sidebar from "./components/Sidebar.tsx";
import DiscussionHeader from "../../components/DiscussionHeader.tsx";
import Comments from "./components/Comments.tsx";
import type CommentType from "./types/CommentType.ts";
import type VotingOptionType from "./types/VotingOptionType.ts";
import type SidebarDiscussionType from "./types/SidebarDiscussionType.ts";

const commentMock: CommentType[] = [
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
const votingOptionsMock: VotingOptionType[] = [
    {
        id: 1,
        text: "상생 위해 필요해",
        badge: "선택",
        color: "bg-blue-100 hover:bg-blue-200",
        iconColor: "text-blue-600",
        gemImage: "/gem-blue.jpg",
    },
    {
        id: 2,
        text: "6개월은 너무 길어",
        badge: "선택",
        color: "bg-red-100 hover:bg-red-200",
        iconColor: "text-red-600",
        gemImage: "/gem-red.jpg",
    },
    {
        id: 3,
        text: "한류 확산에 방해돼",
        badge: "선택",
        color: "bg-purple-100 hover:bg-purple-200",
        iconColor: "text-purple-600",
        gemImage: "/gem-purple.jpg",
    },
    {
        id: 4,
        text: "소비자만 불편해져",
        badge: "선택",
        color: "bg-green-100 hover:bg-green-200",
        iconColor: "text-green-600",
        gemImage: "/gem-green.jpg",
    },
]
const sideBarDiscussionsMock: SidebarDiscussionType[] = [
    {
        endLeft: 4,
        mainTitle: "하루 100개 인형뽑기",
        subTitle: "영업 방해일까",
        best: "정당한 개인 자유",
        content: "당연히 정당한 자유죠. 과하면 민폐라고 하시는 분들은 어떤 마인드인가? 정당한 돈을 ...",
        votes: 494,
        id: "claw-01",
    },
    {
        endLeft: 4,
        mainTitle: "하루 100개 인형뽑기",
        subTitle: "영업 방해일까",
        best: "정당한 개인 자유",
        content: "당연히 정당한 자유죠. 과하면 민폐라고 하시는 분들은 어떤 마인드인가? 정당한 돈을 ...",
        votes: 494,
        id: "claw-02",
    },
];

export default function DiscussionPage() {

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="px-16 py-8">
                <DiscussionHeader/>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <MainVotes votingOptions={votingOptionsMock} />
                    <Sidebar sidebarDiscussions={sideBarDiscussionsMock} />
                </div>
                <div className="flex">
                    <Comments comments={commentMock} />
                </div>
            </div>
        </div>
    )
}
