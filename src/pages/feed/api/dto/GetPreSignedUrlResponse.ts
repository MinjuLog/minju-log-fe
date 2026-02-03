export default interface GetPreSignedUrlResponse {
    ok: true;
    result: {
        objectKey: string;
        uploadUrl: string;
    }
}