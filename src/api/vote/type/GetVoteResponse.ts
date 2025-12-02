export default interface GetVoteResponse {
    ok: true,
    result: {
        voteId: number;
        voteType: "AGREE" | "DISAGREE";
    };
}