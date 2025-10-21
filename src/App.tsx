import { BrowserRouter, Routes, Route } from "react-router-dom";
import DiscussionsPage from "./pages/discussions/Page.tsx";
import { Header } from "./components/Header.tsx";
import "./App.css";

function App() {
    return (
        <div className="min-h-screen bg-background">
            <Header/>
            <main className="container mx-auto px-4 py-12 max-w-7xl">
                <BrowserRouter>
                    <Routes>
                        {/* /discussions 접속 시 토론 페이지 렌더링 */}
                        <Route path="/discussions" element={<DiscussionsPage/>}/>
                    </Routes>
                </BrowserRouter>
            </main>
        </div>
    );
}

export default App;