"use client"
import MainVotes from "./components/MainVotes.tsx";
import Sidebar from "./components/Sidebar.tsx";
import DiscussionHeader from "../../components/DiscussionHeader.tsx";
import Comments from "./components/Comments.tsx";
import type CommentType from "./types/CommentType.ts";
import type VotingOptionType from "./types/VotingOptionType.ts";
import type SidebarDiscussionType from "./types/SidebarDiscussionType.ts";

const sideBarDiscussionsMock: SidebarDiscussionType[] = [
    {
        endLeft: 2,
        mainTitle: "청년 창업 지원금",
        subTitle: "절반 삭감, 타당한가?",
        best: "청년 외면하는 정책",
        content:
            "예산 절감 명목으로 청년 지원이 줄어드는 건 이해하기 어렵네요. 실효성보다 생존이 먼저 아닐까요?",
        votes: 731,
        id: "local-budget-01",
    },
    {
        endLeft: 3,
        mainTitle: "지방의회",
        subTitle: "특혜 논란 해소될까?",
        best: "투명한 의사결정 절실",
        content:
            "의회 회의록 공개 확대는 환영하지만, 실제 실행력이 있을지가 문제. 공개만으로는 신뢰 못 얻습니다.",
        votes: 418,
        id: "local-council-02",
    },
];
const votingOptionsMock: VotingOptionType[] = [
    {
        id: 1,
        text: "예산 삭감은 청년 외면이다",
        badge: "선택",
        color: "bg-blue-100 hover:bg-blue-200",
        iconColor: "text-red-600",
        gemImage: "/gem-red.jpg",
    },
    {
        id: 2,
        text: "중복 사업 줄이기 필요",
        badge: "선택",
        color: "bg-red-100 hover:bg-red-200",
        iconColor: "text-orange-600",
        gemImage: "/gem-blue.jpg",
    },
    // {
    //     id: 3,
    //     text: "청년 예산보다 재정 안정이 우선",
    //     badge: "선택",
    //     color: "bg-yellow-100 hover:bg-yellow-200",
    //     iconColor: "text-yellow-600",
    //     gemImage: "/gem-gray.jpg",
    // },
    // {
    //     id: 4,
    //     text: "효과 검증 후 단계적 조정",
    //     badge: "선택",
    //     color: "bg-green-100 hover:bg-green-200",
    //     iconColor: "text-green-600",
    //     gemImage: "/gem-green.jpg",
    // },
];
const commentMock: CommentType[] = [
    {
        id: "1",
        author: "푸른바람77",
        timestamp: "25.10.25",
        badge: {
            text: "지자체 예산 삭감 반대",
            type: "red",
        },
        content: `올해 청년 창업 지원금이 절반으로 줄었다네요.
지역 경제를 살리겠다고 하면서 정작 청년들이 떠나는 이유를 모르는 것 같습니다.
예산이 부족하다고 하지만 행사나 홍보 예산은 그대로더라구요.
정작 청년들이 자립할 수 있는 기회는 줄어드는 게 문제 아닌가요?`,
        likes: 61,
        replies: 2,
        opinion: 1,
    },
    {
        id: "2",
        parentId: "1",
        author: "정책읽는시민",
        timestamp: "25.10.25",
        badge: {
            text: "재정 효율화 필요",
            type: "blue",
        },
        content: `@푸른바람77 전체 재정 상황 보면 불가피한 부분도 있습니다.
사업 성과가 불분명한 지원금도 많았고요.
무조건 '삭감 = 나쁜 정책'으로 보기보단, 실효성 검토가 먼저라고 봅니다.`,
        likes: 11,
        isReply: true,
        mentionedUser: "푸른바람77",
        opinion: 2,
    },
    {
        id: "3",
        author: "비둘기정책연구소",
        timestamp: "25.10.25",
        badge: {
            text: "예산 재분배 찬성",
            type: "blue",
        },
        content: `그동안 유사한 청년정책 사업이 너무 많았어요.
청년센터, 스타트업 지원센터, 일자리 박람회 등 이름만 다르고 내용은 거의 동일했죠.
이런 중복된 예산을 줄이고, 주거·교통처럼 실질적인 분야로 돌리는 게 더 낫다고 봅니다.`,
        likes: 23,
        replies: 0,
        opinion: 1,
    },
    {
        id: "4",
        author: "청년창업가99",
        timestamp: "25.10.26",
        badge: {
            text: "현장 목소리 무시",
            type: "red",
        },
        content: `창업 지원 받던 입장에서 말하자면, 절반 삭감은 타격이 커요.
행정절차도 까다로운데, 지원금까지 줄면 지방에서 사업 유지하기 어렵습니다.
지자체가 청년 떠난다고 걱정하면서 이렇게 줄이는 건 모순이죠.`,
        likes: 47,
        replies: 1,
        opinion: 2,
    },
    {
        id: "5",
        parentId: "4",
        author: "공무원a1",
        timestamp: "25.10.26",
        badge: {
            text: "균형 잡힌 판단 필요",
            type: "blue",
        },
        content: `@청년창업가99 현장에서 어려움 많은 건 이해하지만,
정책은 지속 가능해야 합니다. 단기 지원보다 시스템 개선이 중요하다고 봅니다.`,
        likes: 8,
        isReply: true,
        mentionedUser: "청년창업가99",
        opinion: 1,
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
