import type ErrorResponse from "../../../api/type/ErrorResponse.ts";
import axios from "axios";
import type GetFeedListResponse from "./dto/GetFeedListResponse.ts";
import type GetOnlineUserList from "./dto/GetOnlineUserList.ts";
import {api} from "./api.ts";
import type GetPreSignedUrlResponse from "./dto/GetPreSignedUrlResponse.ts";
import type GetReactionPressedUsersResponse from "./dto/GetReactionPressedUsersResponse.ts";
import type GetCustomEmojiResponse from "./dto/GetCustomEmojiResponse.ts";
import type { AxiosResponse } from "axios";

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
    uploadType: "FEED" | "PROFILE" | "CUSTOM_EMOJI", fileName: string
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
    emojiKey: string,
): Promise<GetReactionPressedUsersResponse | ErrorResponse> => {
    try {
        const res = await api.get(
            `/api/feeds/${feedId}/reactions/${emojiKey}/users`,
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

export const getCustomEmojis = async (

): Promise<GetCustomEmojiResponse | ErrorResponse> => {
    try {
        const res = await api.get(
            `/api/custom-emojis`,
        );
        const rawList = Array.isArray(res.data?.customEmojis)
            ? res.data.customEmojis
            : Array.isArray(res.data)
                ? res.data
                : [];
        const mapped = rawList.map((item: { emojiKey?: string; reactionKey?: string; objectKey: string }) => ({
            emojiKey: item.emojiKey ?? item.reactionKey ?? "",
            objectKey: item.objectKey,
        }));
        return {
            ok: true,
            result: mapped,
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
}

export const createCustomEmoji = async (
    { emojiKey, objectKey }: { emojiKey: string; objectKey: string },
): Promise<GetCustomEmojiResponse | ErrorResponse> => {
    try {
        const res = await api.post(
            `/api/custom-emojis`,
            {
                objectKey,
                emojiKey,
            }
        );
        const created = res.data?.customEmoji ?? res.data;
        const parsedEmojiKey = created?.emojiKey ?? created?.reactionKey;
        const parsedObjectKey = created?.objectKey;
        if (!parsedEmojiKey || !parsedObjectKey) {
            return {
                ok: false,
                message: "커스텀 이모지 응답 형식이 올바르지 않습니다.",
            };
        }
        return {
            ok: true,
            result: [{
                emojiKey: parsedEmojiKey,
                objectKey: parsedObjectKey,
            }],
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
}

export const deleteFeed = async (
    userId: number,
    feedId: number,
): Promise<{ ok: true; result: AxiosResponse["data"] } | ErrorResponse> => {
    try {
        const res = await api.delete(
            `/api/feeds/${feedId}`,
            {
                headers: {
                    "X-User-Id": userId,
                },
            }
        );
        return {
            ok: true,
            result: res.data,
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                ok: false,
                message: error.response?.data?.message ?? "?????녿뒗 ?ㅻ쪟",
            };
        }

        return {
            ok: false,
            message: "네트워크 오류 발생",
        };
    }
};
