// components/FeedSkeleton.tsx
interface FeedSkeletonProps {
    count?: number;
    isMine?: boolean; // 선택: 내 피드처럼 보더 진하게도 가능
}

function SkeletonLine({ w }: { w: string }) {
    return <div className={`h-3 ${w} rounded bg-gray-200 animate-pulse`} />;
}

function SkeletonCircle() {
    return <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />;
}

export default function FeedSkeleton({ count = 5, isMine = false }: FeedSkeletonProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, idx) => (
                <div
                    key={idx}
                    className={`rounded-lg border p-4 mr-12 bg-gray-100 ${
                        isMine ? "border-gray-600" : "border-gray-200"
                    }`}
                >
                    {/* Header */}
                    <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <SkeletonCircle />
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-24 rounded bg-gray-200 animate-pulse" />
                                    <div className="h-4 w-12 rounded bg-gray-200 animate-pulse" />
                                </div>
                                <div className="h-3 w-28 rounded bg-gray-200 animate-pulse" />
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="mb-4 space-y-2">
                        <SkeletonLine w="w-full" />
                        <SkeletonLine w="w-11/12" />
                        <SkeletonLine w="w-9/12" />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
                            <div className="h-3 w-6 rounded bg-gray-200 animate-pulse" />
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}