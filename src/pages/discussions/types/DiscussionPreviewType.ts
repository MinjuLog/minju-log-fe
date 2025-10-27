export default interface DiscussionPreviewType {
    id: number;
    tags: string[];
    title: string;
    round: number;
    result: string;
    percentage: number;
    votes: number;
    discussions: number;
}