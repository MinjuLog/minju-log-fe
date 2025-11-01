export default interface DiscussionPreviewType {
    id: number;
    tags: string[];
    title: string;
    sequence: number;
    result: {
        pros: number,
        cons: number;
    };
    votes: number;
    discussions: number;
}