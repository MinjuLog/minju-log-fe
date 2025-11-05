import type ProjectType from "./ProjectType.ts";

export default interface KanbanType {
    title: string;
    color: string;
    projects: ProjectType[]
}