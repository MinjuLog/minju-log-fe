export default interface CreateVoteResponse {
    ok: true,
    result: {
        voteId: number;
        voteType: "AGREE" | "DISAGREE";
    };
}