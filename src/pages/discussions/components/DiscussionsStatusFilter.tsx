import type { DiscussionStatusType } from "../types/DiscussionStatusType";

interface Props {
    status: Record<DiscussionStatusType, string>;
    selectedStatus: DiscussionStatusType;
    setSelectedStatus: (selectedStatus: DiscussionStatusType) => void;
}

export default function DiscussionsStatusFilter({
                                                    status,
                                                    selectedStatus,
                                                    setSelectedStatus,
                                                }: Props) {
    return (
        <div className="my-6">
            <div className="flex flex-wrap gap-2">
                {Object.entries(status).map(([key, label]) => {
                    const statusKey = key as DiscussionStatusType;

                    return (
                        <button
                            key={statusKey}
                            onClick={() => setSelectedStatus(statusKey)}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                selectedStatus === statusKey
                                    ? "bg-gray-800 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}