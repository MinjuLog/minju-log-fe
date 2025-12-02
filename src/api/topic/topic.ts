import type ErrorResponse from "../type/ErrorResponse.ts";
import {api} from "../api.ts";
import axios from "axios";
import type GetTopicListResponse from "./type/GetTopicListResponse.ts";
import type GetTopicDetailResponse from "./type/GetTopicDetailResponse.ts";

export const getTopicList = async (): Promise<GetTopicListResponse | ErrorResponse> => {
    try {
        const res = await api.get(`/api/topics`);
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

export const getTopicDetail = async (
    id: number
): Promise<GetTopicDetailResponse | ErrorResponse> => {
    try {
        const res = await api.get(`/api/topics/${id}`);
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
}