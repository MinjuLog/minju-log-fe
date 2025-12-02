export default function DiscussionPreviewSkeleton() {
    return (
        <div
            className="border-1 bg-secondary/20 rounded-xl p-6
                       transition-all duration-300
                       animate-pulse"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex gap-2">
                    <span className="h-4 w-16 bg-gray-200 rounded" />
                    <span className="h-4 w-14 bg-gray-200 rounded" />
                    <span className="h-4 w-12 bg-gray-200 rounded" />
                </div>
                <span className="h-4 w-20 bg-gray-200 rounded" />
            </div>

            <div className="mb-4">
                <div className="h-5 w-64 bg-gray-200 rounded mb-2" />
                <div className="h-5 w-40 bg-gray-200 rounded" />
            </div>

            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    <div className="px-4 py-2 rounded-lg border-2 border-gray-200">
                        <div className="h-4 w-28 bg-gray-200 rounded" />
                    </div>
                    <div className="px-4 py-2 rounded-lg border-2 border-gray-200">
                        <div className="h-4 w-28 bg-gray-200 rounded" />
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <div className="h-3 w-10 bg-gray-200 rounded mb-2" />
                        <div className="h-4 w-8 bg-gray-200 rounded mx-auto" />
                    </div>
                    <div className="text-center">
                        <div className="h-3 w-10 bg-gray-200 rounded mb-2" />
                        <div className="h-4 w-8 bg-gray-200 rounded mx-auto" />
                    </div>
                    <div className="w-5 h-5 bg-gray-200 rounded-full" />
                </div>
            </div>
        </div>
    );
}