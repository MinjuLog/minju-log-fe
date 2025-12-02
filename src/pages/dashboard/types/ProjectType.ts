export default interface ProjectType {
    sequence: number;
    hashTags: string[];
    createdAt: string;
    expiredAt: number[];
    title: string;
    description: string;
    votes: number;
    comments: number;
    topic?: {
        sequence: number;
        title: string;
    }
}