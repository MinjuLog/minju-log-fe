import {DiscussionCards} from "./components/DiscussionCards.tsx";
import {DiscussionPreviewList} from "./components/DiscussionPreviewList.tsx";
import DiscussionHeader from "../../components/DiscussionHeader.tsx";
import type DiscussionPreviewType from "./types/DiscussionPreviewType.ts";
import type DiscussionCardType from "./types/DiscussionCardType.ts";
import type DiscussionCategoryType from "./types/DiscussionCategoryType.ts";

const discussionCardsMock: DiscussionCardType[] = [
    {
        votesCount: 1052,
        title: "우리 시 대중교통, 환승 요금제 도입이 필요할까?",
        timeLeft: "2일 남았어요",
        bgColor: "bg-gradient-to-br from-blue-700 to-blue-900",
        image: "/local-bus-illustration.jpg",
    },
    {
        votesCount: 1289,
        title: "도심 주차난 해결, 공영주차장 확충이 해답일까?",
        timeLeft: "1일 8:14:22 남음",
        isCountdown: true,
        bgColor: "bg-gradient-to-br from-gray-800 to-gray-900",
        image: "/city-parking-illustration.jpg",
    },
    {
        votesCount: 764,
        title: "하천 정비 사업, 환경 파괴 논란 넘을 수 있을까?",
        timeLeft: "3일 10:32:50 남음",
        bgColor: "bg-gradient-to-br from-green-700 to-green-900",
        image: "/river-restoration-illustration.jpg",
    },
    {
        votesCount: 1143,
        title: "청년 임대주택 확대, 지역 정착에 효과 있을까?",
        timeLeft: "5일 남았어요",
        bgColor: "bg-gradient-to-br from-purple-700 to-purple-900",
        image: "/youth-housing-illustration.jpg",
    },
];
const discussionPreviewsMock: DiscussionPreviewType[] = [
    {
        id: 1,
        categories: [
            { id: 4, text: "사회" },
            { id: 6, text: "지역" },
        ],
        title: "대중교통 무료 환승제, 우리 시도 도입해야 할까?",
        sequence: 129,
        result: {
            pros: 69.2,
            cons: 30.8,
        },
        votes: 2184,
        discussions: 401,
    },
    {
        id: 2,
        categories: [
            { id: 14, text: "환경" },
            { id: 5, text: "경제" },
        ],
        title: "하천 정비 사업, 생태계 영향은?",
        sequence: 130,
        result: {
            pros: 74.5,
            cons: 25.5,
        },
        votes: 1856,
        discussions: 277,
    },
    {
        id: 3,
        categories: [
            { id: 7, text: "청년" },
            { id: 13, text: "교육" },
            { id: 6, text: "지역" },
        ],
        title: "청년 임대주택, 지방 소멸 해결책 될까?",
        sequence: 131,
        result: {
            pros: 33.7,
            cons: 66.3,
        },
        votes: 2039,
        discussions: 333,
    },
];
const categoriesMock: DiscussionCategoryType[] = [
    { id: 0, text: "전체"},
    { id: 2, text: "정치" },
    { id: 3, text: "정책" },
    { id: 4, text: "사회" },
    { id: 5, text: "경제" },
    { id: 6, text: "지역" },
    { id: 7, text: "청년" },
    { id: 8, text: "복지" },
    { id: 9, text: "행정" },
    { id: 10, text: "윤리" },
    { id: 11, text: "법" },
    { id: 12, text: "문화" },
    { id: 13, text: "교육" },
    { id: 14, text: "환경" },
    { id: 15, text: "과학" },
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
