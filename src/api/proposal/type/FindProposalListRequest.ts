export default interface FindProposalListRequest {
    keyword: string;
    status: string;
    sort: string;
    page: number;
    size: number;
}