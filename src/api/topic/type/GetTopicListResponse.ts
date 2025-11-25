export default interface GetTopicListResponse {
    ok: true;
    result: {
        id: number;
        title: string;
        region: string;
        hashtags: string[];
        content: string;
        createdAt: string;
    }[]
}