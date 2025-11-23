import type CreateProposalRequest from "./type/CreateProposalRequest";
import type CreateProposalResponse from "./type/CreateProposalResponse";
import type ErrorResponse from "../type/ErrorResponse";
import type FindProposalListRequest from "./type/FindProposalListRequest";
import type FindProposalListResponse from "./type/FindProposalListResponse";
import { api } from "../api";
import axios from "axios";
import type FindProposalDetailResponse from "./type/FindProposalDetailResponse.ts";

export const createProposal = async (
    data: CreateProposalRequest
): Promise<CreateProposalResponse | ErrorResponse> => {
    try {
        // TODO 삭제
        if (data.selectedTopicId === -1) delete data.selectedTopicId;
        data.userId = 1;
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

export const findProposalDetail = async (
    id: number,
    userId: string
): Promise<FindProposalDetailResponse | ErrorResponse> => {
    try {
        const res = await api.get(`/api/proposals/${id}`, {
            params: {
                userId,
            },
        });

        const data = res.data;

        return {
            ok: true,
            result: data.result,
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