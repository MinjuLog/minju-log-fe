import type DiscussionPreviewType from "../types/DiscussionPreviewType.ts";
import {ChevronRight} from "lucide-react";
import {useNavigate} from "react-router-dom";

interface props {
    discussionPreview: DiscussionPreviewType;
}

export default function DiscussionPreview({ discussionPreview }: props) {
    const navigate = useNavigate();
    const { id, tags, title, round, result, percentage, votes, discussions } = discussionPreview;
    return (
        <div
            key={discussionPreview.id}
            onClick={() => navigate(`/discussions/${id}`)}
            className="border-1 bg-secondary/20 rounded-xl p-6
                                     hover:bg-secondary/60
                                     hover:shadow-lg
                                     hover:scale-[1.02]
                                     transition-all duration-300
                                     cursor-pointer"
        >
            {/* Tags and round */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex gap-2">
                    {tags.map((tag) => (
                        <span key={tag} className="text-sm text-muted-foreground font-medium">
                    {tag}
                  </span>
                    ))}
                </div>
                <span className="text-sm text-muted-foreground">{round} 라운드</span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold mb-4">{title}</h3>

            {/* Result and stats */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 rounded-lg border-2 border-red-400 text-red-500 font-medium">
                        {result} {percentage}
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">투표 수</div>
                        <div className="font-bold">{votes}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">토론 수</div>
                        <div className="font-bold">{discussions}</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground"/>
                </div>
            </div>
        </div>
    )
}