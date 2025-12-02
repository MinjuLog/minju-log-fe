import type CreateVoteResponse from "./type/CreateVoteResponse";
import type ErrorResponse from "../type/ErrorResponse";
import { api } from "../api";
import axios from "axios";

export const createVote = async (
    proposalId: number,
    userId: number,
    voteType: "AGREE" | "DISAGREE"
): Promise<CreateVoteResponse | ErrorResponse> => {
    try {
        const res = await api.post(`/api/proposals/${proposalId}/votes`, {
            userId,
            voteType, // 서버에 vote 타입 전달
        });

        return {
            ok: true,
            result: res.data.result,
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                ok: false,
                message: error.response?.data?.message ?? "알 수 없는 오류",
            };
        }

        return {
            ok: false,
            message: "네트워크 오류 발생",
        };
    }
};