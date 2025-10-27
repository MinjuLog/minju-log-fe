import {DiscussionCards} from "./components/DiscussionCards.tsx";
import {DiscussionPreviewList} from "./components/DiscussionPreviewList.tsx";
import DiscussionHeader from "../../components/DiscussionHeader.tsx";
import type DiscussionPreviewType from "./types/DiscussionPreviewType.ts";
import type DiscussionCardType from "./types/DiscussionCardType.ts";

const discussionCardsMock: DiscussionCardType[] = [
    {
        votesCount: 615,
        title: "1015 부동산 대책, 집값 잡을까?",
        timeLeft: "3일 남았어요",
        bgColor: "bg-gradient-to-br from-blue-700 to-blue-900",
        image: "/apartment-buildings-with-cars-illustration.jpg",
    },
    {
        votesCount: 1015,
        title: "넷플릭스엔 늘게 공개, 영화제 살릴까",
        timeLeft: "1일 7:57:49 남음",
        isCountdown: true,
        bgColor: "bg-gradient-to-br from-gray-900 to-black",
        image: "/clock-timer-illustration.jpg",
    },
    {
        votesCount: 892,
        title: "청년 지원 정책, 실효성 있을까?",
        timeLeft: "2일 3:20:10 남음",
        bgColor: "bg-gradient-to-br from-green-700 to-green-900",
        image: "/youth-support-illustration.jpg",
    },
    {
        votesCount: 1204,
        title: "AI 규제 강화, 혁신 막을까?",
        timeLeft: "5일 남았어요",
        bgColor: "bg-gradient-to-br from-purple-700 to-purple-900",
        image: "/ai-regulation-illustration.jpg",
    },
];
const categoriesMock: string[] = [
    "전체",
    "사회",
    "맛이슈",
    "정책",
    "윤리",
    "법",
    "fun",
    "문화",
    "정치",
    "경제",
    "연애결혼",
    "기술",
    "젠더",
    "과학",
]
const discussionPreviewsMock: DiscussionPreviewType[] = [
    {
        id: 1,
        tags: ["#사회", "#맛이슈"],
        title: "펜션 퇴실 청소비 등장 당신의 생각은",
        round: 111,
        result: "펜션 측 갑질이야",
        percentage: 71.7,
        votes: 1613,
        discussions: 227,
    },
    {
        id: 2,
        tags: ["#사회", "#정치"],
        title: "변화하는 남북 관계 통일, 필요한가?",
        round: 110,
        result: "현상유지가 최선이야",
        percentage: 63.2,
        votes: 1502,
        discussions: 318,
    },
]

export default function DiscussionsPage() {
    return (
        <>
            <DiscussionHeader/>
            <DiscussionCards discussionCards={discussionCardsMock} />
            <DiscussionPreviewList categories={categoriesMock} discussionPreviews={discussionPreviewsMock} />
        </>
    )
}
