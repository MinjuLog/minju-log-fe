import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {BookOpen, Clock} from "lucide-react";
import type DiscussionCardType from "../types/DiscussionCardType.ts";

interface props {
    discussionCard: DiscussionCardType;
}

export default function DiscussionCard({ discussionCard }: props) {

    const { votesCount, title, timeLeft, isCountdown, bgColor, image } = discussionCard;

    const [countdown, setCountdown] = useState(timeLeft);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isCountdown) return;
        const interval = setInterval(() => {
            setCountdown(timeLeft);
        }, 1000);
        return () => clearInterval(interval);
    }, [isCountdown, timeLeft]);

    return (
        <div
            className={`relative overflow-hidden rounded-2xl ${bgColor} p-6 flex flex-col justify-between min-h-[350px] group hover:scale-[1.02] transition-transform duration-300`}
        >
            <div>
                <div className="text-sm font-medium text-white/90 mb-4">{votesCount}명 투표 중!</div>
                <h2 className="text-3xl font-bold text-white leading-tight mb-6">{title}</h2>
            </div>

            <div className="flex-1 flex items-center justify-center py-8">
                <img
                    src={image || "/placeholder.svg"}
                    alt=""
                    className="max-w-full h-auto object-contain"
                />
            </div>

            <div className="flex items-center justify-between text-white/90">
                <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{isCountdown ? countdown : timeLeft}</span>
                </div>

                {/* ✅ 참여하기 버튼 클릭 시 상세 페이지 이동 */}
                <button
                    onClick={() => navigate("/discussions/1")}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium backdrop-blur-sm"
                >
                    <BookOpen className="w-4 h-4" />
                    참여하기
                </button>
            </div>
        </div>
    );
}