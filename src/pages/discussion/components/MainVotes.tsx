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
                                            ? "🔵"
                                            : option.id === 2
                                                ? "🔴"
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

                {/* Voting Results */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
                        <span>361표</span>
                        <span>1,128표</span>
                    </div>

                    {/* Progress bar */}
                    <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="absolute left-0 top-0 h-full bg-blue-500 transition-all"
                            style={{ width: "24.2%" }}
                        />
                        <div
                            className="absolute right-0 top-0 h-full bg-red-500 transition-all"
                            style={{ width: "75.8%" }}
                        />
                    </div>

                    <div className="flex justify-between mt-3 font-bold text-gray-900">
                        <span className="text-blue-700">24.2%</span>
                        <span className="text-red-600">75.8%</span>
                    </div>
                </div>

                <hr/>

                {/* Vote Count */}
                <div className="my-6 flex items-center justify-center gap-2 text-xl font-bold text-gray-900">
                    <svg
                        fill="red"
                        height="18"
                        viewBox="0 0 26 30"
                        width="18"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M10.5519 0.384617C11.4185 0.652531 21.9801 4.19638 19.9154 17.6177C20.9332 16.8338 22.19 15.327 22.5327 12.5495C22.5893 12.0792 23.0116 11.7434 23.4767 11.8007C23.764 11.8358 24.0006 12.0137 24.1241 12.2558C26.0293 15.6546 26.0363 19.3304 24.8719 22.4204C24.3895 23.7014 23.7006 24.8866 22.8581 25.9126C22.0111 26.9444 21.014 27.809 19.9189 28.4431C17.7436 29.7043 15.1829 30.0798 12.636 29.0959C11.3805 28.6104 9.82601 27.7084 8.73993 26.0458C8.01868 24.9402 7.51208 23.5129 7.45436 21.6716C6.55422 23.2943 5.82145 25.6996 6.86466 28.5062C7.02968 28.9496 6.80926 29.4445 6.37073 29.6118C6.15032 29.696 5.91719 29.6797 5.71873 29.5872C4.71244 29.1134 3.85039 28.4992 3.13029 27.7773C1.54468 26.1909 0.651485 24.1024 0.404509 21.875C0.161012 19.6838 0.545297 17.3532 1.51236 15.2426C2.10782 13.9428 2.9237 12.7237 3.95193 11.6695C4.13426 11.4811 4.32812 11.2869 4.52317 11.0904C6.6604 8.9342 9.03758 6.53345 9.41277 1.13432C9.44393 0.661678 9.84669 0.303683 10.3129 0.33525C10.396 0.3411 10.4756 0.358649 10.5495 0.386729L10.5519 0.384617Z"
                            fill="red"
                        ></path>
                    </svg>
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