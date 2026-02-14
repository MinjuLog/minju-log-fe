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
        emojiKey: string;
        emojiType: "DEFAULT" | "CUSTOM" | null;
        objectKey?: string | null;
        unicode?: string | null;
        emojiCount: number;
        pressedByMe: boolean;
    }[]
}
