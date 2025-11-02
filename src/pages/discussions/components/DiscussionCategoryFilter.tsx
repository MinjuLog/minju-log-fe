import type DiscussionCategoryType from "../types/DiscussionCategoryType";

interface Props {
    categories: DiscussionCategoryType[]; // { id: number; text: string }
    selectedCategory: number;
    setSelectedCategory: (selectedCategory: number) => void;
}

export default function DiscussionCategoryFilter({
                                                     categories,
                                                     selectedCategory,
                                                     setSelectedCategory,
                                                 }: Props) {
    return (
        <div className="mb-6">
            {/* Category filters */}
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="카테고리 필터">
                {categories.map((category) => {
                    const isActive = selectedCategory === category.id;
                    return (
                        <button
                            key={category.id}
                            type="button"
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none
                ${isActive
                                ? "bg-secondary text-foreground"
                                : "bg-background text-muted-foreground hover:bg-secondary/50"
                            }`}
                            aria-pressed={isActive}
                            role="tab"
                        >
                            {category.text}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}