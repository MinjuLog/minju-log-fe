import {DiscussionCards} from "./components/DiscussionCards.tsx";
import {DiscussionPreviewList} from "./components/DiscussionPreviewList.tsx";
import DiscussionHeader from "../../components/DiscussionHeader.tsx";
import type DiscussionPreviewType from "./types/DiscussionPreviewType.ts";
import type DiscussionCardType from "./types/DiscussionCardType.ts";

const discussionCardsMock: DiscussionCardType[] = [
    {
        votesCount: 842,
        title: "청년 예산 삭감, 재정 건전성 위한 선택일까?",
        timeLeft: "2일 남았어요",
        bgColor: "bg-gradient-to-br from-blue-700 to-blue-900",
        image: "/city-hall-budget-illustration.jpg",
    },
    {
        votesCount: 1267,
        title: "지방선거 공약, 현실성 있는가?",
        timeLeft: "1일 4:32:15 남음",
        isCountdown: true,
        bgColor: "bg-gradient-to-br from-gray-900 to-black",
        image: "/election-poster-illustration.jpg",
    },
    {
        votesCount: 679,
        title: "광역시 이전 논의, 지역 발전 이끌까?",
        timeLeft: "3일 8:50:10 남음",
        bgColor: "bg-gradient-to-br from-green-700 to-green-900",
        image: "/regional-development-illustration.jpg",
    },
    {
        votesCount: 1045,
        title: "의회 회의록 전면 공개, 투명성 높일까?",
        timeLeft: "5일 남았어요",
        bgColor: "bg-gradient-to-br from-purple-700 to-purple-900",
        image: "/public-meeting-illustration.jpg",
    },
];
const categoriesMock: string[] = [
    "전체",
    "정치",
    "정책",
    "사회",
    "경제",
    "지역",
    "청년",
    "복지",
    "행정",
    "윤리",
    "법",
    "문화",
    "교육",
    "환경",
    "과학",
];
const discussionPreviewsMock: DiscussionPreviewType[] = [
    {
        id: 1,
        tags: ["#정책", "#청년"],
        title: "지자체 청년 지원금 삭감, 타당한가?",
        round: 121,
        result: "청년 외면하는 정책이야",
        percentage: 68.4,
        votes: 1897,
        discussions: 312,
    },
    {
        id: 2,
        tags: ["#정치", "#행정"],
        title: "지방의회 회의록 전면 공개, 실효성 있을까?",
        round: 120,
        result: "투명성 확보엔 도움돼",
        percentage: 74.1,
        votes: 1762,
        discussions: 254,
    },
    {
        id: 3,
        tags: ["#정치", "#경제"],
        title: "공공기관 이전, 지역 균형발전 해법일까?",
        round: 119,
        result: "일자리 창출엔 도움돼",
        percentage: 59.8,
        votes: 2023,
        discussions: 341,
    },
];

export default function DiscussionsPage() {
    return (
        <>
            <DiscussionHeader/>
            <DiscussionCards discussionCards={discussionCardsMock} />
            <DiscussionPreviewList categories={categoriesMock} discussionPreviews={discussionPreviewsMock} />
        </>
    )
}
