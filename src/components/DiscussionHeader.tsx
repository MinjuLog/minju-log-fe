export default function DiscussionHeader() {
    return (
        <div className="flex items-start justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold text-foreground">동네한표</h1>
                <p className="text-lg text-muted-foreground">뜨거운 논쟁에 대해 투표하고 토론하기</p>
            </div>
            <button
                className="px-6 py-2.5 rounded-lg border border-border hover:bg-secondary transition-colors text-sm font-medium">
                동네한표 프로필
            </button>
        </div>
    )
}