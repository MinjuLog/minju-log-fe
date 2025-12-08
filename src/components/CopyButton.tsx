import { Share2, Check } from "lucide-react";
import { useState } from "react";

function Toast({ message }: { message: string }) {
    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg shadow-lg z-50 opacity-90">
            {message}
        </div>
    );
}

export default function CopyButton() {
    const [copied, setCopied] = useState(false);
    const [toast, setToast] = useState("");

    const handleLinkCopy = async () => {
        const url = window.location.href;

        try {
            await navigator.clipboard.writeText(url);

            setCopied(true);
            setToast("링크가 복사되었습니다. 다른 이웃들에게 공유해주세요!");

            setTimeout(() => {
                setCopied(false);
            }, 1500);

            setTimeout(() => {
                setToast("");
            }, 2000);
        } catch (err) {
            setToast("링크 복사에 실패했습니다.");
            setTimeout(() => setToast(""), 2000);
            console.log(err);
        }
    };

    return (
        <>
            <button
                onClick={handleLinkCopy}
                className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
            >
                {copied ? (
                    <Check className="h-5 w-5 text-gray-600 transition-all duration-200" />
                ) : (
                    <Share2 className="h-5 w-5 text-gray-600" />
                )}
            </button>

            {toast && <Toast message={toast} />}
        </>
    );
}