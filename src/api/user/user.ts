import axios from "axios";
import {api} from "../api.ts";
import type CreateUserResponse from "./type/CreateUserResponse.ts";
import type ErrorResponse from "../type/ErrorResponse.ts";

export const createUser = async (): Promise<CreateUserResponse | ErrorResponse> => {
    try {
        const res = await api.post(`/api/users`);

        return {
            ok: true,
            ...res.data,
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