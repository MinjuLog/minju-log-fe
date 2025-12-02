export default interface DiscussionPreviewType {
    id: number;
    status: "COLLECTING" | "DELIVERED" | "REPORTING" | "COMPLETED";
    title: string;
    result: {
        pros: number,
        cons: number;
    };
    votes: number;
    discussions: number;
    hashTags: string[];
    expiredAt: string;
}