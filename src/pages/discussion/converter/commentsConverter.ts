import type GetSignatureListResponse from "../../../api/signature/type/GetSignatureListResponse";
import type CommentType from "../types/CommentType.ts";
import formatDate from "../../../utils/formatDate.ts";

export default function commentsConverter(data: GetSignatureListResponse): CommentType[] {
    const content = data.result.content;

    return content.map(c => ({
        id: String(c.signatureId),
        authorId: String(c.userId),
        authorName: c.nickname,
        timestamp: formatDate(c.createdAt),
        content: c.content,
        opinion: c.signatureType === "AGREE" ? 1 : 2, // 기존 CommentType 구조에 맞게
        likes: 0, // 서버에서 없으면 기본값
    }));
}