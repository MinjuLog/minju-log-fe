import type DiscussionCategoryType from "./DiscussionCategoryType.ts";

export default interface DiscussionPreviewType {
    id: number;
    categories: DiscussionCategoryType[];
    title: string;
    sequence: number;
    result: {
        pros: number,
        cons: number;
    };
    votes: number;
    discussions: number;
}