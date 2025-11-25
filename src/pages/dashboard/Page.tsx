"use client";

import {useEffect, useState} from "react";
import DashboardHeader from "../../components/DashboardHeader.tsx";
import KanbanBoard from "./components/KanbanBoard.tsx";
import type KanbanType from "./types/KanbanType.ts";
import KanbanBoardSkeleton from "./components/KanbanBoardSkeleton.tsx";
import LocationControl from "./components/LocationControl.tsx";
import {findProposalList} from "../../api/proposal/proposal.ts";
import kanbanConverter from "./converter/kanbanConverter.ts";
import type FindProposalListResponse from "../../api/proposal/type/FindProposalListResponse.ts";

// const kanbans: KanbanType[] = [
//     {
//         title: "의견 취합중",
//         color: "purple",
//         projects: [
//             {
//                 sequence: 1,
//                 hashTags: ["교통", "시민생활"],
//                 createdAt: "2025-11-03",
//                 expiredAt: "2025-12-03",
//                 title: "시내버스 야간노선 확대 필요할까?",
//                 description:
//                     "야근 끝나고 집 갈 때 버스가 끊겨서 늘 택시를 타야 합니다. 심야에도 안전하게 귀가할 수 있는 노선이 있으면 좋겠어요. 택시비 부담도 크고, 교통 약자분들도 불편하실 것 같아요.",
//                 comments: 128,
//                 votes: 540,
//                 topic: { sequence: 12, title: "지역 교통 개선 및 시민 이동권 보장" },
//             },
//             {
//                 sequence: 2,
//                 hashTags: ["환경", "보건"],
//                 createdAt: "2025-11-02",
//                 expiredAt: "2025-12-02",
//                 title: "공원 내 흡연구역 설치, 찬성하시나요?",
//                 description:
//                     "아이랑 산책할 때마다 담배 냄새가 너무 심해요. 금연구역은 많은데 흡연구역은 거의 없어서 흡연자들이 아무 데서나 피우는 게 더 문제인 것 같습니다. 구분만 잘 되어도 서로 편할 것 같아요.",
//                 comments: 96,
//                 votes: 430,
//             },
//             {
//                 sequence: 3,
//                 hashTags: ["주거", "청년"],
//                 createdAt: "2025-11-01",
//                 expiredAt: "2025-12-01",
//                 title: "공공임대주택, 지역 청년 우선 공급 필요성",
//                 description:
//                     "지방에서 일자리를 찾아도 주거비 때문에 결국 수도권으로 떠나는 경우가 많아요. 지역 청년이 정착할 수 있도록 임대주택을 조금 더 쉽게 신청할 수 있으면 좋겠어요.",
//                 comments: 188,
//                 votes: 920,
//                 topic: { sequence: 7, title: "청년 주거 안정 및 지방 정착 지원 정책" },
//             },
//         ],
//     },
//     {
//         title: "의견 전달 완료",
//         color: "indigo",
//         projects: [
//             {
//                 sequence: 4,
//                 hashTags: ["청년", "경제"],
//                 createdAt: "2025-11-03",
//                 expiredAt: "2025-12-03",
//                 title: "청년 창업지원센터 신설 논의",
//                 description:
//                     "창업 아이디어는 있어도 사무공간이나 멘토링 받을 곳이 없어서 늘 막막했어요. 이번에 제대로 된 창업 지원센터가 생기면 정말 많은 도움이 될 것 같습니다.",
//                 comments: 214,
//                 votes: 870,
//                 topic: { sequence: 18, title: "지역 청년 창업 생태계 활성화 방안" },
//             },
//             {
//                 sequence: 5,
//                 hashTags: ["문화", "지역활성화"],
//                 createdAt: "2025-11-02",
//                 expiredAt: "2025-12-02",
//                 title: "지역 예술축제, 시민 참여 확대 방안",
//                 description:
//                     "매번 비슷한 공연만 반복돼서 흥미가 떨어졌어요. 시민이 직접 참여하거나, 동네 예술가들이 무대에 설 수 있는 기회가 많아졌으면 좋겠어요.",
//                 comments: 73,
//                 votes: 315,
//             },
//         ],
//     },
//     {
//         title: "보도중",
//         color: "orange",
//         projects: [
//             {
//                 sequence: 4, // 동일 프로젝트가 다른 단계에 존재
//                 hashTags: ["청년", "경제"],
//                 createdAt: "2025-11-03",
//                 expiredAt: "2025-12-03",
//                 title: "청년 창업지원센터 신설 논의",
//                 description:
//                     "창업 아이디어는 있어도 사무공간이나 멘토링 받을 곳이 없어서 늘 막막했어요. 이번에 제대로 된 창업 지원센터가 생기면 정말 많은 도움이 될 것 같습니다.",
//                 comments: 214,
//                 votes: 870,
//                 topic: { sequence: 18, title: "지역 청년 창업 생태계 활성화 방안" },
//             },
//             {
//                 sequence: 5, // 동일 프로젝트가 다른 단계에 존재
//                 hashTags: ["문화", "지역활성화"],
//                 createdAt: "2025-11-02",
//                 expiredAt: "2025-12-02",
//                 title: "지역 예술축제, 시민 참여 확대 방안",
//                 description:
//                     "매번 비슷한 공연만 반복돼서 흥미가 떨어졌어요. 시민이 직접 참여하거나, 동네 예술가들이 무대에 설 수 있는 기회가 많아졌으면 좋겠어요.",
//                 comments: 73,
//                 votes: 315,
//             },
//         ],
//     },
//     {
//         title: "반영 완료",
//         color: "green",
//         projects: [
//             {
//                 sequence: 6,
//                 hashTags: ["복지", "노년층"],
//                 createdAt: "2025-10-30",
//                 expiredAt: "2025-11-29",
//                 title: "노인복지관 무료 급식사업 확대",
//                 description:
//                     "할머니가 복지관에서 식사하신다고 좋아하셨어요. 예산이 늘어난 덕분에 더 많은 어르신이 혜택을 받을 수 있다고 들었습니다. 이런 정책은 꾸준히 이어졌으면 합니다.",
//                 comments: 321,
//                 votes: 1420,
//             },
//             {
//                 sequence: 7,
//                 hashTags: ["안전", "교통"],
//                 createdAt: "2025-10-28",
//                 expiredAt: "2025-11-27",
//                 title: "횡단보도 앞 보행신호 대기시간 단축",
//                 description:
//                     "아이들 등하굣길 신호 대기시간이 너무 길었는데, 조정되고 나서 훨씬 편해졌어요. 다만 차들도 급하게 움직이는 구간이 있어 추가 점검이 필요할 것 같아요.",
//                 comments: 210,
//                 votes: 1190,
//                 topic: { sequence: 23, title: "보행자 중심의 안전 교통 환경 구축" },
//             },
//         ],
//     },
// ];\


