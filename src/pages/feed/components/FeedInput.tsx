import {useEffect, useMemo, useRef, useState} from "react";
import {getPreSignedUrl, uploadToPreSignedUrl} from "../api/feed.ts";

interface FeedInputProps {
    client: any;
    connected: boolean;
}

type UploadType = "PROFILE" | "FEED";

type LocalFile = {
    id: string;
    file: File;
    name: string;
    type: string;
    size: number;
    status: "queued" | "uploading" | "done" | "error";
    progress: number; // 0~100 (XHR로만 정확히 가능, fetch는 제한적)
    objectKey?: string;
    errorMessage?: string;
    previewUrl?: string;
};

type UploadedAttachment = {
    objectKey: string;
    originalName: string;
    contentType: string;
    size: number;
};

function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    if (mb < 1024) return `${mb.toFixed(1)} MB`;
    return `${(mb / 1024).toFixed(1)} GB`;
}

export function FeedInput({ client, connected }: FeedInputProps) {
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [files, setFiles] = useState<LocalFile[]>([]);
    const filesRef = useRef<LocalFile[]>([]);
    const [fileError, setFileError] = useState<string | null>(null);

    const fileRef = useRef<HTMLInputElement | null>(null);
    const userId = Number(localStorage.getItem("userId"));

    const canSubmit = useMemo(() => {
        const hasTextOrFiles = !!content.trim() || files.length > 0;
        const notBusy = connected && !submitting;
        // 업로드 중이면 막고 싶으면 아래 조건 추가
        const allReady = files.every((f) => f.status !== "uploading");
        return notBusy && hasTextOrFiles && allReady;
    }, [connected, submitting, content, files]);

    useEffect(() => {
        filesRef.current = files;
    }, [files]);

    const handlePickFiles = () => fileRef.current?.click();

    const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFileError(null);
        const picked = Array.from(e.target.files ?? []);
        e.target.value = "";
        if (picked.length === 0) return;

        // 정책 (원하는대로 조정)
        const MAX_FILES = 5;
        const MAX_EACH = 20 * 1024 * 1024; // 파일당 20MB
        const MAX_TOTAL = 60 * 1024 * 1024; // 총 60MB

        if (files.length + picked.length > MAX_FILES) {
            setFileError(`파일은 최대 ${MAX_FILES}개까지 업로드할 수 있어요.`);
            return;
        }

        const tooBig = picked.find((f) => f.size > MAX_EACH);
        if (tooBig) {
            setFileError(
                `"${tooBig.name}" 파일이 너무 커요. 파일당 ${formatBytes(MAX_EACH)} 이하만 가능해요.`
            );
            return;
        }

        const total =
            files.reduce((s, f) => s + f.size, 0) + picked.reduce((s, f) => s + f.size, 0);
        if (total > MAX_TOTAL) {
            setFileError(`전체 파일 용량은 ${formatBytes(MAX_TOTAL)} 이하만 가능해요.`);
            return;
        }

        const next: LocalFile[] = picked.map((file) => {
            const isImage = file.type.startsWith("image/");
            return {
                id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(16).slice(2)}`,
                file,
                name: file.name,
                type: file.type || "application/octet-stream",
                size: file.size,
                status: "queued",
                progress: 0,
                previewUrl: isImage ? URL.createObjectURL(file) : undefined,
            }
        });

        // 단순 중복 제거(같은 name+size+lastModified)
        setFiles((prev) => {
            const key = (f: { name: string; size: number; file?: File }) =>
                `${f.name}|${f.size}|${(f as any).file?.lastModified ?? ""}`;
            const prevKeys = new Set(prev.map((p) => key(p)));
            return [...prev, ...next.filter((n) => !prevKeys.has(key(n)))];
        });
    };

    const revokePreview = (f: LocalFile) => {
        if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    };

    const removeFile = (id: string) => {
        setFiles((prev) => {
            const target = prev.find((f) => f.id === id);
            if (target) revokePreview(target);
            return prev.filter((f) => f.id !== id);
        });
        setFileError(null);
    };

    const clearFiles = () => {
        setFiles((prev) => {
            prev.forEach(revokePreview);
            return [];
        });
        setFileError(null);
    };

// 컴포넌트 언마운트 시에도 정리
    useEffect(() => {
        return () => {
            filesRef.current.forEach(revokePreview);
        };
    }, []);


    // 여러 파일 병렬 업로드(동시성 제한 포함)
    const uploadAllFiles = async (type: UploadType): Promise<UploadedAttachment[]> => {
        const queued = filesRef.current.filter((f) => f.status === "queued");
        if (queued.length === 0) return [];

        // queued -> uploading
        setFiles((prev) =>
            prev.map((f) => (f.status === "queued" ? { ...f, status: "uploading", progress: 0 } : f))
        );

        const results = await Promise.allSettled(
            queued.map(async (current) => {
                const safeName = current.name;
                const preSign = await getPreSignedUrl(type, safeName);
                if (!preSign.ok) throw { id: current.id, message: preSign.message };

                const { uploadUrl, objectKey } = preSign.result;
                const uploadRes = await uploadToPreSignedUrl(uploadUrl, current.file);
                if (!uploadRes.ok) throw { id: current.id, message: "파일 업로드 실패" };

                return {
                    id: current.id,
                    objectKey,
                    originalName: current.name,
                    contentType: current.type || "application/octet-stream",
                    size: current.size,
                };
            })
        );

        const successById = new Map<string, any>();
        const errorById = new Map<string, string>();

        results.forEach((r) => {
            if (r.status === "fulfilled") successById.set(r.value.id, r.value);
            else errorById.set(r.reason.id, r.reason.message || "업로드 실패");
        });

        // uploading -> done/error
        setFiles((prev) =>
            prev.map((f) => {
                const s = successById.get(f.id);
                if (s) return { ...f, status: "done", progress: 100, objectKey: s.objectKey };
                const em = errorById.get(f.id);
                if (em) return { ...f, status: "error", progress: 0, errorMessage: em };
                return f;
            })
        );

        if (errorById.size > 0) {
            throw new Error("일부 파일 업로드에 실패했어요.");
        }

        return Array.from(successById.values()).map((s) => ({
            objectKey: s.objectKey,
            originalName: s.originalName,
            contentType: s.contentType,
            size: s.size,
        }));
    };

    const handleSubmit = async () => {
        const text = content.trim();
        if (!connected || submitting) return;
        if (!text && files.length === 0) return;

        setSubmitting(true);
        setFileError(null);

        try {
            const attachments =
                filesRef.current.some((f) => f.status === "queued")
                    ? await uploadAllFiles("FEED")
                    : filesRef.current
                        .filter((f) => f.status === "done" && f.objectKey)
                        .map((f) => ({
                            objectKey: f.objectKey!,
                            originalName: f.name,
                            contentType: f.type,
                            size: f.size,
                        }));

            client.current.publish({
                destination: "/app/feed",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ content: text, authorId: userId, attachments }),
            });

            setContent("");
            clearFiles();
        } catch (e: any) {
            setFileError(e?.message || "등록 실패");
        } finally {
            setSubmitting(false);
        }
    };

    const retryFailedUploads = async () => {
        setSubmitting(true);
        setFileError(null);

        // error -> queued로 되돌리고 재업로드
        setFiles((prev) =>
            prev.map((f) => (f.status === "error" ? { ...f, status: "queued", errorMessage: undefined } : f))
        );

        try {
            await uploadAllFiles("FEED");
        } finally {
            setSubmitting(false);
        }
    };

    const uploadingCount = files.filter((f) => f.status === "uploading").length;

    return (
        <div className="relative rounded-lg border p-3">
            <input
                ref={fileRef}
                type="file"
                multiple
                accept="*"
                className="hidden"
                onChange={handleChangeFile}
            />

            {files.length > 0 && (
                <div className="mb-2 space-y-2">
                    {files.map((f) => {
                        const isImage = (f.type || "").startsWith("image/");
                        const ext = f.name.split(".").pop()?.toUpperCase() ?? "FILE";

                        return (
                            <div key={f.id} className="flex items-center gap-3">
                                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border bg-white">
                                    {isImage && f.previewUrl ? (
                                        <img
                                            src={f.previewUrl}
                                            alt={f.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-[10px] text-gray-600">
                                            {ext}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-700 truncate">{f.name}</p>
                                    <p className="text-[11px] text-gray-500">
                                        {f.type || "unknown"} · {formatBytes(f.size)}
                                        {f.status === "uploading" && " · 업로드 중"}
                                        {f.status === "done" && " · 완료"}
                                        {f.status === "error" && " · 실패"}
                                    </p>
                                    {f.status === "error" && (
                                        <p className="text-[11px] text-red-600 mt-0.5">{f.errorMessage}</p>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeFile(f.id)}
                                        disabled={submitting || f.status === "uploading"}
                                        className="text-xs text-red-600 hover:underline disabled:opacity-40"
                                    >
                                        제거
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    <div className="flex items-center justify-between">
                        <p className="text-[11px] text-gray-500">
                            총 {files.length}개 · {formatBytes(files.reduce((s, f) => s + f.size, 0))}
                            {uploadingCount > 0 && ` · 업로드중 ${uploadingCount}개`}
                        </p>
                        <div className="flex items-center gap-3">
                            {files.some((f) => f.status === "error") && (
                                <button
                                    type="button"
                                    onClick={retryFailedUploads}
                                    disabled={submitting || !connected}
                                    className="text-xs text-gray-700 hover:underline disabled:opacity-40"
                                >
                                    실패한 파일 재시도
                                </button>
                            )}
                            {/*<button*/}
                            {/*    type="button"*/}
                            {/*    onClick={clearFiles}*/}
                            {/*    disabled={submitting || uploadingCount > 0}*/}
                            {/*    className="text-xs text-gray-600 hover:underline disabled:opacity-40"*/}
                            {/*>*/}
                            {/*    모두 제거*/}
                            {/*</button>*/}
                        </div>
                    </div>
                </div>
            )}

            {fileError && <p className="mb-2 text-xs text-red-600">{fileError}</p>}

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="의견이나 생각을 남겨보세요"
                rows={2}
                className="w-full rounded-lg p-3 pr-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                    if (e.nativeEvent.isComposing) return;
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                    }
                }}
            />

            <div className="absolute right-4 top-4 flex items-center gap-2">
                <button
                    type="button"
                    onClick={handlePickFiles}
                    disabled={submitting || !connected}
                    className="rounded-full border px-3 py-1.5 text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition"
                    title="파일 추가"
                >
                    파일
                </button>

                <button
                    type="button"
                    disabled={!canSubmit}
                    onClick={handleSubmit}
                    className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white disabled:opacity-40 hover:bg-blue-700 transition"
                >
                    등록
                </button>
            </div>
        </div>
    );
}