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
        key: string;
        emojiType: "DEFAULT" | "CUSTOM" | null;
        imageUrl?: string | null;
        emoji?: string | null;
        count: number;
        isPressed: boolean;
    }[]
}