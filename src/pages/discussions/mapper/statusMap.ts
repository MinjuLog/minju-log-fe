import type {DiscussionStatusType} from "../types/DiscussionStatusType.ts";

export const statusMap: Record<DiscussionStatusType, string> = {
    "전체": "전체",
    "COLLECTING": "의견 취합중",
    "전달 완료": "전달 완료",
    "보도 중": "보도 중",
    "반영 완료": "반영 완료"
}