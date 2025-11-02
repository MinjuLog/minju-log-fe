import type DiscussionCategoryType from "../types/DiscussionCategoryType.ts";

interface props {
    categories: DiscussionCategoryType[];
    selectedCategory: number;
    setSelectedCategory: (selectedCategory: number) => void;
}

export default function DiscussionsCategoryFilter({ categories, selectedCategory, setSelectedCategory } : props) {
    return (
        <div className="my-6">
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                            selectedCategory === category.id
                                ? "bg-gray-800 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        {category.text}

                    </button>
                ))}
            </div>
        </div>
    )
}