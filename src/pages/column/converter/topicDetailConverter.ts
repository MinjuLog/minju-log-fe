import type GetTopicDetailResponse from "../../../api/topic/type/GetTopicDetailResponse.ts";
import type TopicDetailType from "../type/TopicDetailType.ts";
import formatDate from "../../../utils/formatDate.ts";

export default function topicDetailConverter(data: GetTopicDetailResponse): TopicDetailType {
    const result = data.result;
    return {
        id: result.id,
        header: {
            tag: "HOT",
            category: result.hashtags.join(", "),
            title: result.title,
            timeAgo: formatDate(result.createdAt),
            author: "민주로그팀",
        },
        body: {
            content: result.content,
        },
        footer: {
            author: "박지후 지역정책연구원",
            company: "지속가능농정연구소",
            writeCount: 62,
            replyCount: 1043,
        }
    }
}