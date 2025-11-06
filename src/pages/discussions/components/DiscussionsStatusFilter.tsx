import type DiscussionStatusType from "../types/DiscussionStatusType.ts";

interface props {
    status: DiscussionStatusType[];
    selectedStatus: number;
    setSelectedStatus: (selectedStatus: number) => void;
}

export default function DiscussionsStatusFilter({ status, selectedStatus, setSelectedStatus } : props) {
    return (
        <div className="my-6">
            <div className="flex flex-wrap gap-2">
                {status.map((status: DiscussionStatusType) => (
                    <button
                        key={status.id}
                        onClick={() => setSelectedStatus(status.id)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                            selectedStatus === status.id
                                ? "bg-gray-800 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        {status.text}

                    </button>
                ))}
            </div>
        </div>
    )
}