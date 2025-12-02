import type ErrorResponse from "../type/ErrorResponse.ts";
import {api} from "../api.ts";
import axios from "axios";
import type getSignatureListResponse from "./type/GetSignatureListResponse.ts";
import type CreateSignatureResponse from "./type/CreateSignatureResponse.ts";

export const getSignatureList = async (
    proposalId: number,
    filter: "ALL" | "AGREE" | "DISAGREE" = "ALL",
    page: number = 0,
    size: number = 10,
): Promise<getSignatureListResponse | ErrorResponse> => {
    try {
        const res = await api.get(`/api/proposals/${proposalId}/signatures`, {
            params: {
                page, size, filter
            }
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

export const createSignature = async (
    proposalId: number,
    userId: number,
    nickname: string,
    signatureType: "AGREE" | "DISAGREE",
    content: string
): Promise<CreateSignatureResponse | ErrorResponse> => {
    try {
        const res = await api.post(`/api/proposals/${proposalId}/signatures`, {
            userId,
            signatureType,
            content,
            nickname,
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