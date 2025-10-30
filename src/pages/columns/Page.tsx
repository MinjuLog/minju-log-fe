"use client"
import { useState } from "react"
import AroundHeader from "../../components/AroundHeader.tsx";
import CategoryFilter from "./components/CategoryFilter.tsx";
import type {CategoryType} from "./types/CategoryType.ts";
import type {ColumnPreviewType} from "./types/ArticlePreviewType.ts";
import ColumnPreview from "./components/ColumnPreview.tsx";

const categoriesMock: CategoryType[] = [
    { id: "all", name: "전체", icon: "" },
    { id: "membership", name: "멤버십 전용", icon: "⭐" },
    { id: "politics", name: "정치·행정" },
    { id: "policy", name: "정책·예산" },
    { id: "local", name: "지역사회" },
    { id: "economy", name: "경제·산업" },
    { id: "labor", name: "노동·복지" },
    { id: "education", name: "교육·청년" },
    { id: "environment", name: "환경·도시" },
    { id: "ethics", name: "윤리·공정" },
    { id: "law", name: "법률" },
    { id: "health", name: "보건·복지" },
];
const columnPreviewsMock: ColumnPreviewType[] = [
    {
        id: "1",
        isNew: true,
        category: "정책·예산",
        title: "청년 예산 삭감, 지방 재정의 불편한 진실",
        excerpt:
            "지방정부의 재정 건전성을 이유로 청년 정책 예산이 삭감되는 사례가 늘고 있습니다. 그러나 단기적 절감이 장기적 인구 감소를 초래한다는 점에서...",
        author: {
            name: "김은서 정책연구원",
            verified: true,
            avatar: "/avatars/policy-expert.jpg",
        },
        timeAgo: "3시간 전",
        bookmarks: 12,
        comments: 8,
        views: 218,
        thumbnail: "/images/local-budget-discussion.jpg",
    },
    {
        id: "2",
        isNew: false,
        category: "정치·행정",
        title: "공공기관 이전, 지역 균형발전의 해법인가?",
        excerpt:
            "정부의 공공기관 지방 이전 정책은 지역 균형발전을 내세우지만, 실질적 고용 창출 효과에는 의문이 제기되고 있습니다. 이전이 곧 발전이라는 단순한 논리는...",
        author: {
            name: "이도현 행정학 박사",
            verified: true,
            avatar: "/avatars/public-policy.jpg",
        },
        timeAgo: "1일 전",
        bookmarks: 45,
        comments: 23,
        views: 402,
        thumbnail: "/images/public-agency-relocation.jpg",
    },
    {
        id: "3",
        isNew: true,
        category: "지역사회",
        title: "소멸위기 지역, 청년이 남지 않는 이유",
        excerpt:
            "각 지자체가 청년 유입 정책을 내세우지만, 실제 정착률은 저조합니다. 근본적 문제는 일자리보다 생활 인프라와 문화 접근성에 있다는 지적이...",
        author: {
            name: "박지수 사회정책 칼럼니스트",
            verified: true,
            avatar: "/avatars/sociology-writer.jpg",
        },
        timeAgo: "12시간 전",
        bookmarks: 5,
        comments: 3,
        views: 150,
        thumbnail: "/images/local-youth-decline.jpg",
    },
    {
        id: "4",
        isNew: false,
        category: "노동·복지",
        title: "공공근로 축소 논란, 복지인가 일자리인가",
        excerpt:
            "최근 일부 지자체에서 공공근로 예산을 축소하면서 복지정책의 방향성에 대한 논의가 이어지고 있습니다. 복지와 효율 사이에서 균형을 찾는 것이...",
        author: {
            name: "정하윤 경제정책 기자",
            verified: true,
            avatar: "/avatars/economy-reporter.jpg",
        },
        timeAgo: "2일 전",
        bookmarks: 28,
        comments: 6,
        views: 321,
        thumbnail: "/images/public-labor-policy.jpg",
    },
];

export default function ColumnsPage() {
    const [selectedCategory, setSelectedCategory] = useState("all")

    return (
        <>
            {/* Header */}
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <AroundHeader />

                {/* Category Filters */}
                <CategoryFilter
                    categories={categoriesMock}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                />

                {/* Articles List */}
                <div className="mt-8 space-y-6">
                    {columnPreviewsMock.map((column) => (
                        <ColumnPreview column={column} key={column.id} />
                    ))}
                </div>
            </div>
        </>
    )
}
