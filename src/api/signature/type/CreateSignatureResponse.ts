export default interface CreateSignatureResponse {
    ok: true;
    result: {
        signatureId: number;
        signatureType: "AGREE" | "DISAGREE";
        content: string;
        createdAt: string;
    };
}