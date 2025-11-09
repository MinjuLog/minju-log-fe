"use client"
import MainVotes from "./components/MainVotes.tsx";
import Sidebar from "./components/Sidebar.tsx";
import DiscussionHeader from "../../components/DiscussionHeader.tsx";
import Comments from "./components/Comments.tsx";
import type CommentType from "./types/CommentType.ts";
import type SidebarDiscussionType from "./types/SidebarDiscussionType.ts";
import type DiscussionType from "./types/DiscussionType.ts";

const sideBarDiscussionsMock: SidebarDiscussionType[] = [
    {
        endLeft: 2,
        mainTitle: "청년 창업 지원금",
        subTitle: "절반 삭감, 타당한가?",
        best: "찬성 66%",
        content:
            "예산 절감 명목으로 청년 지원이 줄어드는 건 이해하기 어렵네요. 실효성보다 생존이 먼저 아닐까요?",
        votes: 731,
        id: "local-budget-01",
    },
    {
        endLeft: 3,
        mainTitle: "지방의회",
        subTitle: "특혜 논란 해소될까?",
        best: "반대 71%",
        content:
            "의회 회의록 공개 확대는 환영하지만, 실제 실행력이 있을지가 문제. 공개만으로는 신뢰 못 얻습니다.",
        votes: 418,
        id: "local-council-02",
    },
];
const discussionMock: DiscussionType = {
    sequence: 1,
    title: "우리 지역에도 청년 스마트팜을 도입해보는 건 어떨까요?",
    topic: {
        sequence: 1,
        title: "(전남 곡성군) 청년 농부들이 이끄는 지역 스마트팜 협동조합",
    },
    content:
        "저희 지역은 고령화가 빠르게 진행되고 있어 농업 인력 부족이 심각합니다. 지역 청년들이 주도하는 스마트팜을 도입하면, 기술 기반의 효율적인 농업 운영이 가능하고 청년 일자리 창출에도 도움이 될 것 같습니다. 여러분의 생각은 어떠신가요?",
    createdAt: "2025-11-09T10:00:00.000Z",
    expiredAt: "2025-12-31T00:00:00.000Z",
    hashTags: ["청년", "스마트팜", "농업혁신"],
    pros: 742,
    cons: 389,
};
const commentMock: CommentType[] = [
    {
        id: "1",
        author: "곡성청년농부",
        timestamp: "25.11.01",
        badge: {
            text: "스마트팜 도입 찬성",
            type: "blue",
        },
        content: `인력난이 심한 상황에서 스마트팜은 생산성과 품질을 동시에 끌어올릴 수 있습니다.
물·양분·온습도 자동 제어 덕분에 초보 청년도 짧은 기간에 운영을 배울 수 있고,
야간 근무나 과도한 노동을 줄이는 효과도 있어요. 지역에 교육·인큐베이션 센터까지
붙이면 창업 진입장벽도 낮출 수 있습니다.`,
        likes: 78,
        replies: 3,
        opinion: 1, // 찬성
    },
    {
        id: "2",
        parentId: "1",
        author: "재정지킴이",
        timestamp: "25.11.01",
        badge: {
            text: "신중 검토 필요",
            type: "red",
        },
        content: `초기 투자비와 운영비(전기료, 유지보수)가 만만치 않습니다.
시설 지원만 하고 판로·수요 예측이 안 되면 실패 사례가 반복될 수 있어요.
도입 전에 수익성 시뮬레이션과 단계별 지원 로드맵이 먼저라고 봅니다.`,
        likes: 19,
        isReply: true,
        opinion: 2, // 반대/신중
    },
    {
        id: "3",
        parentId: "1",
        author: "농업데이터연구자",
        timestamp: "25.11.01",
        badge: {
            text: "데이터 기반 운영",
            type: "blue",
        },
        content: `스마트팜 핵심은 '데이터'입니다. 센서 데이터 수집→표준화→분석을 통해
품종별 생육 레시피를 만들고, 병해충 조기 경보 모델을 돌리면 손실을 크게 줄일 수 있어요.
군 단위로 공용 데이터 플랫폼을 두고, 농가별 맞춤 대시보드를 제공하면 효과적입니다.`,
        likes: 41,
        replies: 0,
        opinion: 1,
    },
    {
        id: "4",
        author: "마을이장_김",
        timestamp: "25.11.01",
        badge: {
            text: "현장 인력 양성 우선",
            type: "red",
        },
        content: `시설보다 사람이 먼저라고 봅니다. 장비 깔아도 운영할 인력이 없으면 유지가 안 돼요.
고장 나면 외부 업체 부르면 시간·비용이 크게 듭니다. 지역 내 기술자 양성과
A/S 체계가 갖춰지지 않으면, 도입 규모를 확대하는 건 위험합니다.`,
        likes: 33,
        replies: 1,
        opinion: 2,
    },
    {
        id: "5",
        parentId: "4",
        author: "스마트팜운영자",
        timestamp: "25.11.01",
        badge: {
            text: "운영·A/S 체계 제안",
            type: "blue",
        },
        content: `동의합니다. 그래서 제안드립니다.
1) 군청-대학-업체 컨소시엄으로 '현장 기술학교' 운영
2) 군 단위 유지보수 공동센터 설립(예비 부품 상시 비치)
3) 농가 간 장비 표준화로 A/S 시간 단축
이렇게 묶으면 장애 대응이 빨라지고 비용도 낮출 수 있습니다.`,
        likes: 27,
        isReply: true,
        opinion: 1,
    },
    {
        id: "6",
        author: "환경모니터링동아리",
        timestamp: "25.11.01",
        badge: {
            text: "환경·수자원 관리",
            type: "blue",
        },
        content: `수질 센서와 재활용 수배관을 붙이면 물 사용량을 20~30% 절감할 수 있습니다.
태양광+배터리 연계로 전력 피크 비용도 낮출 수 있고요.
도입 시 '물·에너지 절감 KPI'를 명확히 두고, 월별 리포트를 공개하면 주민 수용성도 올라갑니다.`,
        likes: 22,
        replies: 0,
        opinion: 1,
    },
];

export default function DiscussionPage() {

    return (
        <div className="">
            <div className="px-16 py-8">
                <DiscussionHeader/>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <MainVotes discussion={discussionMock} />
                    <Sidebar sidebarDiscussions={sideBarDiscussionsMock} />
                </div>
                <div className="flex">
                    <Comments comments={commentMock} />
                </div>
            </div>
        </div>
    )
}
