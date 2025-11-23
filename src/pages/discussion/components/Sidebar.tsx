import {Link, useParams} from "react-router-dom";
import SidebarDiscussion from "./SidebarDiscussion.tsx";
import {useEffect, useState} from "react";
import {findProposalList} from "../../../api/proposal/proposal.ts";
import type SidebarDiscussionType from "../types/SidebarDiscussionType.ts";
import sidebarDiscussionConverter from "../converter/sidebarDiscussionConverter.ts";

function SidebarDiscussionSkeletonCard() {
    return (
        <div className="rounded-2xl p-5 bg-gray-100 relative overflow-hidden">
            {/* 종료까지 ... 남음 */}
            <p className="mb-2 text-center text-sm text-gray-400">
                <span className="inline-block h-3 w-32 bg-gray-200 rounded" />
            </p>

            {/* 제목 두 줄 */}
            <h3 className="mb-4 text-center text-lg leading-tight">
                <span className="inline-block h-4 w-40 bg-gray-200 rounded mb-2" />
                <br />
                <span className="inline-block h-4 w-28 bg-gray-200 rounded" />
            </h3>

            {/* 베스트 배지 + best 텍스트 라인 */}
            <div className="mb-4 flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-sm p-1 bg-gray-300">
                    <div className="h-3 w-3 rounded-full bg-gray-200" />
                    <p className="h-3 w-8 bg-gray-200 rounded text-[11px]" />
                </div>
                <span className="h-3 w-20 bg-gray-200 rounded" />
            </div>

            {/* 내용 본문 */}
            <p className="mb-8 text-[13px] leading-relaxed text-gray-400">
                <span className="block h-3 w-full bg-gray-200 rounded mb-2" />
                <span className="block h-3 w-5/6 bg-gray-200 rounded mb-2" />
                <span className="block h-3 w-2/3 bg-gray-200 rounded" />
            </p>

            <div className="relative w-full">
                {/* 베스트 배지 영역 */}
                <div className="absolute left-1/2 -top-7 -translate-x-1/2">
                    <div className="flex items-center gap-2 rounded-lg p-2 bg-white shadow-lg">
                        <div className="h-4 w-4 rounded-full bg-gray-200" />
                        <p className="h-3 w-24 bg-gray-200 rounded text-[13px]" />
                    </div>
                </div>

                {/* 투표 버튼 자리 */}
                <div className="w-full rounded-full bg-gray-300 py-2" />
            </div>
        </div>
    );
}

function SidebarSkeleton() {
    return (
        <div className="flex flex-col gap-4 h-full animate-pulse">
            {[0, 1].map(i => (
                <div key={i} className="flex-1">
                    <SidebarDiscussionSkeletonCard />
                </div>
            ))}
        </div>
    );
}

export default function Sidebar() {

    const [sidebarDiscussions, setSidebarDiscussions] = useState<SidebarDiscussionType[]>([]);
    const [loading, setLoading] = useState(true);

    const { discussionSequence } = useParams<{ discussionSequence: string }>();

    useEffect(() => {
        const load = async () => {
            setLoading(true);

            const res = await findProposalList({
                keyword: "",
                status: "COLLECTING",
                sort: "latest",
                page: 0,
                size: 3,
            });

            if (!res.ok) {
                alert(res.message);
                setLoading(false);
                return;
            }

            const currentId = Number(discussionSequence);

            const filtered = res.content
                .filter(c => c.id !== currentId)
                .slice(0, 2);

            const converted = sidebarDiscussionConverter({
                ...res,
                content: filtered,
            });

            setSidebarDiscussions(converted);
            setLoading(false);
        };

        load();
    }, [discussionSequence]);

    return (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="sticky top-4 space-y-4">
                {/* Home Link */}
                <Link to="/" className="mb-4 flex items-center rounded-lg p-1 hover:bg-gray-100">
                    <span className="font-medium text-gray-900">동네한표 홈</span>
                    <svg className="css-111o5ku" fill="none" height="20" viewBox="0 0 20 20" width="20"
                         xmlns="http://www.w3.org/2000/svg">
                        <path clipRule="evenodd"
                              d="M6.57967 16.629C6.14033 16.1897 6.14033 15.4773 6.57967 15.038L11.6175 10.0002L6.57967 4.96233C6.14033 4.52299 6.14033 3.81068 6.57967 3.37134C7.01901 2.932 7.73132 2.932 8.17066 3.37134L14.004 9.20467C14.4433 9.64401 14.4433 10.3563 14.004 10.7957L8.17066 16.629C7.73132 17.0683 7.01901 17.0683 6.57967 16.629Z"
                              fill="var(--color-gray-800)" fillRule="evenodd"></path>
                    </svg>
                </Link>

                {loading ? (
                    <SidebarSkeleton />
                ) : (
                    sidebarDiscussions.map(sd => (
                        <SidebarDiscussion key={sd.id} sidebarDiscussion={sd} />
                    ))
                )}
            </div>
        </div>
    );
}