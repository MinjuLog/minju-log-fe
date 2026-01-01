import type ErrorResponse from "../../../api/type/ErrorResponse.ts";
import axios from "axios";
import type GetFeedListResponse from "./GetFeedListResponse.ts";
import type GetOnlineUserList from "./GetOnlineUserList.ts";
import {api} from "./api.ts";

export const getFeedList = async (
): Promise<GetFeedListResponse | ErrorResponse> => {
    try {
        const res = await api.get(`/api/feeds`);
        return {
            ok: true,
            result: res.data,
        }
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

export const getOnlineUserList = async (
): Promise<GetOnlineUserList | ErrorResponse> => {
    try {
        const res = await api.get(`/api/online-users`);
        return {
            ok: true,
            result: res.data,
        }
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