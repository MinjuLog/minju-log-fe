"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "../../components/DashboardHeader.tsx";
import KanbanBoard from "./components/KanbanBoard.tsx";
import type KanbanType from "./types/KanbanType.tsx";
import KanbanBoardSkeleton from "./components/KanbanBoardSkeleton.tsx";

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
                    "심야 시간대 대중교통 이용 불편이 지속되고 있습니다. 추가 노선 신설에 대한 시민 의견을 모읍니다.",
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
                    "금연구역 확대로 흡연자 불만이 커지고 있습니다. 공원 내 흡연부스 설치에 대한 지역 의견을 취합 중입니다.",
                comments: 96,
                votes: 430,
            },
            {
                id: "3",
                categories: ["주거", "청년"],
                date: "2025.11.01",
                title: "공공임대주택, 지역 청년 우선 공급 필요성",
                description:
                    "지방 청년들의 주거 불안정이 심화되고 있습니다. 청년 우선 배정 정책에 대한 의견을 나눠주세요.",
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
                    "청년 창업 인프라 강화를 위한 지원센터 설립안이 시의회에 상정되었습니다. 관련 토론 결과를 보도 중입니다.",
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
                    "시민이 직접 기획·참여하는 문화행사로 변화시키기 위한 토론 내용이 취재 중입니다.",
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
                    "시민 제안이 구청에 채택되어 내년부터 노인복지관 급식 지원 예산이 증액됩니다.",
                comments: 321,
                votes: 1420,
            },
            {
                id: "7",
                categories: ["안전", "교통"],
                date: "2025.10.28",
                title: "횡단보도 앞 보행신호 대기시간 단축",
                description:
                    "주민 민원으로 보행자 신호주기 조정이 완료되었습니다. 현재 대부분 구간에서 시행 중입니다.",
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
    const [locError, setLocError] = useState<string | null>(null);

    const handleRefreshLocation = async () => {
        if (!navigator.geolocation) {
            alert("이 브라우저에서는 위치 정보 사용이 불가능합니다.");
            return;
        }
        setIsLocLoading(true);
        setLocError(null);

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
            setLocError("위치 정보를 불러오지 못했습니다.");
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
        <div className="min-h-screen bg-gray-50 p-8">
            <DashboardHeader
                location={locError ? "위치 불러오기 실패" : location}
                handleRefreshLocation={handleRefreshLocation}
                isLocLoading={isLocLoading}
            />

            {/* Kanban Board */}
            {isLocLoading ? (
                <KanbanBoardSkeleton/>
            ) : (
                <KanbanBoard kanbans={kanbans} />
            )}
        </div>
    );
}