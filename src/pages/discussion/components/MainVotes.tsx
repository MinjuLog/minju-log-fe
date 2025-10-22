import {Info, Share2} from "lucide-react";
import {useEffect, useState} from "react";

const votingOptions = [
    {
        id: 1,
        text: "상생 위해 필요해",
        badge: "선택",
        color: "bg-blue-100 hover:bg-blue-200",
        iconColor: "text-blue-600",
        gemImage: "/gem-blue.jpg",
    },
    {
        id: 2,
        text: "6개월은 너무 길어",
        badge: "선택",
        color: "bg-red-100 hover:bg-red-200",
        iconColor: "text-red-600",
        gemImage: "/gem-red.jpg",
    },
    {
        id: 3,
        text: "한류 확산에 방해돼",
        badge: "선택",
        color: "bg-purple-100 hover:bg-purple-200",
        iconColor: "text-purple-600",
        gemImage: "/gem-purple.jpg",
    },
    {
        id: 4,
        text: "소비자만 불편해져",
        badge: "선택",
        color: "bg-green-100 hover:bg-green-200",
        iconColor: "text-green-600",
        gemImage: "/gem-green.jpg",
    },
]


export default function MainVotes() {
    const [timeLeft, setTimeLeft] = useState({
        hours: 6,
        minutes: 18,
        seconds: 49,
    })

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                let { hours, minutes, seconds } = prev

                if (seconds > 0) {
                    seconds--
                } else if (minutes > 0) {
                    minutes--
                    seconds = 59
                } else if (hours > 0) {
                    hours--
                    minutes = 59
                    seconds = 59
                }

                return { hours, minutes, seconds }
            })
        }, 1000)

        return () => clearInterval(timer)
    }, []);

    return (
        <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-8 shadow-sm">
                {/* Header */}
                <div className="mb-8 flex items-start justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                        <span className="text-lg font-medium">112 라운드</span>
                        <Info className="h-5 w-5"/>
                    </div>
                    <button className="rounded-lg p-2 hover:bg-gray-100">
                        <Share2 className="h-5 w-5 text-gray-600"/>
                    </button>
                </div>

                {/* Title */}
                <h1 className="mb-12 text-center text-3xl font-bold leading-tight text-gray-900">
                    넷플릭스엔 늦게 공개,
                    <br/>
                    영화계 살릴까
                </h1>

                {/* Voting Options Grid */}
                <div className="mb-8 grid grid-cols-2 gap-4">
                    {votingOptions.map((option) => (
                        <button
                            key={option.id}
                            className={`group relative flex min-h-[120px] flex-col items-center justify-center gap-3 rounded-2xl p-6 transition-all ${option.color}`}
                        >
                            {/* 3D Gem Icon */}
                            <div className={`text-6xl ${option.iconColor}`}>
                                {option.id === 1 && "💎"}
                                {option.id === 2 && "🔴"}
                                {option.id === 3 && "💜"}
                                {option.id === 4 && "💚"}
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-center font-medium text-gray-900">{option.text}</span>
                                <div>
                                    {option.badge}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Vote Count */}
                <div className="mb-6 flex items-center justify-center gap-2 text-xl font-bold text-gray-900">
                    <span className="text-2xl">🔥</span>
                    <span>1,204명 투표 중!</span>
                </div>

                {/* Timer */}
                <div className="text-center">
                    <p className="mb-2 text-sm text-gray-600">남은 투표 시간</p>
                    <p className="text-3xl font-bold text-gray-900">
                        {String(timeLeft.hours).padStart(2, "0")} : {String(timeLeft.minutes).padStart(2, "0")} :{" "}
                        {String(timeLeft.seconds).padStart(2, "0")}
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-500">아직에나 선정한 주제</div>
            </div>
        </div>
    );
}