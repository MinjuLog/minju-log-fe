import type FindProposalListResponse from "../../../api/proposal/type/FindProposalListResponse.ts";
import type ProjectType from "../types/ProjectType.ts";

export default function kanbanConverter(
    data: FindProposalListResponse
): ProjectType[] {
    return data.content.map((c) => ({
        sequence: c.id,
        hashTags: c.hashtags,
        createdAt: c.dueDate,
        expiredAt: c.dueDate,
        title: c.title,
        description: c.title,
        votes: c.agreeVoteCount + c.disagreeVoteCount,
        comments: c.agreeSignatureCount + c.disagreeSignatureCount,
    }));
}