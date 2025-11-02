"use client"

import { ArrowUpDown } from "lucide-react"
import { useState } from "react"
import type DiscussionPreviewType from "../types/DiscussionPreviewType.ts";
import DiscussionPreview from "./DiscussionPreview.tsx";
import type DiscussionCategoryType from "../types/DiscussionCategoryType.ts";
import DiscussionsCategoryFilter from "./DiscussionsCategoryFilter.tsx";

interface props {
    categories: DiscussionCategoryType[]
    discussionPreviews: DiscussionPreviewType[]
}

export function DiscussionPreviewList({ categories, discussionPreviews }: props) {
    const [selectedCategory, setSelectedCategory] = useState(0);

    return (
        <section className="mt-16 pt-16 border-t border-border">
            <h2 className="text-3xl font-bold mb-8">지난 동네한표</h2>

            {/* Category filters */}
            <DiscussionsCategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />
            {/*<div className="flex flex-wrap gap-2 mb-6">*/}
            {/*    {categories.map((category) => (*/}
            {/*        <button*/}
            {/*            key={category.id}*/}
            {/*            onClick={() => setSelectedCategory(category.id)}*/}
            {/*            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${*/}
            {/*                selectedCategory === category.id*/}
            {/*                    ? "bg-secondary text-foreground"*/}
            {/*                    : "bg-background text-muted-foreground hover:bg-secondary/50"*/}
            {/*            }`}*/}
            {/*        >*/}
            {/*            {category.text}*/}
            {/*        </button>*/}
            {/*    ))}*/}
            {/*</div>*/}

            {/* Sort option */}
            <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
                <span>기본순</span>
                <ArrowUpDown className="w-4 h-4" />
            </div>

            {/* Past debates list */}
            <div className="space-y-4">
                {discussionPreviews
                    .filter((preview) =>
                        selectedCategory === 0 // 전체 보기 옵션
                            ? true
                            : preview.categories.some((c) => c.id === selectedCategory)
                    )
                    .map((preview) => (
                        <DiscussionPreview
                            key={preview.id}
                            selectedCategory={selectedCategory}
                            discussionPreview={preview}
                        />
                    ))}
            </div>
        </section>
    )
}