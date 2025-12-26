import { useState } from "react";

interface FeedInputProps {
    client: any;
    sendDest: string;
    connected: boolean;
}

export function FeedInput({ client, sendDest, connected }: FeedInputProps) {
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const userId = Number(localStorage.getItem("userId"));

    const handleSubmit = () => {
        const text = content.trim();
        if (!text || !connected || submitting) return;

        setSubmitting(true);

        client.current.publish({
            destination: sendDest,
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                content: text,
                authorId: userId,
            }),
        });

        setSubmitting(false);
        setContent("");
    };

    return (
        <div className="relative rounded-lg border mr-12 p-3">
            <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="의견이나 생각을 남겨보세요"
                rows={2}
                className="w-full rounded-lg p-3 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={e => {
                    // 한글/IME 조합 중이면 무시
                    if (e.nativeEvent.isComposing) return;

                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                    }
                }}
            />

            <button
                type="button"
                disabled={!content.trim() || submitting || !connected}
                onClick={handleSubmit}
                className="absolute right-4 top-4 rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white disabled:opacity-40 hover:bg-blue-700 transition"
            >
                등록
            </button>
        </div>
    );
}