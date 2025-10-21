"use client"

import { Clock, BookOpen } from "lucide-react"
import { useEffect, useState } from "react"

interface DebateCardProps {
    votesCount: string
    title: string
    timeLeft: string
    isCountdown?: boolean
    bgColor: string
    image: string
}

function DebateCard({ votesCount, title, timeLeft, isCountdown, bgColor, image }: DebateCardProps) {
    const [countdown, setCountdown] = useState(timeLeft)

    useEffect(() => {
        if (!isCountdown) return

        const interval = setInterval(() => {
            // Simple countdown logic for demo
            setCountdown(timeLeft)
        }, 1000)

        return () => clearInterval(interval)
    }, [isCountdown, timeLeft])

    return (
        <div
            className={`relative overflow-hidden rounded-2xl ${bgColor} p-6 flex flex-col justify-between min-h-[350px] group hover:scale-[1.02] transition-transform duration-300`}
        >
            <div>
                <div className="text-sm font-medium text-white/90 mb-4">{votesCount}</div>
                <h2 className="text-3xl font-bold text-white leading-tight mb-6">{title}</h2>
            </div>

            <div className="flex-1 flex items-center justify-center py-8">
                <img src={image || "/placeholder.svg"} alt="" className="max-w-full h-auto object-contain" />
            </div>

            <div className="flex items-center justify-between text-white/90">
                <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{isCountdown ? countdown : timeLeft}</span>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium backdrop-blur-sm">
                    <BookOpen className="w-4 h-4" />
                    참여하기
                </button>
            </div>
        </div>
    )
}

export function DebateCards() {
    return (
        <>
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-5xl font-bold mb-3 text-foreground">스파링</h1>
                    <p className="text-lg text-muted-foreground">뜨거운 논쟁에 대해 투표하고 토론하기</p>
                </div>
                <button
                    className="px-6 py-2.5 rounded-lg border border-border hover:bg-secondary transition-colors text-sm font-medium">
                    스파링 프로필
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <DebateCard
                    votesCount="615명 투표 중"
                    title="1015 부동산 대책, 집값 잡을까?"
                    timeLeft="3일 남았어요"
                    bgColor="bg-gradient-to-br from-blue-700 to-blue-900"
                    image="/apartment-buildings-with-cars-illustration.jpg"
                />
                <DebateCard
                    votesCount="1,015명 투표 중"
                    title="넷플릭스엔 늘게 공개, 영화제 살릴까"
                        timeLeft="1일 7:57:49 남음"
                        isCountdown
                        bgColor="bg-gradient-to-br from-gray-900 to-black"
                        image="/clock-timer-illustration.jpg"
                    />
                    <DebateCard
                        votesCount="892명 투표 중"
                        title="청년 지원 정책, 실효성 있을까?"
                        timeLeft="2일 3:20:10 남음"
                        bgColor="bg-gradient-to-br from-green-700 to-green-900"
                        image="/youth-support-illustration.jpg"
                    />
                    <DebateCard
                        votesCount="1,204명 투표 중"
                        title="AI 규제 강화, 혁신 막을까?"
                        timeLeft="5일 남았어요"
                        bgColor="bg-gradient-to-br from-purple-700 to-purple-900"
                        image="/ai-regulation-illustration.jpg"
                    />
            </div>
        </>
    )
}
