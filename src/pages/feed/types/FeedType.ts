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
        renderType: "UNICODE" | "IMAGE" | null;
        imageUrl?: string | null;
        unicode?: string | null;
        count: number;
        isPressed: boolean;
    }[]
}