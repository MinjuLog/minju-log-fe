export default interface DiscussionPreviewType {
    id: number;
    status: "COLLECTING" | "전달 완료" | "보도 중" | "반영 완료";
    title: string;
    result: {
        pros: number,
        cons: number;
    };
    votes: number;
    discussions: number;
    hashTags: string[];
}