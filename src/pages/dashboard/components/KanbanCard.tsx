import { Link, useNavigate } from "react-router-dom";
import { FileText, MessageCircleMore, CheckSquare } from "lucide-react";
import type ProjectType from "../types/ProjectType.ts";
import React from "react";

interface Props {
    project: ProjectType;
}

const bgColors: string[] = [
    "bg-yellow-100",
    "bg-blue-100",
    "bg-green-100",
    "bg-purple-100",
    "bg-emerald-100",
    "bg-orange-100",
    "bg-pink-100",
    "bg-red-100",
    "bg-indigo-100",
    "bg-sky-100",
];

function getRandomBg(): string {
    const randomIndex = Math.floor(Math.random() * bgColors.length);
    return bgColors[randomIndex];
}

export default function KanbanCard({ project }: Props) {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/discussions/${project.sequence}`);
    };

    const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCardClick();
        }
    };

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={handleCardClick}
            onKeyDown={handleKeyDown}
            className="bg-white rounded-lg p-4 hover:shadow-md transition border border-gray-200 cursor-pointer"
            aria-label={`${project.title} 토론으로 이동`}
            key={project.sequence}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex flex-wrap gap-2">
                    {project.hashTags?.map((hashTag) => (
                        <span
                            key={`${project.sequence}-${hashTag}`}
                            className={`${getRandomBg()} text-gray-700 px-2 py-1 rounded text-xs font-medium`}
                        >
              {hashTag}
            </span>
                    ))}
                </div>
                {project.createdAt && (
                    <span className="text-gray-500 text-sm">{project.createdAt}</span>
                )}
            </div>

            <h3 className="font-semibold text-gray-900 text-lg mb-2">
                {project.title}
            </h3>

            {project.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {project.description}
                </p>
            )}

            {project.topic && (
                <div className="my-1">
                    <Link
                        to={`/columns/${project.topic.sequence}`}
                        onClick={(e) => e.stopPropagation()} // 카드 클릭과 분리
                        className="group inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100 hover:ring-emerald-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-all shadow-sm hover:shadow"
                        aria-label="관련 칼럼으로 이동"
                    >
                        <FileText className="h-4 w-4 shrink-0 text-emerald-700" />
                        <span className="truncate">{project.topic.title}</span>
                    </Link>
                </div>
            )}

            <div className="flex items-center gap-4 text-gray-600 text-sm border-t pt-3">
                <div className="flex items-center gap-1" aria-label="투표 수">
                    <CheckSquare className="h-4 w-4" />
                    <span>{project.votes ?? 0}</span>
                </div>
                <div className="flex items-center gap-1" aria-label="댓글 수">
                    <MessageCircleMore className="h-4 w-4" />
                    <span>{project.comments ?? 0}</span>
                </div>
            </div>
        </div>
    );
}