"use client"

import { ChevronRight, CheckSquare, Newspaper, LayoutDashboard } from "lucide-react"

export default function GuidePage() {
    const steps = [
        {
            icon: <CheckSquare className="w-16 h-16 text-black-600" />,
            title: "동네한표",
            subtitle: "동네 제안",
            description:
                "우리 동네에서 느끼는 불편함과 바꾸고 싶은 점을 자유롭게 제안해요. 생활 민원, 안전, 교통, 복지 등 어떤 불편을 느끼는 어떤 주제도 괜찮아요. 주민들의 공감을 많이 받을수록 더 주목받게 됩니다.",
        },
        {
            icon: <Newspaper className="w-16 h-16 text-black-600" />,
            title: "다른 지역은?",
            subtitle: "우수 사례 탐색",
            description:
                "다른 지역에서 이미 시도된 좋은 해결 방법을 살펴볼 수 있어요. 비슷한 문제를 어떻게 해결했는지 참고해 우리 동네에 맞는 동네한표를 새로 만들 수 있습니다.",
        },
        {
            icon: <LayoutDashboard className="w-16 h-16 text-black-600" />,
            title: "진행로그",
            subtitle: "변화 과정 확인",
            description:
                "제안된 동네한표가 현재 어떤 상태인지 한눈에 볼 수 있어요. 단계별 진행 상황과 실제로 무엇이 달라지고 있는지 투명하게 확인할 수 있습니다.",
        },
    ]

    return (
        <div className="bg-gradient-to-b to-white flex flex-col items-center justify-center py-16 px-4">
            {/* Header */}
            <div className="text-center mb-20">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                    민주로그 이용 방법
                </h1>
                <p className="text-lg text-gray-600">
                    동네의 작은 의견이 실제 변화를 만들어 가는 과정
                </p>
            </div>

            {/* Process Steps */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-6xl mx-auto">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-8">
                        {/* Step Card */}
                        <div className="flex flex-col items-center">
                            {/* Circle */}
                            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mb-6 shadow-md">
                                {step.icon}
                            </div>

                            {/* Text Content */}
                            <div className="text-center max-w-xs">
                                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                                    {step.title}
                                </h2>
                                <p className="text-sm text-purple-600 font-medium mb-4">
                                    {step.subtitle}
                                </p>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>

                        {/* Arrow Divider */}
                        {index < steps.length - 1 && (
                            <div className="hidden md:flex">
                                <ChevronRight className="w-8 h-8 text-gray-400" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}