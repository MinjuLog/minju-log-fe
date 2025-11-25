export default interface GetTopicDetailResponse {
    ok: true;
    result: {
        id: number;
        title: string;
        region: string;
        hashtags: string[];
        content: string;
        createdAt: number[];
    }
}