import type ErrorResponse from "../type/ErrorResponse.ts";
import {api} from "../api.ts";
import axios from "axios";
import type getSignatureListResponse from "./type/GetSignatureListResponse.ts";

export const getSignatureList = async (
    proposalId: number,
    page: number = 0,
    size: number = 10,
): Promise<getSignatureListResponse | ErrorResponse> => {
    try {
        const res = await api.get(`/api/proposals/${proposalId}/signatures`, {
            params: {
                page, size
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