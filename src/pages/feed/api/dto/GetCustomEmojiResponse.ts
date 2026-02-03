export default interface GetCustomEmojiResponse {
    ok: true;
    result: {
        reactionKey: string;
        objectKey: string;
    }[]
}