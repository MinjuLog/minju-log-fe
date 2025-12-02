import { RefreshCw, Sliders } from "lucide-react";

interface Props {
    location: string;
    isLocLoading: boolean;
    handleRefreshLocation: () => Promise<(() => void) | undefined>
    sortOrder?: string
    setSortOrder?: (sortOrder: "최신순" | "인기순") => void
}

export default function LocationControl({ location, isLocLoading, handleRefreshLocation, sortOrder, setSortOrder }: Props) {

    const onRefreshClick = async () => {
        await handleRefreshLocation();
    };

    const onSortClick = () => {
        if (!setSortOrder) return;
        setSortOrder(sortOrder === '최신순' ? '인기순' : '최신순');
    }

    return (
        <div className="flex items-center justify-between mb-6">
            {/* 위치 새로고침 버튼 */}
            <button
                onClick={onRefreshClick}
                disabled={isLocLoading}
                className={`flex items-center gap-2 p-2 rounded-lg transition
                            ${isLocLoading ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}
            >
                <RefreshCw
                    className={`w-4 h-4 transition-transform duration-500 
                                ${isLocLoading ? "animate-spin text-blue-500" : ""}`}
                />
                <span>{isLocLoading ? "위치 불러오는 중..." : location || "위치 새로고침"}</span>
            </button>

            {/* 정렬 버튼 */}
            {
                sortOrder && (
                    <div className="flex gap-3">
                        <button onClick={onSortClick}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                            <Sliders className="w-4 h-4"/>
                            <span>{sortOrder}</span>
                        </button>
                    </div>
                )
            }

        </div>
    );
}