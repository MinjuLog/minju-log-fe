import type FeedType from "../types/FeedType";

type Props = {
    attachments: FeedType["attachments"];
};

const STATIC_HOST = import.meta.env.VITE_STATIC_HOST;

export default function FeedAttachments({ attachments }: Props) {
    if (!attachments.length) return null;

    return (
        <div className="mb-4 grid grid-cols-2 gap-2">
            {attachments.map((att) => {
                const url = STATIC_HOST + att.objectKey;
                const isImage = att.contentType?.startsWith("image/");
                const isVideo = att.contentType?.startsWith("video/");

                return (
                    <a
                        key={att.objectKey}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="block"
                    >
                        {isImage && (
                            <img
                                src={url}
                                alt={att.originalName ?? "attachment"}
                                className="w-full h-40 object-cover rounded-md border"
                                loading="lazy"
                            />
                        )}

                        {isVideo && (
                            <video
                                src={url}
                                controls
                                className="w-full h-40 rounded-md border object-cover"
                            />
                        )}

                        {!isImage && !isVideo && (
                            <div className="flex items-center h-10 rounded-md border bg-gray-50 hover:bg-gray-100">
                                <span className="text-sm text-gray-600 truncate px-2">
                                    📎 {att.originalName ?? "파일 다운로드"}
                                </span>
                            </div>
                        )}
                    </a>
                );
            })}
        </div>
    );
}
