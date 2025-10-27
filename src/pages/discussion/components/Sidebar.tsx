import {Link} from "react-router-dom";
import type SidebarDiscussionType from "../types/SidebarDiscussionType.ts";
import SidebarDiscussion from "./SidebarDiscussion.tsx";

interface props {
    sidebarDiscussions: SidebarDiscussionType[];
}

export default function Sidebar({ sidebarDiscussions }: props) {

    return (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="sticky top-4 space-y-4">
                {/* Home Link */}
                <Link to="/" className="mb-4 flex items-center rounded-lg p-1 hover:bg-gray-100">
                    <span className="font-medium text-gray-900">스파링 홈</span>
                    <svg className="css-111o5ku" fill="none" height="20" viewBox="0 0 20 20" width="20"
                         xmlns="http://www.w3.org/2000/svg">
                        <path clipRule="evenodd"
                              d="M6.57967 16.629C6.14033 16.1897 6.14033 15.4773 6.57967 15.038L11.6175 10.0002L6.57967 4.96233C6.14033 4.52299 6.14033 3.81068 6.57967 3.37134C7.01901 2.932 7.73132 2.932 8.17066 3.37134L14.004 9.20467C14.4433 9.64401 14.4433 10.3563 14.004 10.7957L8.17066 16.629C7.73132 17.0683 7.01901 17.0683 6.57967 16.629Z"
                              fill="var(--color-gray-800)" fillRule="evenodd"></path>
                    </svg>
                </Link>
                {sidebarDiscussions.map(sidebarDiscussion => <SidebarDiscussion sidebarDiscussion={sidebarDiscussion}/>)}
            </div>
        </div>
    );
}