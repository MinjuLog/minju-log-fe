export default interface ProjectType {
    id: string;
    categories: string[];
    date: string;
    title: string;
    description: string;
    votes: number;
    comments: number;
    topic?: {
        id: number;
        title: string;
    }
}