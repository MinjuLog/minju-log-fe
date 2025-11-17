export default interface CreateProposalRequest {
    userId: string;
    title: string;
    body: string;
    hashTags: string[];
    dueDate: string;
    topicId?: number;
}