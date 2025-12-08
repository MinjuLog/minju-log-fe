import type ProjectType from "./ProjectType.ts";

export default interface KanbanType {
    total: number;
    title: string;
    desc: string;
    color: string;
    projects: ProjectType[]
}