import type {DiscussionStatusType} from "../types/DiscussionStatusType.ts";

export const statusMap: Record<DiscussionStatusType, string> = {
    "전체": "전체",
    "COLLECTING": "의견 취합중",
    "DELIVERED": "전달 완료",
    "REPORTING": "보도 중",
    "COMPLETED": "반영 완료"
}