import type CreateProposalRequest from "./type/CreateProposalRequest.ts";
import axios from "axios";
import type CreateProposalResponse from "./type/CreateProposalResponse.ts";
import type ErrorResponse from "../type/ErrorResponse.ts";

export const createProposal = async (data: CreateProposalRequest): Promise<CreateProposalResponse | ErrorResponse> => {
    try {
        const res = await axios.post("/api/proposal", data);
        return {
            ok: true,
            proposalId: res.data.result.proposalId,
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