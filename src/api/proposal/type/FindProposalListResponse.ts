export default interface FindProposalListResponse {
    ok: true,
    totalPages: number;
    totalElements: number;
    content: {
        id: number;
        title: string;
        body: string;
        status: "COLLECTING" | "DELIVERED" | "REPORTING" | "COMPLETED";
        viewCount: number;
        hashtags: string[];
        dueDate: number[];
        agreeSignatureCount: number;
        disagreeSignatureCount: number;
        agreeVoteCount: number;
        disagreeVoteCount: number;
        createdAt: number[];
        topicId?: number;
        topicName?: string;
    }[]
}