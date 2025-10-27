import { Info, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import type VotingOptionType from "../types/VotingOptionType.ts";

interface Props {
    votingOptions: VotingOptionType[];
}

export default function MainVotes({ votingOptions }: Props) {
    const [timeLeft, setTimeLeft] = useState({
        hours: 6,
        minutes: 18,
        seconds: 49,
    });

    const [selectedId, setSelectedId] = useState<number | null>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                let { hours, minutes, seconds } = prev;

                if (seconds > 0) {
                    seconds--;
                } else if (minutes > 0) {
                    minutes--;
                    seconds = 59;
                } else if (hours > 0) {
                    hours--;
                    minutes = 59;
                    seconds = 59;
                }

                return { hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-8 shadow-sm">
                {/* Header */}
                <div className="mb-8 flex items-start justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                        <span className="text-lg font-medium">112 라운드</span>
                        <Info className="h-5 w-5" />
                    </div>
                    <button className="rounded-lg p-2 hover:bg-gray-100">
                        <Share2 className="h-5 w-5 text-gray-600" />
                    </button>
                </div>

                {/* Title */}
                <h1 className="mb-12 text-center text-3xl font-bold leading-tight text-gray-900">
                    청년 예산 삭감
                    <br />
                    향후 진행 방향은?
                </h1>

                {/* Voting Options Grid */}
                <div className="mb-8 grid grid-cols-2 gap-4">
                    {votingOptions.map((option) => {
                        const isSelected = selectedId === option.id;
                        return (
                            <button
                                key={option.id}
                                onClick={() => setSelectedId(option.id)}
                                className={`group relative flex min-h-[120px] flex-col items-center justify-center gap-3 rounded-2xl p-6 transition-all ${option.color} ${
                                    isSelected ? "ring-4 ring-offset-2 ring-gray-100" : ""
                                }`}
                            >
                                {/* Icon */}
                                <div className={`text-6xl ${option.iconColor}`}>
                                    {!isSelected &&
                                        (option.id === 1
                                            ? "🔴"
                                            : option.id === 2
                                                ? "🟠"
                                                : option.id === 3
                                                    ? "🟡"
                                                    : "🟢")}
                                    {isSelected && "✔️"}
                                </div>

                                {/* Text */}
                                <div className="flex items-center gap-2">
                  <span className="text-center font-medium text-gray-900">
                    {option.text}
                  </span>
                                    <div className="text-sm font-bold text-gray-500">{isSelected && option.badge}</div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Vote Count */}
                <div className="mb-6 flex items-center justify-center gap-2 text-xl font-bold text-gray-900">
                    <span className="text-2xl">🔥</span>
                    <span>1,204명 투표 중!</span>
                </div>

                {/* Timer */}
                <div className="text-center">
                    <p className="mb-2 text-sm text-gray-600">남은 투표 시간</p>
                    <p className="text-3xl font-bold text-gray-900">
                        {String(timeLeft.hours).padStart(2, "0")} :
                        {String(timeLeft.minutes).padStart(2, "0")} :
                        {String(timeLeft.seconds).padStart(2, "0")}
                    </p>
                </div>
            </div>
        </div>
    );
}