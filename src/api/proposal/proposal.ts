import type CreateProposalRequest from "./type/CreateProposalRequest";
import type CreateProposalResponse from "./type/CreateProposalResponse";
import type ErrorResponse from "../type/ErrorResponse";
import type FindProposalListRequest from "./type/FindProposalListRequest";
import type FindProposalListResponse from "./type/FindProposalListResponse";
import { api } from "../api";
import axios from "axios";

export const createProposal = async (
    data: CreateProposalRequest
): Promise<CreateProposalResponse | ErrorResponse> => {
    try {
        const res = await api.post("/api/proposals", data);
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

export const findProposalList = async (
    option: FindProposalListRequest
): Promise<FindProposalListResponse | ErrorResponse> => {
    try {
        const res = await api.get("/api/proposals", {
            params: option,
        });
        const data = res.data;

        return {
            ok: true,
            totalPages: data.result.totalPages,
            totalElements: data.result.totalElements,
            content: data.result.content,
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