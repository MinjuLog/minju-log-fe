"use client"
import MainVotes from "./components/MainVotes.tsx";
import Sidebar from "./components/Sidebar.tsx";
import DiscussionHeader from "../../components/DiscussionHeader.tsx";
import Comments from "./components/Comments.tsx";
import type DiscussionType from "./types/DiscussionType.ts";
import {useEffect, useState} from "react";
import {findProposalDetail} from "../../api/proposal/proposal.ts";
import discussionDetailConverter from "./converter/discussionDetailConverter.ts";
import {useParams} from "react-router-dom";

// const sideBarDiscussionsMock: SidebarDiscussionType[] = [
//     {
//         endLeft: 2,
//         mainTitle: "청년 창업 지원금",
//         subTitle: "절반 삭감, 타당한가?",
//         best: "찬성 66%",
//         content:
//             "예산 절감 명목으로 청년 지원이 줄어드는 건 이해하기 어렵네요. 실효성보다 생존이 먼저 아닐까요?",
//         votes: 731,
//         id: "local-budget-01",
//     },
//     {
//         endLeft: 3,
//         mainTitle: "지방의회",
//         subTitle: "특혜 논란 해소될까?",
//         best: "반대 71%",
//         content:
//             "의회 회의록 공개 확대는 환영하지만, 실제 실행력이 있을지가 문제. 공개만으로는 신뢰 못 얻습니다.",
//         votes: 418,
//         id: "local-council-02",
//     },
// ];
// const discussionMock: DiscussionType = {
//     sequence: 1,
//     title: "우리 지역에도 청년 스마트팜을 도입해보는 건 어떨까요?",
//     topic: {
//         sequence: 1,
//         title: "(전남 곡성군) 청년 농부들이 이끄는 지역 스마트팜 협동조합",
//     },
//     content:
//         "저희 지역은 고령화가 빠르게 진행되고 있어 농업 인력 부족이 심각합니다. 지역 청년들이 주도하는 스마트팜을 도입하면, 기술 기반의 효율적인 농업 운영이 가능하고 청년 일자리 창출에도 도움이 될 것 같습니다. 여러분의 생각은 어떠신가요?",
//     createdAt: "2025-11-09T10:00:00.000Z",
//     expiredAt: "2025-12-31T00:00:00.000Z",
//     hashTags: ["청년", "스마트팜", "농업혁신"],
//     pros: 742,
//     cons: 389,
// };
// const commentMock: FeedType[] = [
//     {
//         id: "1",
//         authorId: "user-1",
//         authorName: "곡성청년농부",
//         timestamp: "25.11.01",
//         content: `인력난이 심한 상황에서 스마트팜은 생산성과 품질을 동시에 끌어올릴 수 있습니다.
// 물·양분·온습도 자동 제어 덕분에 초보 청년도 짧은 기간에 운영을 배울 수 있고,
// 야간 근무나 과도한 노동을 줄이는 효과도 있어요. 지역에 교육·인큐베이션 센터까지
// 붙이면 창업 진입장벽도 낮출 수 있습니다.`,
//         likes: 78,
//         opinion: 1,
//     },
//     {
//         id: "2",
//         authorId: "user-2",
//         authorName: "재정지킴이",
//         timestamp: "25.11.01",
//         content: `초기 투자비와 운영비(전기료, 유지보수)가 만만치 않습니다.
// 시설 지원만 하고 판로·수요 예측이 안 되면 실패 사례가 반복될 수 있어요.
// 도입 전에 수익성 시뮬레이션과 단계별 지원 로드맵이 먼저라고 봅니다.`,
//         likes: 19,
//         opinion: 2,
//     },
//     {
//         id: "3",
//         authorId: localStorage.getItem("userId") ?? "user-3",
//         authorName: "농업데이터연구자",
//         timestamp: "25.11.01",
//         content: `스마트팜 핵심은 '데이터'입니다. 센서 데이터 수집→표준화→분석을 통해
// 품종별 생육 레시피를 만들고, 병해충 조기 경보 모델을 돌리면 손실을 크게 줄일 수 있어요.
// 군 단위로 공용 데이터 플랫폼을 두고, 농가별 맞춤 대시보드를 제공하면 효과적입니다.`,
//         likes: 41,
//         opinion: 1,
//     },
//     {
//         id: "4",
//         authorId: "user-4",
//         authorName: "마을이장_김",
//         timestamp: "25.11.01",
//         content: `시설보다 사람이 먼저라고 봅니다. 장비 깔아도 운영할 인력이 없으면 유지가 안 돼요.
// 고장 나면 외부 업체 부르면 시간·비용이 크게 듭니다. 지역 내 기술자 양성과
// A/S 체계가 갖춰지지 않으면, 도입 규모를 확대하는 건 위험합니다.`,
//         likes: 33,
//         opinion: 2,
//     },
//     {
//         id: "5",
//         authorId: "user-5",
//         authorName: "스마트팜운영자",
//         timestamp: "25.11.01",
//         content: `동의합니다. 그래서 제안드립니다.
// 1) 군청-대학-업체 컨소시엄으로 '현장 기술학교' 운영
// 2) 군 단위 유지보수 공동센터 설립(예비 부품 상시 비치)
// 3) 농가 간 장비 표준화로 A/S 시간 단축
// 이렇게 묶으면 장애 대응이 빨라지고 비용도 낮출 수 있습니다.`,
//         likes: 27,
//         opinion: 1,
//     },
//     {
//         id: "6",
//         authorId: "user-6",
//         authorName: "환경모니터링동아리",
//         timestamp: "25.11.01",
//         content: `수질 센서와 재활용 수배관을 붙이면 물 사용량을 20~30% 절감할 수 있습니다.
// 태양광+배터리 연계로 전력 피크 비용도 낮출 수 있고요.
// 도입 시 '물·에너지 절감 KPI'를 명확히 두고, 월별 리포트를 공개하면 주민 수용성도 올라갑니다.`,
//         likes: 22,
//         opinion: 1,
//     },
// ];

