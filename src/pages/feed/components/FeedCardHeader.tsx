import { formatKoreanDate } from "../../../utils/formatKoreanDate";

type Props = {
    authorName: string;
    timestamp: string;
    isMine: boolean;
    isDeleting: boolean;
    onDelete: () => void;
};

export default function FeedCardHeader({
    authorName,
    timestamp,
    isMine,
    isDeleting,
    onDelete,
}: Props) {
    return (
        <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-3">
                <div>
                    <div className="font-medium text-gray-900 flex items-center gap-2">
                        {authorName}
                        {isMine && (
                            <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                                내 피드
                            </span>
                        )}
                    </div>
                    <div className="text-xs text-gray-500">{formatKoreanDate(timestamp)}</div>
                </div>
            </div>
            {isMine && (
                <button
                    type="button"
                    onClick={onDelete}
                    disabled={isDeleting}
                    className="
                        opacity-0 group-hover:opacity-100
                        transition
                        text-gray-400 hover:text-red-500
                        text-sm
                        px-2 py-1
                        disabled:opacity-50 disabled:cursor-not-allowed
                    "
                    aria-label="Delete feed"
                    title="삭제"
                >
                    {isDeleting ? "..." : "X"}
                </button>
            )}
        </div>
    );
}
