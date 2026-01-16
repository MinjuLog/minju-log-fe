export default interface FeedType {
    id: number;
    authorId: number;
    authorName: string;
    timestamp: string;
    content: string;
    likes: number;
    attachments: {
        objectKey: string;
        originalName: string;
        contentType: string;
        size: number;
    }[]
}