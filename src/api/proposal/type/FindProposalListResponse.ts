export default interface FindProposalListResponse {
    ok: true,
    totalPages: number;
    totalElements: number;
    content: {
        id: number;
        title: string;
        status: "COLLECTING" | "전달 완료" | "보도 중" | "반영 완료";
        viewCount: number;
        hashtags: string[];
        dueDate: string;
        agreeSignatureCount: number;
        disagreeSignatureCount: number;
        agreeVoteCount: number;
        disagreeVoteCount: number;
    }[]
}