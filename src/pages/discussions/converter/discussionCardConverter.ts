import type FindProposalListResponse from "../../../api/proposal/type/FindProposalListResponse.ts";
import type DiscussionCardType from "../types/DiscussionCardType.ts";
import getTimeLeft from "../../../utils/getTimeLeft.ts";

export default function discussionCardConverter(
    data: FindProposalListResponse
): DiscussionCardType[] {
    const colors = [
        "bg-gradient-to-br from-blue-700 to-blue-900",
        "bg-gradient-to-br from-gray-800 to-gray-900",
        "bg-gradient-to-br from-green-700 to-green-900",
        "bg-gradient-to-br from-purple-700 to-purple-900",
    ];

    return data.content.map((c, idx) => ({
        id: c.id,
        votesCount: c.agreeVoteCount + c.disagreeVoteCount,
        title: c.title,
        timeLeft: getTimeLeft(c.dueDate), // ← 여기
        bgColor: colors[idx % colors.length],
        hashTags: c.hashtags,
        status: c.status,
    }));
}