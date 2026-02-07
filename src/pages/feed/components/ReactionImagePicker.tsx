import { useEffect, useRef, useState } from "react";
import {createCustomEmoji, getCustomEmojis, getPreSignedUrl, uploadToPreSignedUrl} from "../api/feed";

type CustomEmoji = {
    reactionKey: string;
    objectKey: string;
};

const STATIC_HOST = import.meta.env.VITE_STATIC_HOST;

type Props = {
    title?: string;
    onSelect?: (emoji: CustomEmoji) => void;
    handleReactionSubmit: ({ reactionKey, objectKey, emojiType }: { reactionKey: string, objectKey: string, emojiType: "DEFAULT" | "CUSTOM" }) => void;
};

type PendingUpload = {
    file: File;
    previewUrl: string;
    uploading: boolean;
    reactionKey: string;
    error?: string;
};

const makeDefaultReactionKey = (fileName: string) => {
    const base = fileName.replace(/\.[^/.]+$/, ""); // 확장자 제거
    return base
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_")          // 공백 -> _
        .replace(/[^a-z0-9_]+/g, "")   // 안전 문자만
        .slice(0, 64);                 // DB reaction_key varchar(64)
};


export function ReactionImagePicker({ title = "커스텀 이모지 선택", onSelect, handleReactionSubmit }: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [open, setOpen] = useState(false);
    const [customEmojis, setCustomEmojis] = useState<CustomEmoji[]>([]);

    // 업로드 전 확인 모달 상태
    const [pending, setPending] = useState<PendingUpload | null>(null);

    const fetchCustomEmojis = async () => {
        const res = await getCustomEmojis();
        if (!res?.ok) return;
        setCustomEmojis(res.result ?? []);
    };

    useEffect(() => {
        if (!open) return;
        void fetchCustomEmojis();
    }, [open]);

    const openFileDialog = () => inputRef.current?.click();
    const close = () => setOpen(false);

    const toUrl = (objectKey: string) => {
        const host = String(STATIC_HOST ?? "").replace(/\/$/, "");
        const key = objectKey.replace(/^\//, "");
        return `${host}/${key}`;
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        setPending({
            file,
            previewUrl,
            uploading: false,
            reactionKey: makeDefaultReactionKey(file.name),
        });

        e.target.value = "";
    };


    const cancelPending = () => {
        if (pending?.previewUrl) URL.revokeObjectURL(pending.previewUrl);
        setPending(null);
    };

    const confirmUpload = async () => {
        if (!pending) return;

        const rk = pending.reactionKey.trim();

        // 규칙 위반 → "다시 시도" 안내
        if (!rk || !/^[a-z0-9_]{1,64}$/i.test(rk)) {
            setPending((p) =>
                p
                    ? {
                        ...p,
                        uploading: false,
                        error: "이모지 ID 형식이 올바르지 않습니다. 영문/숫자/언더스코어만 사용해야 합니다.",
                    }
                    : p
            );
            return;
        }

        setPending((p) => (p ? { ...p, uploading: true, error: undefined, reactionKey: rk } : p));

        // 1) presigned 받기
        const presigned = await getPreSignedUrl("CUSTOM_EMOJI", pending.file.name);
        if (!presigned.ok) {
            setPending((p) =>
                p
                    ? {
                        ...p,
                        uploading: false,
                        error: "업로드 준비에 실패했습니다.",
                    }
                    : p
            );
            return;
        }

        const { uploadUrl, objectKey } = presigned.result;

        // 2) presigned로 업로드
        try {
            await uploadToPreSignedUrl(uploadUrl, pending.file);
        } catch (err) {
            console.error(err);
            setPending((p) =>
                p
                    ? {
                        ...p,
                        uploading: false,
                        error: "업로드에 실패했습니다.",
                    }
                    : p
            );
            return;
        }

        // 3) 서버에 커스텀 이모지 등록
        const created = await createCustomEmoji({ objectKey, reactionKey: rk });
        if (!created.ok) {
            setPending((p) =>
                p
                    ? {
                        ...p,
                        uploading: false,
                        error: "이모지 ID가 중복입니다.",
                    }
                    : p
            );
            return;
        }

        // 4) 목록 갱신
        await fetchCustomEmojis();

        // 5) 정리 + 닫기
        cancelPending();
    };


    return (
        <div className="relative">
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileChange}
            />

            <button
                type="button"
                onClick={async() => {
                    setOpen((v) => !v);
                    await fetchCustomEmojis()
                }}
                className="
          flex items-center gap-1
          px-2 py-1
          rounded-full
          border border-dashed border-gray-300
          bg-white
          text-xs text-gray-600
          hover:bg-gray-50
          transition
          cursor-pointer
        "
                aria-label="커스텀 이모지 피커 열기"
                title="커스텀 이미지 피커"
            >
                <span className="text-sm">📸</span>
            </button>

            {open && (
                <div className="absolute z-50 bottom-full mb-2 w-[360px]">
                    <div className="rounded-2xl border border-gray-200 bg-white shadow-lg">
                        {/* 헤더 */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-900">{title}</span>
                                <span className="text-xs text-gray-500">이미 업로드된 이모지를 선택하거나 +로 추가</span>
                            </div>

                            <button type="button" onClick={close} className="text-xs text-gray-500 hover:text-gray-800">
                                닫기
                            </button>
                        </div>

                        {/* 본문 */}
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs text-gray-700">업로드된 커스텀 이모지</p>
                                <button
                                    type="button"
                                    onClick={openFileDialog}
                                    className="
                    inline-flex items-center justify-center
                    h-8 w-8
                    rounded-full
                    border border-dashed border-gray-300
                    bg-white
                    text-gray-700
                    hover:bg-gray-50
                  "
                                    aria-label="이모지 추가"
                                    title="이모지 추가"
                                >
                                    <span className="text-base leading-none">+</span>
                                </button>
                            </div>

                            <div
                                className="
                  grid grid-cols-4 gap-2
                  rounded-xl border border-gray-100 bg-gray-50 p-2
                  max-h-48 overflow-auto
                "
                            >
                                {customEmojis.length === 0 ? (
                                    <div className="col-span-4 py-8 text-center text-xs text-gray-400">
                                        커스텀 이모지가 없습니다.
                                    </div>
                                ) : (
                                    customEmojis.map((e) => (
                                        <button
                                            key={e.reactionKey}
                                            type="button"
                                            onClick={() => {
                                                onSelect?.(e);
                                                setOpen(false);
                                                handleReactionSubmit({ reactionKey: e.reactionKey, objectKey: e.objectKey, emojiType: "CUSTOM" });
                                            }}
                                            className="
                                                group relative aspect-square overflow-hidden rounded-lg
                                                border border-gray-100 bg-white
                                                hover:ring-2 hover:ring-gray-300
                                                transition
                                              "
                                            title={e.reactionKey}
                                        >
                                            <img
                                                src={toUrl(e.objectKey)}
                                                alt={e.reactionKey}
                                                className="h-full w-full object-contain p-2"
                                                loading="lazy"
                                                onError={(ev) => {
                                                    (ev.currentTarget as HTMLImageElement).style.display = "none";
                                                }}
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 bg-black/40 px-1 py-0.5 text-[10px] text-white truncate opacity-0 group-hover:opacity-100 transition">
                                                {e.reactionKey}
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 업로드 전 미리보기/확인 오버레이 */}
                    {pending && (
                        <div className="absolute inset-0 z-60 flex items-center justify-center">
                            <div className="absolute inset-0 bg-black/30 rounded-2xl" onClick={pending.uploading ? undefined : cancelPending} />
                            <div className="relative w-[320px] rounded-2xl bg-white shadow-xl border border-gray-200 p-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-900">이모지 업로드</p>
                                    <button
                                        type="button"
                                        onClick={cancelPending}
                                        disabled={pending.uploading}
                                        className="text-xs text-gray-500 hover:text-gray-800 disabled:text-gray-300"
                                    >
                                        닫기
                                    </button>
                                </div>

                                <div className="mt-2 rounded-xl border border-gray-100 bg-gray-50 overflow-hidden">
                                    <img
                                        src={pending.previewUrl}
                                        alt="preview"
                                        className="h-40 w-full object-contain p-2"
                                    />
                                </div>

                                {pending.error && (
                                    <p className="mt-2 text-xs text-red-600">{pending.error}</p>
                                )}

                                <div className="mt-3">
                                    <label className="block text-xs text-gray-700 mb-1">이모지 ID</label>
                                    <input
                                        value={pending.reactionKey}
                                        disabled={pending.uploading}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            setPending((p) => (p ? { ...p, reactionKey: v } : p));
                                        }}
                                        onBlur={() => {
                                            // blur 시 안전하게 정규화(선택)
                                            setPending((p) => {
                                                if (!p) return p;
                                                const normalized = p.reactionKey
                                                    .trim()
                                                    .slice(0, 64);
                                                return { ...p, reactionKey: normalized };
                                            });
                                        }}
                                        placeholder="예: party_parrot"
                                        className="
                                                      w-full rounded-xl border border-gray-200 bg-white
                                                      px-3 py-2 text-sm text-gray-900
                                                      focus:outline-none focus:ring-2 focus:ring-gray-300
                                                      disabled:bg-gray-50 disabled:text-gray-400
                                                    "
                                    />
                                    <p className="mt-1 text-[11px] text-gray-400">
                                        영문/숫자/언더스코어만 권장, 최대 64자
                                    </p>
                                </div>

                                <div className="mt-3 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={cancelPending}
                                        disabled={pending.uploading}
                                        className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 disabled:text-gray-300 disabled:hover:bg-white"
                                    >
                                        취소
                                    </button>

                                    <button
                                        type="button"
                                        onClick={confirmUpload}
                                        disabled={pending.uploading || !pending.reactionKey.trim()}
                                        className="flex-1 rounded-xl bg-gray-900 px-3 py-2 text-xs text-white hover:bg-black disabled:bg-gray-300 disabled:hover:bg-gray-300"
                                    >
                                        {pending.uploading ? "업로드 중..." : "확인"}
                                    </button>

                                </div>


                                <p className="mt-2 text-[11px] text-gray-400">
                                    확인을 누르면 서버에 업로드
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
