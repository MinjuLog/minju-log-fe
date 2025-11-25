import type FindProposalListResponse from "../../../api/proposal/type/FindProposalListResponse.ts";
import type SidebarDiscussionType from "../types/SidebarDiscussionType.ts";
import getTimeLeft from "../../../utils/getTimeLeft.ts";

export default function sidebarDiscussionConverter(
    data: FindProposalListResponse
): SidebarDiscussionType[] {

    return data.content.map(c => {
        const total = c.agreeSignatureCount + c.disagreeSignatureCount;

        const agreeRatio = total === 0 ? 0 : (c.agreeSignatureCount / total) * 100;
        const disagreeRatio = total === 0 ? 0 : (c.disagreeSignatureCount / total) * 100;

        const best =
            c.agreeSignatureCount > c.disagreeSignatureCount
                ? `찬성 ${agreeRatio.toFixed(1)}%`
                : `반대 ${disagreeRatio.toFixed(1)}%`;

        return {
            id: String(c.id),
            endLeft: getTimeLeft(c.dueDate),
            mainTitle: c.title,
            subTitle: "",
            content: c.body,
            best,
            votes: c.agreeVoteCount + c.disagreeVoteCount,
        };
    });
}