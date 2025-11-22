export default interface CreateProposalRequest {
    userId: string | number;
    title: string;
    body: string;
    hashtags: string[];
    dueDate: string;
    selectedTopicId?: number;
}