export function MainVotesSkeleton() {
    return (
        <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-8 shadow-sm animate-pulse">
                {/* Header */}
                <div className="mb-8 flex items-start justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                        <span className="h-5 w-40 bg-gray-200 rounded" />
                    </div>
                    <div className="h-9 w-9 rounded-lg bg-gray-200" />
                </div>

                {/* Title */}
                <div className="mb-6 text-center">
                    <div className="mx-auto h-6 w-64 bg-gray-200 rounded mb-2" />
                    <div className="mx-auto h-6 w-40 bg-gray-200 rounded" />
                </div>

                {/* 주요 내용 박스 */}
                <div className="mb-6 rounded-2xl bg-gray-50 p-8 shadow-inner">
                    <div className="mx-auto max-w-3xl">
                        <div className="mx-auto max-w-2xl space-y-3">
                            <div className="h-3 w-full bg-gray-200 rounded" />
                            <div className="h-3 w-5/6 bg-gray-200 rounded" />
                            <div className="h-3 w-4/6 bg-gray-200 rounded" />
                        </div>

                        {/* 하단 라벨 */}
                        <div className="mt-6 flex justify-center">
                            <div className="h-7 w-44 rounded-full bg-gray-200" />
                        </div>
                    </div>
                </div>

                {/* Voting Options Grid */}
                <div className="mb-8 grid grid-cols-2 gap-4">
                    {[0, 1].map(i => (
                        <div
                            key={i}
                            className="relative flex min-h-[120px] flex-col items-center justify-center gap-3 rounded-2xl p-6 bg-gray-100"
                        >
                            <div className="h-12 w-12 rounded-full bg-gray-200" />
                            <div className="h-5 w-28 bg-gray-200 rounded" />
                        </div>
                    ))}
                </div>

                {/* 투표 결과 */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
                        <span className="h-3 w-16 bg-gray-200 rounded" />
                        <span className="h-3 w-16 bg-gray-200 rounded" />
                    </div>

                    <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                        <div className="absolute left-0 top-0 h-full w-1/2 bg-gray-200" />
                        <div className="absolute right-0 top-0 h-full w-1/2 bg-gray-300" />
                    </div>

                    <div className="flex justify-between mt-3 font-bold text-gray-900">
                        <span className="h-4 w-10 bg-gray-200 rounded" />
                        <span className="h-4 w-10 bg-gray-200 rounded" />
                    </div>
                </div>

                <hr />

                {/* 투표 수 */}
                <div className="my-6 flex items-center justify-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-gray-200" />
                    <span className="h-4 w-32 bg-gray-200 rounded" />
                </div>

                {/* 남은 시간 표시 */}
                <div className="text-center">
                    <p className="mb-2 text-sm text-gray-600 h-4 w-24 bg-gray-200 rounded mx-auto" />
                    <p className="mx-auto h-8 w-40 bg-gray-200 rounded" />
                </div>
            </div>
        </div>
    );
}

export default function DiscussionPage() {
    const { discussionSequence } = useParams<{ discussionSequence: string }>();
    const userId = localStorage.getItem("userId");

    const [discussionDetail, setDiscussionDetail] = useState<DiscussionType | null>(null);
    const [loading, setLoading] = useState(true);
    const [myVote, setMyVote] = useState<"AGREE" | "DISAGREE" | null>(null);

    useEffect(() => {
        if (!discussionSequence) return;

        setLoading(true);
        const load = async () => {
            const res = await findProposalDetail(Number(discussionSequence), userId ?? '');

            if (!res.ok) {
                alert(res.message);
                setLoading(false);
                return;
            }

            if (res.result.myVote?.didVote) setMyVote(res.result.myVote.type)

            const converted = discussionDetailConverter(res);
            setDiscussionDetail(converted);
            setLoading(false);
        };

        load();
    }, [discussionSequence, userId]);

    return (
        <div>
            <div className="px-16 py-8">
                <DiscussionHeader />
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {loading || !discussionDetail ? (
                        <MainVotesSkeleton />
                    ) : (
                        <MainVotes discussion={discussionDetail} myVote={myVote} />
                    )}
                    <Sidebar/>
                </div>
                <div className="flex">
                    <Comments />
                </div>
            </div>
        </div>
    );
}
