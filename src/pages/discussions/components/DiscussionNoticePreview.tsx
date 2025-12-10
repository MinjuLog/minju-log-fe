import { ChevronRight, Megaphone } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DiscussionNoticePreview() {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate("/notice")}
            className="border-1 bg-yellow-50 rounded-xl p-6
                       hover:bg-yellow-100
                       hover:shadow-lg
                       hover:scale-[1.02]
                       transition-all duration-300
                       cursor-pointer"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex gap-2 items-center">
                    <Megaphone className="w-5 h-5 text-yellow-700" />
                    <span className="text-sm text-yellow-700 font-medium">
                        공지사항
                    </span>
                </div>

                <span className="text-sm text-muted-foreground">공지</span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold mb-3">
                본 서비스의 개발 주체 및 운영 관련 안내
            </h3>

            {/* Description Preview */}
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                민주로그는 카카오 '테크포임팩트' 프로그램에 참여한 학생 팀이 개발한 프로젝트이며,
                옥천신문은 서비스 제작 및 운영에 관여하지 않습니다. 최근 사용자 게시글로 인해
                오해가 발생하여 이를 바로잡고자 안내드립니다.
            </p>

            {/* Footer */}
            <div className="flex justify-end mt-4">
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
        </div>
    );
}