const PAGE_SIZE = 2;

export default function DashboardPage() {
    const [location, setLocation] = useState("");
    const [isLocLoading, setIsLocLoading] = useState(false);

    const [sortOrder, setSortOrder] = useState<"최신순" | "인기순">("최신순");

    const [kanbans, setKanbans] = useState<KanbanType[] | null>(null);
    const [kanbanLoading, setKanbanLoading] = useState(true);
    const [kanbanError, setKanbanError] = useState<string | null>(null);

    const [loadingColumn, setLoadingColumn] = useState<string | null>(null); // 특정 컬럼 loadMore 로딩용

    const handleRefreshLocation: () => Promise<(() => void) | undefined> = async () => {
        if (!navigator.geolocation) {
            alert("이 브라우저에서는 위치 정보 사용이 불가능합니다.");
            return;
        }
        setIsLocLoading(true);

        const abort = new AbortController();
        try {
            const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: false,
                    maximumAge: 60_000,
                    timeout: 10_000,
                })
            );

            const { latitude, longitude } = pos.coords;

            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2`,
                {
                    signal: abort.signal,
                    headers: {
                        "User-Agent": "HeatPick-Dashboard/1.0 (contact: example@example.com)",
                        "Accept-Language": "ko",
                        "Referer":
                            typeof window !== "undefined"
                                ? window.location.origin
                                : "https://example.com",
                    },
                }
            );

            if (!res.ok) throw new Error(`Reverse geocoding failed: ${res.status}`);
            const data = await res.json();

            const a = data.address ?? {};
            const regionName =
                [a.state, a.city, a.town, a.county, a.suburb, a.village]
                    .filter(Boolean)
                    .slice(0, 2)
                    .join(" ") ||
                data.display_name ||
                `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`;

            setLocation(regionName);
        } catch (e: unknown) {
            console.error(e);
            setLocation("위치 정보를 불러오지 못했습니다.");
        } finally {
            setIsLocLoading(false);
        }

        return () => abort.abort();
    };

    // 마운트 시 1회 위치 갱신
    useEffect(() => {
        handleRefreshLocation();
    }, []);

    // Kanban 데이터 최초 로드 & 정렬 변경 시 재로드
    useEffect(() => {
        const loadKanbans = async () => {
            try {
                setKanbanLoading(true);
                setKanbanError(null);

                const columnsConfig: {
                    title: string;
                    color: KanbanType["color"];
                    status: string;
                }[] = [
                    { title: "의견 취합중",   color: "purple", status: "COLLECTING" },
                    { title: "의견 전달 완료", color: "indigo", status: "DELIVERED" },
                    { title: "보도중",       color: "orange", status: "REPORTING" },
                    { title: "반영 완료",    color: "green",  status: "COMPLETED" },
                ];

                const responses = await Promise.all(
                    columnsConfig.map((col) =>
                        findProposalList({
                            keyword: "",
                            status: col.status,
                            sort: sortOrder === "최신순" ? "latest" : "popular",
                            page: 0,
                            size: PAGE_SIZE,
                        })
                    )
                );

                const anyError = responses.find((r) => !r.ok);
                if (anyError && !anyError.ok) {
                    setKanbanError(anyError.message);
                    alert(anyError.message);
                    setKanbans(null);
                    return;
                }

                const mapped: KanbanType[] = responses.map((res, idx) => {
                    const col = columnsConfig[idx];
                    const okRes = res as FindProposalListResponse;
                    const projects = kanbanConverter(okRes); // KanbanType["projects"][]
                    return {
                        title: col.title,
                        color: col.color,
                        total: okRes.totalElements,
                        projects,
                    };
                });

                setKanbans(mapped);
            } catch (err) {
                console.error(err);
                setKanbanError("대시보드 데이터를 불러오지 못했습니다.");
                setKanbans(null);
            } finally {
                setKanbanLoading(false);
            }
        };

        loadKanbans();
    }, [sortOrder]);

    // ✅ 특정 컬럼만 Load More
    const handleColumnLoadMore = async (columnTitle: string) => {
        if (!kanbans) return;

        const target = kanbans.find((k) => k.title === columnTitle);
        if (!target) return;

        // 이미 다 불러왔으면 종료
        if (target.projects.length >= target.total) return;

        // 다음 page 계산 (0-based)
        const nextPage = Math.floor(target.projects.length / PAGE_SIZE);

        // title → status 매핑 (위 columnsConfig와 동일하게 관리)
        const statusByTitle: Record<string, string> = {
            "의견 취합중": "COLLECTING",
            "의견 전달 완료": "DELIVERED",
            "보도중": "REPORTING",
            "반영 완료": "COMPLETED",
        };

        const status = statusByTitle[columnTitle];
        if (!status) return;

        try {
            setLoadingColumn(columnTitle);

            const res = await findProposalList({
                keyword: "",
                status,
                sort: sortOrder === "최신순" ? "latest" : "popular",
                page: nextPage,
                size: PAGE_SIZE,
            });

            if (!res.ok) {
                alert(res.message);
                return;
            }

            const okRes = res as FindProposalListResponse;
            const moreProjects = kanbanConverter(okRes);

            setKanbans((prev) => {
                if (!prev) return prev;
                return prev.map((col) =>
                    col.title === columnTitle
                        ? {
                            ...col,
                            projects: [...col.projects, ...moreProjects],
                            total: okRes.totalElements, // 혹시 total이 변할 수 있다면 갱신
                        }
                        : col
                );
            });
        } catch (err) {
            console.error(err);
            alert("추가 항목을 불러오지 못했습니다.");
        } finally {
            setLoadingColumn(null);
        }
    };

    const isBoardLoading = kanbanLoading || isLocLoading;

    return (
        <div>
            <DashboardHeader />
            <LocationControl
                location={location}
                isLocLoading={isLocLoading}
                handleRefreshLocation={handleRefreshLocation}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
            />

            {isBoardLoading || !kanbans ? (
                <KanbanBoardSkeleton />
            ) : (
                <KanbanBoard
                    kanbans={kanbans}
                    onLoadMore={handleColumnLoadMore}
                    loadingColumn={loadingColumn}
                />
            )}

            {kanbanError && (
                <p className="mt-4 text-center text-sm text-red-500">
                    {kanbanError}
                </p>
            )}
        </div>
    );
}