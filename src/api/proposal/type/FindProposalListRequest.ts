export default interface FindProposalListRequest {
    keyword: string;
    status: string;
    sort: string;
    pageable: {
        page: number;
        size: number;
        sort: string[];
    };
}