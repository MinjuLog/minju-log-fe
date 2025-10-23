export interface ColumnPreviewType {
    id: string;
    isNew: boolean;
    category: string;
    title: string;
    excerpt: string;
    author: {
        name: string;
        verified: boolean;
        avatar: string;
    },
    timeAgo: string;
    bookmarks: number;
    comments: number;
    views: number;
    thumbnail: string;
}