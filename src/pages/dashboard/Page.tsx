"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "../../components/DashboardHeader.tsx";
import KanbanBoard from "./components/KanbanBoard.tsx";
import type KanbanType from "./types/KanbanType.ts";
import KanbanBoardSkeleton from "./components/KanbanBoardSkeleton.tsx";
import LocationControl from "./components/LocationControl.tsx";

const kanbans: KanbanType[] = [
    {
        title: "의견 취합중",
        color: "purple",
        projects: [
            {
                id: "1",
                categories: ["교통", "시민생활"],
                date: "2025.11.03",
                title: "시내버스 야간노선 확대 필요할까?",
                description:
                    "야근 끝나고 집 갈 때 버스가 끊겨서 늘 택시를 타야 합니다. 심야에도 안전하게 귀가할 수 있는 노선이 있으면 좋겠어요. 택시비 부담도 크고, 교통 약자분들도 불편하실 것 같아요.",
                comments: 128,
                votes: 540,
                topic: { id: 12, title: "지역 교통 개선 및 시민 이동권 보장" },
            },
            {
                id: "2",
                categories: ["환경", "보건"],
                date: "2025.11.02",
                title: "공원 내 흡연구역 설치, 찬성하시나요?",
                description:
                    "아이랑 산책할 때마다 담배 냄새가 너무 심해요. 금연구역은 많은데 흡연구역은 거의 없어서 흡연자들이 아무 데서나 피우는 게 더 문제인 것 같습니다. 구분만 잘 되어도 서로 편할 것 같아요.",
                comments: 96,
                votes: 430,
            },
            {
                id: "3",
                categories: ["주거", "청년"],
                date: "2025.11.01",
                title: "공공임대주택, 지역 청년 우선 공급 필요성",
                description:
                    "지방에서 일자리를 찾아도 주거비 때문에 결국 수도권으로 떠나는 경우가 많아요. 지역 청년이 정착할 수 있도록 임대주택을 조금 더 쉽게 신청할 수 있으면 좋겠어요.",
                comments: 188,
                votes: 920,
                topic: { id: 7, title: "청년 주거 안정 및 지방 정착 지원 정책" },
            },
        ],
    },
    {
        title: "보도중",
        color: "orange",
        projects: [
            {
                id: "4",
                categories: ["청년", "경제"],
                date: "2025.11.03",
                title: "청년 창업지원센터 신설 논의",
                description:
                    "창업 아이디어는 있어도 사무공간이나 멘토링 받을 곳이 없어서 늘 막막했어요. 이번에 제대로 된 창업 지원센터가 생기면 정말 많은 도움이 될 것 같습니다.",
                comments: 214,
                votes: 870,
                topic: { id: 18, title: "지역 청년 창업 생태계 활성화 방안" },
            },
            {
                id: "5",
                categories: ["문화", "지역활성화"],
                date: "2025.11.02",
                title: "지역 예술축제, 시민 참여 확대 방안",
                description:
                    "매번 비슷한 공연만 반복돼서 흥미가 떨어졌어요. 시민이 직접 참여하거나, 동네 예술가들이 무대에 설 수 있는 기회가 많아졌으면 좋겠어요.",
                comments: 73,
                votes: 315,
            },
        ],
    },
    {
        title: "반영 완료",
        color: "green",
        projects: [
            {
                id: "6",
                categories: ["복지", "노년층"],
                date: "2025.10.30",
                title: "노인복지관 무료 급식사업 확대",
                description:
                    "할머니가 복지관에서 식사하신다고 좋아하셨어요. 예산이 늘어난 덕분에 더 많은 어르신이 혜택을 받을 수 있다고 들었습니다. 이런 정책은 꾸준히 이어졌으면 합니다.",
                comments: 321,
                votes: 1420,
            },
            {
                id: "7",
                categories: ["안전", "교통"],
                date: "2025.10.28",
                title: "횡단보도 앞 보행신호 대기시간 단축",
                description:
                    "아이들 등하굣길 신호 대기시간이 너무 길었는데, 조정되고 나서 훨씬 편해졌어요. 다만 차들도 급하게 움직이는 구간이 있어 추가 점검이 필요할 것 같아요.",
                comments: 210,
                votes: 1190,
                topic: { id: 23, title: "보행자 중심의 안전 교통 환경 구축" },
            },
        ],
    },
];

export default function DashboardPage() {
    const [location, setLocation] = useState("");
    const [isLocLoading, setIsLocLoading] = useState(false);

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
                        "Referer": typeof window !== "undefined" ? window.location.origin : "https://example.com",
                    },
                }
            );

            if (!res.ok) throw new Error(`Reverse geocoding failed: ${res.status}`);
            const data = await res.json();

            const a = data.address ?? {};
            const regionName =
                [a.state, a.city, a.town, a.county, a.suburb, a.village].filter(Boolean).slice(0, 2).join(" ") ||
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

    return (
        <div className="">
            <DashboardHeader/>
            <LocationControl location={location} isLocLoading={isLocLoading} handleRefreshLocation={handleRefreshLocation} />
            {/* Kanban Board */}
            {isLocLoading ? (
                <KanbanBoardSkeleton/>
            ) : (
                <KanbanBoard
                    kanbans={kanbans} />
            )}
        </div>
    );
}