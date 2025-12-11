import {DiscussionCards} from "./components/DiscussionCards.tsx";
import {DiscussionPreviewList} from "./components/DiscussionPreviewList.tsx";
import DiscussionHeader from "../../components/DiscussionHeader.tsx";
import LocationControl from "../../components/LocationControl.tsx";
import {useEffect, useState} from "react";

// const discussionCardsMock: DiscussionCardType[] = [
//     {
//         votesCount: 1052,
//         title: "우리 시 대중교통, 환승 요금제 도입이 필요할까?",
//         timeLeft: "2일 남았어요",
//         bgColor: "bg-gradient-to-br from-blue-700 to-blue-900",
//         image: "/local-bus-illustration.jpg",
//     },
//     {
//         votesCount: 1289,
//         title: "도심 주차난 해결, 공영주차장 확충이 해답일까?",
//         timeLeft: "1일 남았어요",
//         isCountdown: true,
//         bgColor: "bg-gradient-to-br from-gray-800 to-gray-900",
//         image: "/city-parking-illustration.jpg",
//     },
//     {
//         votesCount: 764,
//         title: "하천 정비 사업, 환경 파괴 논란 넘을 수 있을까?",
//         timeLeft: "10:32:50 남았어요",
//         bgColor: "bg-gradient-to-br from-green-700 to-green-900",
//         image: "/river-restoration-illustration.jpg",
//     },
//     {
//         votesCount: 1143,
//         title: "청년 임대주택 확대, 지역 정착에 효과 있을까?",
//         timeLeft: "5일 남았어요",
//         bgColor: "bg-gradient-to-br from-purple-700 to-purple-900",
//         image: "/youth-housing-illustration.jpg",
//     },
// ];

// const discussionPreviewsMock: DiscussionPreviewType[] = [
//     {
//         id: 1,
//         status: 1,
//         title: "대중교통 무료 환승제, 우리 시도 도입해야 할까?",
//         sequence: 140,
//         result: { pros: 69.2, cons: 30.8 },
//         votes: 2184,
//         discussions: 401,
//         hashtags: ["대중교통", "환승", "무료정책"],
//     },
//     {
//         id: 2,
//         status: 2,
//         title: "하천 정비 사업, 생태계 영향은?",
//         sequence: 139,
//         result: { pros: 74.5, cons: 25.5 },
//         votes: 1856,
//         discussions: 277,
//         hashtags: ["환경보호", "하천정비", "생태계"],
//     },
//     {
//         id: 3,
//         status: 3,
//         title: "청년 임대주택, 지방 소멸 해결책 될까?",
//         sequence: 138,
//         result: { pros: 33.7, cons: 66.3 },
//         votes: 2039,
//         discussions: 333,
//         hashtags: ["청년주거", "지방소멸", "임대주택"],
//     },
//     {
//         id: 4,
//         status: 2,
//         title: "전통시장 주차 2시간 무료, 소비 진작 효과 있나?",
//         sequence: 137,
//         result: { pros: 58.4, cons: 41.6 },
//         votes: 1462,
//         discussions: 198,
//         hashtags: ["전통시장", "소비진작", "주차정책"],
//     },
//     {
//         id: 5,
//         status: 1,
//         title: "도심 가로수 교체 vs. 보존, 무엇이 우선?",
//         sequence: 136,
//         result: { pros: 47.1, cons: 52.9 },
//         votes: 1210,
//         discussions: 165,
//         hashtags: ["가로수", "환경보존", "도시정책"],
//     },
//     {
//         id: 6,
//         status: 4,
//         title: "학교 야간 자율학습 확대, 선택권 보장인가 부담인가?",
//         sequence: 135,
//         result: { pros: 41.3, cons: 58.7 },
//         votes: 987,
//         discussions: 142,
//         hashtags: ["교육정책", "야자", "학생권리"],
//     },
//     {
//         id: 7,
//         status: 2,
//         title: "지역사랑상품권 예산 확대, 지역경제에 실효 있나?",
//         sequence: 134,
//         result: { pros: 62.0, cons: 38.0 },
//         votes: 1599,
//         discussions: 210,
//         hashtags: ["지역경제", "상품권", "예산정책"],
//     },
//     {
//         id: 8,
//         status: 3,
//         title: "반려동물 공원 확대, 소음·위생 문제 어떻게?",
//         sequence: 133,
//         result: { pros: 55.6, cons: 44.4 },
//         votes: 1324,
//         discussions: 189,
//         hashtags: ["반려동물", "공원", "소음문제"],
//     },
//     {
//         id: 9,
//         status: 1,
//         title: "청년 창업 보조금 상향, 일자리 창출로 이어질까?",
//         sequence: 132,
//         result: { pros: 60.3, cons: 39.7 },
//         votes: 1118,
//         discussions: 173,
//         hashtags: ["청년창업", "보조금", "일자리"],
//     },
//     {
//         id: 10,
//         status: 2,
//         title: "작은 도서관 24시간 개방, 안전·운영 문제는?",
//         sequence: 131,
//         result: { pros: 38.9, cons: 61.1 },
//         votes: 874,
//         discussions: 120,
//         hashtags: ["도서관", "공공시설", "안전운영"],
//     },
//     {
//         id: 11,
//         status: 4,
//         title: "생활폐기물 종량제봉투 가격 인상, 필요할까?",
//         sequence: 130,
//         result: { pros: 29.5, cons: 70.5 },
//         votes: 965,
//         discussions: 137,
//         hashtags: ["폐기물", "환경정책", "종량제"],
//     },
//     {
//         id: 12,
//         status: 3,
//         title: "심야 택시 호출료 인상, 서비스 개선으로 이어질까?",
//         sequence: 129,
//         result: { pros: 52.8, cons: 47.2 },
//         votes: 1783,
//         discussions: 246,
//         hashtags: ["택시", "심야교통", "요금인상"],
//     },
// ];


