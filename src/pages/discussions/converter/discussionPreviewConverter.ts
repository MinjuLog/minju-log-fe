import type FindProposalListResponse from "../../../api/proposal/type/FindProposalListResponse.ts";
import type DiscussionPreviewType from "../types/DiscussionPreviewType.ts";

export default function discussionPreviewConverter(
    data: FindProposalListResponse
): DiscussionPreviewType[] {
    return data.content.map((c) => ({
        id: c.id,
        status: c.status,
        title: c.title,
        result: {
            pros: (c.agreeVoteCount + c.disagreeVoteCount) === 0 ? 0 : Number(((c.agreeVoteCount / (c.agreeVoteCount + c.disagreeVoteCount)) * 100).toFixed(1)),
            cons: (c.agreeVoteCount + c.disagreeVoteCount) === 0 ? 0 : Number(((c.disagreeVoteCount / (c.agreeVoteCount + c.disagreeVoteCount)) * 100).toFixed(1)),
        },
        votes: c.agreeVoteCount + c.disagreeVoteCount,
        discussions: c.agreeSignatureCount + c.disagreeVoteCount,
        hashTags: c.hashtags,
        expiredAt: c.dueDate,
    }));
}