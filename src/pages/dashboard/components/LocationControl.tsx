import { RefreshCw, Sliders } from "lucide-react";

interface Props {
    location: string;
    isLocLoading: boolean;
    handleRefreshLocation: () => Promise<void> | void;
}

export default function LocationControl({ location, isLocLoading, handleRefreshLocation }: Props) {

    const onRefreshClick = async () => {
        await handleRefreshLocation();
    };

    return (
        <div className="flex items-center justify-between">
            {/* 위치 새로고침 버튼 */}
            <button
                onClick={onRefreshClick}
                disabled={isLocLoading}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition
                            ${isLocLoading ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}
            >
                <RefreshCw
                    className={`w-4 h-4 transition-transform duration-500 
                                ${isLocLoading ? "animate-spin text-blue-500" : ""}`}
                />
                <span>{isLocLoading ? "위치 불러오는 중..." : location || "위치 새로고침"}</span>
            </button>

            {/* 정렬 버튼 */}
            <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                    <Sliders className="w-4 h-4" />
                    <span>정렬</span>
                </button>
            </div>
        </div>
    );
}