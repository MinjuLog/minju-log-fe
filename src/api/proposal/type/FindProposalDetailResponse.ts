export default interface FindProposalDetailResponse {
    ok: true;
    result: {
        id: number;
        title: string;
        body: string;
        status: string;
        viewCount: number;
        hashtags: string[];
        dueDate: string;
        agreeSignatureCount: number;
        disagreeSignatureCount: number;
        agreeVoteCount: number;
        disagreeVoteCount: number;
        mySignature: {
            didSign: boolean;
            type: string;
            content: string;
        } | null;
        myVote: {
            didVote: boolean;
            type: "AGREE" | "DISAGREE";
        } | null;
        recentSignatures: {
            signatureId: number;
            userId: number;
            nickname: string;
            signatureType: string;
            content: string;
            createdAt: string;
        }[];
        createdAt: string;
    };
}