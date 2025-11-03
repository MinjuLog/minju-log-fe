import type KanbanType from "../types/KanbanType.tsx";
import {FileText, MessageCircleMore, Vote} from "lucide-react";
import {Link} from "react-router-dom";

interface props {
    kanbans: KanbanType[];
}

const categoryBgMap: Record<string, string> = {
    "청년": "bg-yellow-100",
    "복지": "bg-blue-100",
    "교육": "bg-green-100",
    "교통": "bg-purple-100",
    "환경": "bg-emerald-100",
    "주거": "bg-orange-100",
    "문화": "bg-pink-100",
    "안전": "bg-red-100",
    "정책": "bg-indigo-100",
    "경제": "bg-sky-100",
    "시민생활": "bg-sky-100",
    "보건": "bg-sky-100",
    "지역활성화": "bg-sky-100",
    "노년층": "bg-sky-100",
};

export default function KanbanBoard({ kanbans }: props) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {kanbans.map((kanban) => (
                <div key={kanban.title} className="space-y-4">
                    {/* kanban Header */}
                    <div className="flex items-center gap-2 mb-4">
                        <div
                            className={`w-3 h-3 rounded-full ${
                                kanban.color === "purple"
                                    ? "bg-purple-500"
                                    : kanban.color === "orange"
                                        ? "bg-amber-500"
                                        : "bg-green-500"
                            }`}
                        />
                        <h2 className="font-semibold text-gray-900">
                            {kanban.title} <span className="text-gray-500 ml-2">{kanban.projects.length}</span>
                        </h2>
                    </div>

                    {/* kanban Border */}
                    <div
                        className={`h-1 rounded-full ${
                            kanban.color === "purple"
                                ? "bg-purple-500"
                                : kanban.color === "orange"
                                    ? "bg-amber-500"
                                    : "bg-green-500"
                        }`}
                    />

                    {/* Project Cards */}
                    <Link to='/discussions/1'
                        className="space-y-4">
                        {kanban.projects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-white rounded-lg p-4 hover:shadow-md transition border border-gray-200"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex gap-2">
                                        {
                                            project.categories.map((category) => (
                                                <span
                                                    className={`${categoryBgMap[category]} text-gray-700 px-2 py-1 rounded text-xs font-medium`}>
                                              {category}
                                            </span>
                                            ))
                                        }
                                    </div>
                                    <span className="text-gray-500 text-sm">{project.date}</span>
                                </div>

                                <h3 className="font-semibold text-gray-900 text-lg mb-2">{project.title}</h3>

                                {project.description && (
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>
                                )}
                                {
                                    project.topic && (
                                        <div className="my-1">
                                            <Link
                                                to={`/columns/${project.topic.id}`}
                                                className={`group inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100 hover:ring-emerald-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-all shadow-sm hover:shadow`}
                                            >
                                                <FileText className="h-4 w-4 shrink-0 text-emerald-700"/>
                                                <span className="truncate">{project.topic.title}</span>
                                            </Link>
                                        </div>
                                    )
                                }

                                {/*{project.image && (*/}
                                {/*    <div className="mb-4 rounded-lg overflow-hidden bg-gray-100 h-40">*/}
                                {/*        <img*/}
                                {/*            src={project.image || "/placeholder.svg"}*/}
                                {/*            alt={project.title}*/}
                                {/*            className="w-full h-full object-cover"*/}
                                {/*        />*/}
                                {/*    </div>*/}
                                {/*)}*/}

                                {/* Engagement Metrics */}
                                <div className="flex items-center gap-4 text-gray-600 text-sm border-t pt-3">
                                    {/*<button className="flex items-center gap-1 hover:text-gray-900 transition">*/}
                                    {/*    <ThumbsUp className="h-4 w-4"/>*/}
                                    {/*    <span>{project.likes}</span>*/}
                                    {/*</button>*/}
                                    <button className="flex items-center gap-1 hover:text-gray-900 transition">
                                        <Vote className="h-4 w-4"/>
                                        <span>{project.votes}</span>
                                    </button>
                                    <button className="flex items-center gap-1 hover:text-gray-900 transition">
                                        <MessageCircleMore className="h-4 w-4"/>
                                        <span>{project.comments}</span>
                                    </button>
                                </div>
                            </div>

                        ))}
                    </Link>
                </div>
            ))}
        </div>
    )
}