import type ErrorResponse from "../../../api/type/ErrorResponse.ts";
import {api} from "./api.ts";
import axios from "axios";
import type GetWorkspaceInfoResponse from "./dto/GetWorkspaceInfoResponse.ts";

export const getWorkspaceInfo = async (
    workspaceId: number
): Promise<GetWorkspaceInfoResponse | ErrorResponse> => {
    try {
        const res = await api.get(`/api/workspaces/${workspaceId}`);
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

export const incrementLike = async (
    workspaceId: number,
    delta: number,
    userId: number,
): Promise<GetWorkspaceInfoResponse | ErrorResponse> => {
    try {
        const res = await api.patch(
            `/api/workspaces/${workspaceId}/like-count`,
            { delta }, // ✅ request body
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
                message: error.response?.data?.message ?? "알 수 없는 오류",
            };
        }

        return {
            ok: false,
            message: "네트워크 오류 발생",
        };
    }
};
