import {Check, FileText, Share2} from "lucide-react";
import { useEffect, useState } from "react";
import VoteConfirmationModal from "./VoteConfirmationModal.tsx";
import SignSubmitModal from "./SignSubmitModal.tsx";
import type DiscussionType from "../types/DiscussionType.ts";
import {Link, useParams} from "react-router-dom";
import {createDiscussionVote, getDiscussionVote} from "../../../api/discussion.ts";

interface props {
    discussion: DiscussionType;
}

const votingOptions = [
    { id: 1, color: "bg-blue-100 hover:bg-blue-200" },
    { id: 2, color: "bg-red-100 hover:bg-red-200" },
];

export default function MainVotes({ discussion }: props) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        expired: false,
    });

    const { discussionSequence } = useParams<{ discussionSequence: string }>();
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

    const handleConfirm = (id: number | null) => {
        const seq = Number(discussionSequence);
        const type = id === 1 ? "pros" : "cons";
        createDiscussionVote(seq, type);
        setIsConfirmModalOpen(false);
        setIsSubmitModalOpen(true);
    };

    const handleSubmit = () => setIsSubmitModalOpen(false);

    // ✅ 남은 시간 계산 useEffect
    useEffect(() => {
        const deadline = new Date(discussion.expiredAt).getTime();

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const diff = deadline - now;

            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
                clearInterval(timer);
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            setTimeLeft({ days, hours, minutes, seconds, expired: false });
        }, 1000);

        return () => clearInterval(timer);
    }, [discussion.expiredAt]);

    useEffect(() => {
        if (!discussionSequence) return;

        // 문자열 → 숫자 변환
        const seq = Number(discussionSequence);
        if (isNaN(seq)) return;
        const vote: "pros" | "cons" | "none" = getDiscussionVote(seq);
        if (vote === "pros") setSelectedId(1);
        if (vote === "cons") setSelectedId(2);

    }, [discussionSequence]);

    return (
        <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-8 shadow-sm">
                {/* Header */}
                <div className="mb-8 flex items-start justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                        <span className="text-lg font-medium">{discussion.hashTags.map(tag => `#${tag}`).join(" ")}</span>
                    </div>
                    <button className="rounded-lg p-2 hover:bg-gray-100">
                        <Share2 className="h-5 w-5 text-gray-600"/>
                    </button>
                </div>

                {/* Title */}
                <h1 className="mb-6 text-center text-2xl font-bold leading-tight text-gray-900">
                    {discussion.title}
                </h1>

                {/* 주요 내용 */}
                <div className="mb-6 rounded-2xl bg-gray-50 p-8 shadow-inner">
                    <div className="mx-auto max-w-3xl text-center">
                        {/* 상단 섹션 타이틀 */}
                        {/*<div*/}
                        {/*    className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200">*/}
                        {/*    <Info className="h-4 w-4 text-gray-600"/>*/}
                        {/*    <span>주요 내용</span>*/}
                        {/*</div>*/}

                        {/* 본문 내용 */}
                        <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-800">
                            {discussion.content}
                        </p>

                        {/* 하단 라벨 */}
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                            <Link
                                to={`/columns/${discussion.topic.sequence}`}
                                className={`group inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100 hover:ring-emerald-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-all shadow-sm hover:shadow`}
                            >
                                <FileText className="h-4 w-4 shrink-0 text-emerald-700"/>
                                <span className="truncate">{discussion.topic.title}</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ✅ Voting Options Grid (복원됨) */}
                <div className="mb-8 grid grid-cols-2 gap-4">
                    {votingOptions.map((option) => {
                        const isSelected = selectedId === option.id;
                        return (
                            <button
                                key={option.id}
                                onClick={() => {
                                    setSelectedId(option.id);
                                    setIsConfirmModalOpen(true);
                                }}
                                disabled={timeLeft.expired || selectedId !== null} // 투표 종료 시 클릭 불가
                                className={`group relative flex min-h-[120px] flex-col items-center justify-center gap-3 rounded-2xl p-6 transition-all ${option.color} ${
                                    isSelected ? "ring-4 ring-offset-2 ring-gray-100" : ""
                                } ${(timeLeft.expired || selectedId !== null) ? "cursor-not-allowed" : ""}`}
                            >
                                {/* Icon */}
                                <div className="text-6xl">
                                    {!isSelected && (option.id === 1 ? "🔵" : "🔴")}
                                    {isSelected && <Check
                                        className={`w-16 h-16 ${
                                            option.id === 1 ? "text-blue-600" : "text-red-600"
                                        }`}
                                        strokeWidth={3}
                                    />}
                                </div>

                                {/* Text */}
                                <div className="flex justify-center items-center gap-2">
                                  <span
                                      className={`text-[22px] font-bold ${
                                          option.id === 1
                                              ? "text-blue-600"
                                              : option.id === 2
                                                  ? "text-red-600"
                                                  : "text-gray-900"
                                      }`}
                                  >
                                    {option.id === 1 ? "찬성합니다." : "반대합니다."}
                                  </span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* 투표 결과 */}
                <div className="mb-12">
                    {(() => {
                        const total = discussion.pros + discussion.cons;
                        const prosRate = total > 0 ? (discussion.pros / total) * 100 : 0;
                        const consRate = total > 0 ? (discussion.cons / total) * 100 : 0;

                        return (
                            <>
                                <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
                                    <span>{discussion.pros.toLocaleString()}표</span>
                                    <span>{discussion.cons.toLocaleString()}표</span>
                                </div>

                                <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="absolute left-0 top-0 h-full bg-blue-500 transition-all"
                                        style={{width: `${prosRate}%`}}
                                    />
                                    <div
                                        className="absolute right-0 top-0 h-full bg-red-500 transition-all"
                                        style={{width: `${consRate}%`}}
                                    />
                                </div>

                                <div className="flex justify-between mt-3 font-bold text-gray-900">
                                    <span className="text-blue-700">{prosRate.toFixed(1)}%</span>
                                    <span className="text-red-600">{consRate.toFixed(1)}%</span>
                                </div>
                            </>
                        );
                    })()}
                </div>

                <hr/>

                {/* 투표 수 */}
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
                    <span>{discussion.pros + discussion.cons}명 투표 중!</span>
                </div>

                {/* 남은 시간 표시 */}
                <div className="text-center">
                    <p className="mb-2 text-sm text-gray-600">남은 투표 시간</p>
                    {timeLeft.expired ? (
                        <p className="text-2xl font-bold text-red-600">투표 종료</p>
                    ) : (
                        <p className="text-3xl font-bold text-gray-900">
                            {timeLeft.days > 0 && `${timeLeft.days}일 `}
                            {String(timeLeft.hours).padStart(2, "0")}:
                            {String(timeLeft.minutes).padStart(2, "0")}:
                            {String(timeLeft.seconds).padStart(2, "0")}
                        </p>
                    )}
                </div>
            </div>

            <VoteConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => {
                    setIsConfirmModalOpen(false);
                    setSelectedId(null);
                }}
                selectedOption={selectedId === 1 ? "찬성합니다." : "반대합니다."}
                selectedId={selectedId}
                onConfirm={() => handleConfirm(selectedId)}
            />

            <SignSubmitModal
                isOpen={isSubmitModalOpen}
                onClose={() => setIsSubmitModalOpen(false)}
                selectedId={selectedId}
                selectedOption={selectedId === 1 ? "찬성합니다." : "반대합니다."}
                onSubmit={handleSubmit}
            />
        </div>
    );
}