export default interface DiscussionType {
    id: number;
    title: string;
    topic: {
        id: number;
        title: string;
    },
    content: string;
    duration: string;
    pros: number;
    cons: number;
}