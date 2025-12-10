"use client"

import { ChevronRight, CheckSquare, Newspaper, LayoutDashboard } from "lucide-react"

export default function GuidePage() {
    const steps = [
        {
            icon: <CheckSquare className="w-16 h-16 text-black-600" />,
            title: "동네한표",
            subtitle: "동네 제안",
            description:
                "우리 동네에서 느끼는 불편함과 바꾸고 싶은 점을 자유롭게 제안해요. 생활 민원, 안전, 교통, 복지 등 어떤 주제도 괜찮아요. 주민들의 공감을 많이 받을수록 더 주목받게 됩니다.",
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
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-6xl mx-auto mb-20">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-8">
                        {/* Step Card */}
                        <div className="flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mb-6 shadow-md">
                                {step.icon}
                            </div>
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

            {/* 운영 원칙 안내 섹션 */}
            <div className="w-full max-w-4xl bg-white shadow-md rounded-2xl p-8 border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    동네한표 운영 원칙 안내
                </h2>

                <p className="text-gray-700 leading-relaxed mb-6">
                    동네한표는 주민들이 일상에서 마주하는 불편함과 고민을 함께 나누고,
                    작은 의견이라도 모아 우리 지역의 더 나은 변화를 함께 만들어가는 취지로 시작된 지역 공론장입니다.
                    최근 플랫폼 특성상 익명의 자유가 오히려 개인·집단에 대한 과도한 비난,
                    정치적 공격, 사실 확인되지 않은 정보의 확산 등 사이트의 목표와 다른 방향의 글들이 작성되는 사례가 확인되고 있습니다.
                    이러한 문제를 방지하고 건강한 토론 환경을 유지하기 위해 아래 운영 원칙을 안내드립니다.
                </p>

                <p className="text-gray-700 font-medium mb-6">
                    아래 기준에 위반되는 게시물 또는 서명은
                    <span className="font-bold"> 사전 경고 없이 내용 일부 또는 전체가 삭제될 수 있으며</span>,
                    반복 위반 시 이용 제한이 적용될 수 있습니다.
                </p>

                <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">삭제 및 제재 기준</h3>

                <ul className="space-y-6 text-gray-700 text-sm leading-relaxed">
                    <li>
                        <span className="font-semibold">1. 사실 확인 없이 개인·단체를 비방하거나 명예를 훼손하는 글</span><br />
                        실명·직함 등을 거론하며 개인을 공격하는 경우
                        사실 여부가 확인되지 않은 소문·추측 기반 비난
                    </li>

                    <li>
                        <span className="font-semibold">2. 정치적 성향을 이유로 특정 인물 또는 집단을 극단적으로 비난하거나 조롱하는 글</span><br />
                        선동적 표현, 욕설, 왜곡된 정보 반복 게시
                        특정 정당·정치인의 평판을 악의적으로 훼손하려는 의도
                    </li>

                    <li>
                        <span className="font-semibold">3. 허위 정보·조작 자료·편향된 정보 반복 유포</span><br />
                        검증되지 않은 자료를 사실처럼 게시
                        동일 내용을 여러 계정으로 반복 유포
                    </li>

                    <li>
                        <span className="font-semibold">4. 광고·상업 목적 게시물</span><br />
                        상품 판매, 서비스 홍보 링크 포함
                    </li>

                    <li>
                        <span className="font-semibold">5. 욕설·혐오·차별적 발언</span><br />
                        특정 지역·계층·세대·성별 비하
                        비속어·모욕적 표현 사용
                    </li>

                    <li>
                        <span className="font-semibold">6. 폭력·음란·불법 요소 포함</span><br />
                        범죄 유도 또는 조장
                        음란물, 부적절한 이미지·영상 포함
                    </li>

                    <li>
                        <span className="font-semibold">7. 게시판 목적과 무관한 글</span><br />
                        지역 공론장 성격과 맞지 않는 내용
                    </li>

                    <li>
                        <span className="font-semibold">8. 운영 방침을 반복적으로 위반하거나 건강한 토론을 방해하는 행위</span><br />
                        스팸성 게시글 대량 등록
                        동일 의견 도배, 신고 회피 목적 계정 변경 등
                    </li>
                </ul>
            </div>
        </div>
    )
}