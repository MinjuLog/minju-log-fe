export default interface TopicDetailType {
    id: number;
    header: {
        tag: string;
        category: string;
        title: string;
        timeAgo: string;
        author: string;
    };
    body: {
        content: string;
    };
    footer: {
        author: string;
        company: string;
        writeCount: number;
        replyCount: number;
    }
}