"use client"
import MainVotes from "./components/MainVotes.tsx";
import Sidebar from "./components/Sidebar.tsx";
import DiscussionHeader from "../../components/DiscussionHeader.tsx";

export default function DiscussionPage() {

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="px-16 py-8">
                <DiscussionHeader/>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <MainVotes/>
                    <Sidebar />
                </div>
            </div>
        </div>
    )
}
