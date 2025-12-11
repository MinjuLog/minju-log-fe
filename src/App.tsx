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
import {useEffect, useState} from "react";
import {createUser} from "./api/user/user.ts";
import GuidePage from "./pages/guide/Page.tsx";
import NoticePage from "./pages/notice/Page.tsx";

function App() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const bootstrap = async () => {
            // 1. 첫 방문 체크 & 리다이렉트 먼저
            const isFirstVisit = sessionStorage.getItem("visited");
            const currentPath = window.location.pathname;

            if (!isFirstVisit) {
                sessionStorage.setItem("visited", "true");

                // 첫 방문 + /, /guide 가 아니면 → /guide로 보내고 종료
                if (currentPath !== "/" && currentPath !== "/guide") {
                    window.location.replace("/guide");
                    return; // 여기서 끝나고, 새 페이지에서 다시 로딩됨
                }
            }

            // 2. 리다이렉트 안 한 경우에만 사용자 초기화
            const existingUserId = localStorage.getItem("userId");

            if (!existingUserId || isNaN(Number(existingUserId))) {
                const res = await createUser();

                if (!res.ok) {
                    alert(res.message);
                    // 실패해도 일단 화면은 띄워야 하니 ready는 true로
                    setReady(true);
                    return;
                }

                localStorage.setItem("userId", String(res.result.userId));
            }

            setReady(true);
        };

        void bootstrap();
    }, []);

    // 부트스트랩 끝나기 전에는 아무 것도 렌더링하지 않음 (또는 로딩 화면)
    if (!ready) {
        return null;
        // 또는
        // return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
    }

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-background">
                <Header />
                <main className="container mx-auto px-4 py-12 max-w-8xl">
                    <Routes>
                        <Route path="/" element={<Navigate to="/guide" replace />} />

                        <Route path="/notice" element={<NoticePage />} />
                        <Route path="/guide" element={<GuidePage />} />

                        <Route path="/discussions" element={<DiscussionsPage />} />
                        <Route path="/discussions/:discussionSequence" element={<DiscussionPage />} />
                        <Route path="/discussions/write" element={<WritingPage />} />

                        <Route path="/columns" element={<ColumnsPage />} />
                        <Route path="/columns/:id" element={<ColumnPage />} />

                        <Route path="/around" element={<AroundPage />} />

                        <Route path="/dashboard" element={<DashboardPage />} />

                        <Route path="*" element={<Navigate to="/guide" replace />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;