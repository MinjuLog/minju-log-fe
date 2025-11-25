export default interface GetSignatureListResponse {
    ok: true;
    result: SignatureListResult;
}

export interface SignatureListResult {
    totalElements: number;
    totalPages: number;
    content: {
        signatureId: number;
        userId: string;
        nickname: string;
        signatureType: "AGREE" | "DISAGREE" | string;
        content: string;
        createdAt: number[];
    }[];
    number: number;
    last: boolean;
    numberOfElements: number;
}