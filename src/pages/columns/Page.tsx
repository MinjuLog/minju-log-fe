"use client"
import { useState } from "react"
import ColumnHeader from "../../components/ColumnHeader.tsx";
import CategoryFilter from "./components/CategoryFilter.tsx";
import type {CategoryType} from "./types/CategoryType.ts";
import type {ColumnPreviewType} from "./types/ArticlePreviewType.ts";
import ColumnPreview from "./components/ColumnPreview.tsx";

const categories: CategoryType[] = [
    { id: "all", name: "전체", icon: "" },
    { id: "membership", name: "멤버십 전용", icon: "⭐" },
    { id: "law", name: "법률" },
    { id: "tax", name: "세금·세무" },
    { id: "employment", name: "고용·노동" },
    { id: "medical", name: "의료·상담" },
    { id: "health", name: "건강·관리" },
    { id: "medicine", name: "약·영양제" },
    { id: "psychology", name: "심리·상담" },
    { id: "pets", name: "반려동물" },
    { id: "childcare", name: "육아" },
    { id: "economy", name: "경제" },
    { id: "insurance", name: "보험" },
]

const columnPreviews: ColumnPreviewType[] = [
    {
        id: "1",
        isNew: true,
        category: "법률",
        title: "교통사고 발생 시의 민사상의 문제(7)",
        excerpt:
            "1. 상법 제726조의 2에는 '자동차보험계약의 보험자는 피보험자가 자동차를 소유, 사용 또는 관리하는 동안에 발생한 사고로 인하여 생긴 손해를 보상...",
        author: {
            name: "송인호 변호사",
            verified: true,
            avatar: "/placeholder.svg?height=40&width=40",
        },
        timeAgo: "6시간 전",
        bookmarks: 0,
        comments: 0,
        views: 20,
        thumbnail: "/scales-of-justice-and-gavel.jpg",
    },
    {
        id: "1",
        isNew: true,
        category: "법률",
        title: "교통사고 발생 시의 민사상의 문제(7)",
        excerpt:
            "1. 상법 제726조의 2에는 '자동차보험계약의 보험자는 피보험자가 자동차를 소유, 사용 또는 관리하는 동안에 발생한 사고로 인하여 생긴 손해를 보상...",
        author: {
            name: "송인호 변호사",
            verified: true,
            avatar: "/placeholder.svg?height=40&width=40",
        },
        timeAgo: "6시간 전",
        bookmarks: 0,
        comments: 0,
        views: 20,
        thumbnail: "/scales-of-justice-and-gavel.jpg",
    },
]

export default function ColumnsPage() {
    const [selectedCategory, setSelectedCategory] = useState("all")

    return (
        <>
            {/* Header */}
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <ColumnHeader />

                {/* Category Filters */}
                <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                />

                {/* Articles List */}
                <div className="mt-8 space-y-6">
                    {columnPreviews.map((column) => (
                        <ColumnPreview column={column} key={column.id} />
                    ))}
                </div>
            </div>
        </>
    )
}
