import type {CategoryType} from "../types/CategoryType.ts";
import React from "react";

interface props {
    categories: CategoryType[];
    selectedCategory: string;
    setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}

export default function CategoryFilter({ categories, selectedCategory, setSelectedCategory } : props) {
    return (
        <div className="mt-12">
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                            selectedCategory === category.id
                                ? "bg-gray-900 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        {category.icon && <span className="mr-1">{category.icon}</span>}
                        {category.name}
                    </button>
                ))}
            </div>
        </div>
    )
}