"use client"

import AroundHeader from "../../components/AroundHeader.tsx";
import type AroundPreviewType from "./types/AroundPreviewType.ts";
import AroundPreview from "./components/AroundPreview.tsx";

const aroundPreviewMock: AroundPreviewType[] = [
    {
        id: 1,
        label: "전남 곡성군",
        title: "청년 농부들이 만든\n스마트팜 협동조합",
        bgColor: "bg-green-50",
        textColor: "text-green-700",
        titleColor: "text-gray-900",
        illustration: "/smartfarm.jpg",
    },
    {
        id: 2,
        label: "강원 춘천시",
        title: "도심 속 폐공장을\n청년 창업 공간으로 재탄생",
        bgColor: "bg-amber-50",
        textColor: "text-amber-700",
        titleColor: "text-gray-900",
        progress: "창업 12팀 활동 중",
        illustration: "/urban-renewal.jpg",
    },
    {
        id: 3,
        label: "전북 전주시",
        title: "지역 예술가와 함께 하는\n‘거리 예술 축제’ 운영",
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
        titleColor: "text-gray-900",
        badge: "참여자 3천명",
        illustration: "/street-art.jpg",
    },
    {
        id: 4,
        label: "경북 안동시",
        title: "전통시장 디지털화로\n소상공인 매출 30%↑",
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-700",
        titleColor: "text-gray-900",
        illustration: "/digital-market.jpg",
    },
    {
        id: 5,
        label: "제주 서귀포시",
        title: "친환경 전기차 공유로\n탄소중립 도시 실현",
        bgColor: "bg-teal-50",
        textColor: "text-teal-700",
        titleColor: "text-gray-900",
        illustration: "/ev-sharing.jpg",
    },
    {
        id: 6,
        label: "서울 은평구",
        title: "주민이 직접 기획하는\n마을 의사결정 플랫폼",
        bgColor: "bg-pink-50",
        textColor: "text-pink-700",
        titleColor: "text-gray-900",
        illustration: "/community-meeting.jpg",
    },
];

export default function AroundPage() {

    return (
        <div className="mx-auto max-w-7xl">
            {/* Header */}
            <AroundHeader/>

            {/* Mission Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {aroundPreviewMock.map((aroundPreview) => (
                    <AroundPreview aroundPreview={aroundPreview} key={aroundPreview.id} />
                ))}
            </div>
        </div>
    )
}
