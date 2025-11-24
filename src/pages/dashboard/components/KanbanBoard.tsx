import type KanbanType from "../types/KanbanType.ts";
import KanbanColumn from "./KanbanColumn.tsx";

interface props {
    kanbans: KanbanType[];
    onLoadMore: (columTitle: string) => Promise<void>;
    loadingColumn: string | null;
}

export default function KanbanBoard({ kanbans, onLoadMore, loadingColumn }: props) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {kanbans.map((kanban) => (
                <KanbanColumn key={kanban.title} kanban={kanban} onLoadMore={onLoadMore} loadingColumn={loadingColumn} />
            ))}
        </div>
    );
}