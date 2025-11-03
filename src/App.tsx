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

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-background">
                <Header />
                <main className="container mx-auto px-4 py-12 max-w-8xl">
                    <Routes>
                        {/* 기본 루트는 /discussions로 리다이렉트 */}
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        {/* 목록 페이지 */}
                        <Route path="/discussions" element={<DiscussionsPage />} />
                        {/* 상세 페이지: 동적 파라미터 사용 */}
                        <Route path="/discussions/:id" element={<DiscussionPage />} />

                        <Route path="/discussions/write" element={<WritingPage />} />

                        {/* 목록 페이지 */}
                        <Route path="/columns" element={<ColumnsPage />} />
                        {/* 상세 페이지: 동적 파라미터 사용 */}
                        <Route path="/columns/:id" element={<ColumnPage />} />

                        <Route path="/around" element={<AroundPage/>} />

                        <Route path="/dashboard" element={<DashboardPage/>} />

                        {/* 없으면 목록으로 */}
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;