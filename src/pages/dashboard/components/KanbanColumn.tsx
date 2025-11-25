import {useState} from "react";
import KanbanCard from "./KanbanCard.tsx";
import type KanbanType from "../types/KanbanType.ts";

interface props {
    kanban: KanbanType;
    onLoadMore: (columTitle: string) => Promise<void>;
    loadingColumn: string | null;
}

const PAGE_SIZE = 2;

const colorMap: Record<string, string> = {
    purple: "bg-purple-500",
    indigo: "bg-indigo-300",
    orange: "bg-amber-500",
    green: "bg-green-500",
};

export default function KanbanColumn({ kanban, onLoadMore, loadingColumn }: props) {
    const [visible, setVisible] = useState(PAGE_SIZE);
    const total = kanban.total
    const canLoadMore = kanban.projects.length < kanban.total;
    const isLoadingThisColumn = loadingColumn === kanban.title;



    return (
        <div className="space-y-4" key={kanban.title}>
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <div className={`w-3 h-3 rounded-full ${colorMap[kanban.color]}`} />
                <h2 className="font-semibold text-gray-900">
                    {kanban.title} <span className="text-gray-500 ml-2">{total}</span>
                </h2>
            </div>

            {/* Border */}
            <div className={`h-1 rounded-full ${colorMap[kanban.color]}`} />

            {/* Cards */}
            <div className="space-y-4">
                {total === 0 ? (
                    <div className="text-sm text-gray-500 bg-gray-50 border border-dashed border-gray-200 rounded-lg p-6">
                        등록된 동네한표가 없습니다.
                    </div>
                ) : (
                    kanban.projects.map((project) => (
                        <KanbanCard key={project.sequence ?? project.title} project={project} />
                    ))
                )}

                {/* Load more */}
                {canLoadMore && (
                    <button
                        type="button"
                        disabled={isLoadingThisColumn}
                        onClick={async () => {
                            await onLoadMore(kanban.title)
                            setVisible(kanban.projects.length + PAGE_SIZE)
                        }}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition"
                        aria-label={`${kanban.title} 더 불러오기`}
                    >
                        더 불러오기{" "}
                        <span className="text-gray-400">
                          ({visible}/{total})
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
}