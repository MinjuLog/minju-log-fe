import type ErrorResponse from "../../../api/type/ErrorResponse.ts";
import axios from "axios";
import type GetFeedListResponse from "./GetFeedListResponse.ts";
import type GetOnlineUserList from "./GetOnlineUserList.ts";
import {api} from "./api.ts";
import type GetPreSignedUrlResponse from "./GetPreSignedUrlResponse.ts";

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

export const getPreSignedUrl = async (
    uploadType: "FEED" | "PROFILE", fileName: string
): Promise<GetPreSignedUrlResponse | ErrorResponse> => {
    try {
        const res = await api.get(
            `/api/pre-signed-url`,
            { params: { uploadType, fileName } }
        );
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

export const uploadToPreSignedUrl = async (
    uploadUrl: string, file: File
): Promise<GetPreSignedUrlResponse | ErrorResponse> => {
    try {
        const res = await api.put(
            uploadUrl,
            {
                body: file,
            }
        );
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