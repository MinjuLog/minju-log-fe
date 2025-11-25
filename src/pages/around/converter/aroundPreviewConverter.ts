import type GetTopicListResponse from "../../../api/topic/type/GetTopicListResponse.ts";
import {getRandomColors} from "../../../utils/getRandomColors.ts";

export default function aroundPreviewConverter(data: GetTopicListResponse) {
    return data.result.map(item => {
        const colors = getRandomColors()
        return {
            id: item.id,
            label: "?",
            title: item.title,
            bgColor: colors.bgColor,
            textColor: colors.textColor,
            titleColor: colors.titleColor,
            hashTags: item.hashtags
        }
    })
}