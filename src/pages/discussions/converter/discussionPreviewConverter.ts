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
            pros: c.agreeVoteCount,
            cons: c.disagreeVoteCount,
        },
        votes: c.agreeVoteCount + c.disagreeVoteCount,
        discussions: c.agreeSignatureCount + c.disagreeVoteCount,
        hashTags: c.hashTags,
    }));
}