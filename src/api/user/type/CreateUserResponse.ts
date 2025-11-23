export default interface CreateUserResponse {
    ok: true;
    timestamp: string;
    code: string;
    message: string;
    result: {
        userId: string;
        nickname: string;
        createdAt: string;
    };
}