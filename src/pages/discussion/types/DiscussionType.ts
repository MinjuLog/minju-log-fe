export default interface DiscussionType {
    sequence: number;
    title: string;
    topic?: {
        sequence: number;
        title: string;
    },
    content: string;
    createdAt: string;
    expiredAt: string;
    hashTags: string[];
    pros: number;
    cons: number;
}