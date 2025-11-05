import type KanbanType from "../types/KanbanType.ts";
import KanbanColumn from "./KanbanColumn.tsx";

interface props {
    kanbans: KanbanType[];
}

export default function KanbanBoard({ kanbans }: props) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {kanbans.map((kanban) => (
                <KanbanColumn key={kanban.title} kanban={kanban} />
            ))}
        </div>
    );
}