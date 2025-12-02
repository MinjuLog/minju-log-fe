export default interface DiscussionType {
    sequence: number;
    title: string;
    topic?: {
        sequence: number;
        title: string;
    },
    content: string;
    createdAt: string;
    expiredAt: number[];
    hashTags: string[];
    pros: number;
    cons: number;
}