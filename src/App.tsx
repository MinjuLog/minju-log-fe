import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import DiscussionsPage from "./pages/discussions/Page.tsx";
import { Header } from "./components/Header.tsx";
import "./App.css";
import DiscussionPage from "./pages/discussion/Page.tsx";
import ColumnsPage from "./pages/columns/Page.tsx";
import ColumnPage from "./pages/column/Page.tsx";
import AroundPage from "./pages/around/Page.tsx";
import WritingPage from "./pages/writing/Page.tsx";
import DashboardPage from "./pages/dashboard/Page.tsx";
import {useEffect} from "react";
import {createUser} from "./api/user/user.ts";
import GuidePage from "./pages/guide/Page.tsx";
import NoticePage from "./pages/notice/Page.tsx";

function App() {

    useEffect(() => {
        const initUser = async () => {
            const existingUserId = localStorage.getItem("userId");

            if (!existingUserId || isNaN(Number(existingUserId))) {
                const res = await createUser();

                if (!res.ok) {
                    alert(res.message);
                    return;
                }

                // 반드시 문자열로 저장해야 함
                localStorage.setItem("userId", String(res.result.userId));
            }
        };

        initUser();
    }, []);

    useEffect(() => {
        const isFirstVisit = sessionStorage.getItem("visited");
        const currentPath = window.location.pathname;

        if (!isFirstVisit) {
            // 첫 방문이면 플래그 저장
            sessionStorage.setItem("visited", "true");

            // 첫 방문 & URL이 root가 아니면 → 강제로 /guide 이동
            if (currentPath !== "/" && currentPath !== "/guide") {
                window.location.replace("/guide");
                return;
            }
        }
    }, []);

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-background">
                <Header />
                <main className="container mx-auto px-4 py-12 max-w-8xl">
                    <Routes>
                        <Route path="/" element={<Navigate to="/guide" replace />} />

                        <Route path="/notice" element={<NoticePage/>} />
                        <Route path="/guide" element={<GuidePage />} />

                        <Route path="/discussions" element={<DiscussionsPage />} />
                        <Route path="/discussions/:discussionSequence" element={<DiscussionPage />} />
                        <Route path="/discussions/write" element={<WritingPage />} />

                        <Route path="/columns" element={<ColumnsPage />} />
                        <Route path="/columns/:id" element={<ColumnPage />} />

                        <Route path="/around" element={<AroundPage />} />

                        <Route path="/dashboard" element={<DashboardPage />} />

                        <Route path="*" element={<Navigate to="/discussions" replace />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;