export default function DiscussionCardSkeleton() {
    return (
        <div
            className="relative overflow-hidden rounded-2xl bg-gray-200/60 p-6 flex flex-col justify-between min-h-[350px] animate-pulse"
        >
            <div>
                <div className="h-4 w-32 bg-gray-300 rounded mb-4" />
                <div className="h-7 w-40 bg-gray-300 rounded mb-2" />
                <div className="h-7 w-24 bg-gray-300 rounded" />
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 bg-gray-300 rounded-full" />
                    <span className="h-4 w-16 bg-gray-300 rounded" />
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-gray-300 rounded-lg">
                    <div className="w-4 h-4 bg-gray-200 rounded" />
                    <span className="h-4 w-14 bg-gray-200 rounded" />
                </div>
            </div>
        </div>
    );
}