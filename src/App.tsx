import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import DiscussionsPage from "./pages/discussions/Page.tsx";
import { Header } from "./components/Header.tsx";
import "./App.css";
import DiscussionPage from "./pages/discussion/Page.tsx";
import ColumnsPage from "./pages/columns/Page.tsx";

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-background">
                <Header />
                <main className="container mx-auto px-4 py-12 max-w-8xl">
                    <Routes>
                        {/* 기본 루트는 /discussions로 리다이렉트 */}
                        <Route path="/" element={<Navigate to="/discussions" replace />} />
                        {/* 목록 페이지 */}
                        <Route path="/discussions" element={<DiscussionsPage />} />
                        {/* 상세 페이지: 동적 파라미터 사용 */}
                        <Route path="/discussions/:id" element={<DiscussionPage />} />
                        {/* 목록 페이지 */}
                        <Route path="/columns" element={<ColumnsPage />} />
                        {/* 없으면 목록으로 */}
                        <Route path="*" element={<Navigate to="/discussions" replace />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;