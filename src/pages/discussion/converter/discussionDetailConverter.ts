import type FindProposalDetailResponse from "../../../api/proposal/type/FindProposalDetailResponse";
import type DiscussionType from "../types/DiscussionType";

export default function discussionDetailConverter(
    data: FindProposalDetailResponse
): DiscussionType {
    const result = data.result;

    return {
        sequence: result.id,
        title: result.title,
        // topic: result.topic
        //     ? {
        //         sequence: result.topic.sequence,
        //         title: result.topic.title,
        //     }
        //     : null,
        content: result.body,
        createdAt: result.createdAt,
        expiredAt: result.dueDate,
        hashTags: result.hashtags,
        pros: result.agreeVoteCount,
        cons: result.disagreeVoteCount,
    };
}