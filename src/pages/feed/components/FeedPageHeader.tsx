import ConnectionStatus from "./ConnectionStatus";

type Props = {
    totalElements: number;
    connected: boolean;
};

export default function FeedPageHeader({ totalElements, connected }: Props) {
    return (
        <div className="mb-6 flex items-start justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">전체 {totalElements}</h1>
                <p className="mt-1 text-sm text-gray-500">실시간 피드와 좋아요 업데이트를 수신합니다.</p>
            </div>
            <ConnectionStatus connected={connected} />
        </div>
    );
}
