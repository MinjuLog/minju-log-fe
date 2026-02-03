export default interface GetIncrementLikeResponse {
    ok: true;
    result: {
        workspaceId: number;
        likeCount: number;
    }
}