import type ErrorResponse from "../../../api/type/ErrorResponse.ts";
import axios from "axios";
import type GetFeedListResponse from "./GetFeedListResponse.ts";
import type GetOnlineUserList from "./GetOnlineUserList.ts";
import {api} from "./api.ts";
import type GetPreSignedUrlResponse from "./GetPreSignedUrlResponse.ts";
import type GetReactionPressedUsersResponse from "./GetReactionPressedUsersResponse.ts";

export const getFeedList = async (
    userId: number
): Promise<GetFeedListResponse | ErrorResponse> => {
    try {
        const res = await api.get(`/api/feeds`,
            {
                headers: {
                    'X-User-Id': userId
                }
            });
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
            file,
            {
                headers: {
                    "Content-Type": file.type,
                },
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

export const getReactionPressedUsers = async (
    userId: number,
    feedId: number,
    reactionKey: string,
): Promise<GetReactionPressedUsersResponse | ErrorResponse> => {
    try {
        const res = await api.get(
            `/api/feeds/${feedId}/reactions/${reactionKey}/users`,
            {
                headers: {
                    "X-User-Id": userId,
                },
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