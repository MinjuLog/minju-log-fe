export default interface CommentProp {
    id: string
    parentId?: string
    author: string
    timestamp: string
    badge?: {
        text: string
        type: "red" | "blue"
    }
    content: string
    likes: number
    replies?: number
    isReply?: boolean
    mentionedUser?: string
}