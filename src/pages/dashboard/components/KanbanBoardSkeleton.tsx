export default function KanbanBoardSkeleton() {
    return (
        // 🔹 스켈레톤 UI
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-pulse">
            {[...Array(4)].map((_, colIdx) => (
                <div key={colIdx} className="space-y-4">
                    {/* Column Header */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-gray-300" />
                        <div className="h-5 w-28 bg-gray-300 rounded" />
                        <div className="ml-auto w-5 h-5 bg-gray-300 rounded-full" />
                    </div>

                    {/* Column Border */}
                    <div className="h-1 rounded-full bg-gray-200" />

                    {/* Project Card Skeletons */}
                    {[...Array(4)].map((_, idx) => (
                        <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-start justify-between mb-3">
                                <div className="h-4 w-16 bg-gray-200 rounded" />
                                <div className="h-4 w-20 bg-gray-200 rounded" />
                            </div>

                            <div className="h-5 w-3/4 bg-gray-300 rounded mb-3" />
                            <div className="h-4 w-1/2 bg-gray-200 rounded mb-4" />

                            <div className="h-32 w-full bg-gray-100 rounded mb-4" />

                            <div className="flex gap-3">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-4 w-10 bg-gray-200 rounded" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}