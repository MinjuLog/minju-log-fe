import { useState } from "react";

export function FeedInput({ onSubmit }: { onSubmit: (content: string) => Promise<void> }) {
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!content.trim()) return;

        try {
            setSubmitting(true);
            await onSubmit(content);
            setContent("");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="relative rounded-lg border mr-12 bg-gray-100 p-3">
            {/* textarea */}
            <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="의견이나 생각을 남겨보세요"
                rows={2}
                className="w-full rounded-lg p-3 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* floating button */}
            <button
                type="button"
                disabled={!content.trim() || submitting}
                onClick={handleSubmit}
                className="absolute right-4 top-4 rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white disabled:opacity-40 hover:bg-blue-700 transition"
            >
                등록
            </button>
        </div>
    );
}