export default interface FeedType {
    id: number;
    authorId: number;
    authorName: string;
    timestamp: string;
    content: string;
    attachments: {
        objectKey: string;
        originalName: string;
        contentType: string;
        size: number;
    }[];
    reactions: {
        reactionKey: string;
        emojiType: "DEFAULT" | "CUSTOM" | null;
        objectKey?: string | null;
        emoji?: string | null;
        count: number;
        pressedByMe: boolean;
    }[]
}