export default interface DiscussionPreviewType {
    id: number;
    status: number;
    title: string;
    sequence: number;
    result: {
        pros: number,
        cons: number;
    };
    votes: number;
    discussions: number;
    hashtags?: string[];
}