export default function DiscussionsPage() {
    const [location, setLocation] = useState("");
    const [isLocLoading, setIsLocLoading] = useState(false);

    const handleRefreshLocation: () => Promise<void> = async () => {
        if (!navigator.geolocation) {
            alert("이 브라우저에서는 위치 정보 사용이 불가능합니다.");
            return;
        }
        setIsLocLoading(true);

        try {
            // 1. 위치 가져오기 + 안전 타임아웃
            const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
                const timer = setTimeout(() => {
                    reject(new Error("Geolocation timeout"));
                }, 3000); // 5초

                navigator.geolocation.getCurrentPosition(
                    (p) => {
                        clearTimeout(timer);
                        resolve(p);
                    },
                    (err) => {
                        clearTimeout(timer);
                        reject(err);
                    },
                    {
                        enableHighAccuracy: false,
                        maximumAge: 60_000,
                        timeout: 3000, // 브라우저가 지원하면 이거도 사용
                    }
                );
            });

            const { latitude, longitude } = pos.coords;

            // 2. reverse geocoding fetch에도 타임아웃
            const controller = new AbortController();
            const fetchTimeout = setTimeout(() => {
                controller.abort();
            }, 3000); // 5초 후 강제 abort

            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2`,
                    {
                        signal: controller.signal,
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
                if (e instanceof DOMException && e.name === "AbortError") {
                    console.warn("Reverse geocoding request aborted (timeout)");
                } else {
                    console.error(e);
                }
                setLocation("위치 정보를 불러오지 못했습니다.");
            } finally {
                clearTimeout(fetchTimeout);
            }
        } catch (e: unknown) {
            console.error(e);
            setLocation("위치 정보를 불러오지 못했습니다.");
        } finally {
            setIsLocLoading(false);
        }
    };

    useEffect(() => {
        handleRefreshLocation();
    }, []);

    useEffect(() => {
        // 페이지 진입 시 스크롤 맨 위로
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "auto", // 또는 "smooth"로 천천히 올리게 할 수도 있음
        });
    }, []);

    return (
        <>
            <DiscussionHeader/>
            <LocationControl
                location={location}
                isLocLoading={isLocLoading}
                handleRefreshLocation={handleRefreshLocation}
            />
            <DiscussionCards isLocLoading={isLocLoading} />
            <DiscussionPreviewList isLocLoading={isLocLoading} />
        </>
    )
}
