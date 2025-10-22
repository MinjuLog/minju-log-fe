"use client"

import { ChevronRight, ArrowUpDown } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const categories = [
    "전체",
    "사회",
    "맛이슈",
    "정책",
    "윤리",
    "법",
    "fun",
    "문화",
    "정치",
    "경제",
    "연애결혼",
    "기술",
    "젠더",
    "과학",
]

const pastDebatesData = [
    {
        id: 1,
        tags: ["#사회", "#맛이슈"],
        title: "펜션 퇴실 청소비 등장 당신의 생각은",
        round: 111,
        result: "펜션 측 갑질이야",
        percentage: "71.7%",
        votes: "1,613표",
        discussions: "227개",
    },
    {
        id: 2,
        tags: ["#사회", "#정치"],
        title: "변화하는 남북 관계 통일, 필요한가?",
        round: 110,
        result: "현상유지가 최선이야",
        percentage: "63.2%",
        votes: "1,502표",
        discussions: "318개",
    },
]

export function DebateList() {
    const [selectedCategory, setSelectedCategory] = useState("전체")
    const navigate = useNavigate()

    return (
        <section className="mt-16 pt-16 border-t border-border">
            <h2 className="text-3xl font-bold mb-8">지난 스파링 103</h2>

            {/* Category filters */}
            <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedCategory === category
                                ? "bg-secondary text-foreground"
                                : "bg-background text-muted-foreground hover:bg-secondary/50"
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Sort option */}
            <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
                <span>기본순</span>
                <ArrowUpDown className="w-4 h-4" />
            </div>

            {/* Past debates list */}
            <div className="space-y-4">
                {pastDebatesData.map((debate) => (
                    <div
                        key={debate.id}
                        onClick={() => navigate(`/discussions/${debate.id}`)}
                        className="bg-secondary/30 rounded-xl p-6
                                     hover:bg-secondary/40
                                     hover:shadow-lg
                                     hover:scale-[1.02]
                                     transition-all duration-300
                                     cursor-pointer"
                    >
                        {/* Tags and round */}
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex gap-2">
                                {debate.tags.map((tag) => (
                                    <span key={tag} className="text-sm text-muted-foreground font-medium">
                    {tag}
                  </span>
                                ))}
                            </div>
                            <span className="text-sm text-muted-foreground">{debate.round} 라운드</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold mb-4">{debate.title}</h3>

                        {/* Result and stats */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="px-4 py-2 rounded-lg border-2 border-red-400 text-red-500 font-medium">
                                    {debate.result} {debate.percentage}
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <div className="text-xs text-muted-foreground mb-1">투표 수</div>
                                    <div className="font-bold">{debate.votes}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xs text-muted-foreground mb-1">토론 수</div>
                                    <div className="font-bold">{debate.discussions}</div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}