import {Link, useLocation} from "react-router-dom";

const tabs: {
    href: string,
    text: string,
    isHighlighted?: boolean,
}[] = [
    // { href: "/", text: "홈", },
    { href: "/guide", text: "이용 방법", isHighlighted: true },
    { href: "/discussions", text: "동네한표", isHighlighted: true },
    { href: "/around", text: "다른 지역은?", isHighlighted: true },
    { href: "/dashboard", text: "진행로그", isHighlighted: true },
]

export function Header() {
    const location = useLocation();
    return (
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Navigation */}
                    <div className="flex items-center gap-8">
                        <Link
                            to="/"
                            className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-red-600 to-pink-500 bg-clip-text text-transparent select-none hover:opacity-90 transition-opacity"
                        >
                            민주로그
                        </Link>
                        <nav className="hidden md:flex items-center gap-6">
                            {tabs.map((tab) => {
                                const isActive = location.pathname === tab.href;
                                return (
                                    <Link
                                        key={tab.href}
                                        to={tab.href}
                                        className={`text-sm transition-colors ${
                                            isActive
                                                ? "text-foreground font-semibold"
                                                : "text-muted-foreground hover:text-foreground"
                                        }`}
                                    >
                                        {tab.isHighlighted && (
                                            <span
                                                className="inline-flex items-center justify-center w-5 h-5 mr-1 rounded-full bg-red-500 text-white text-xs font-bold">
                                            N
                                          </span>
                                        )}
                                        {tab.text}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Right side actions */}
                    <div className="flex items-center gap-3">
                        {/*<button className="p-2 hover:bg-secondary rounded-lg transition-colors">*/}
                        {/*    <Search className="w-5 h-5 text-muted-foreground" />*/}
                        {/*</button>*/}
                        {/*<button className="p-2 hover:bg-secondary rounded-lg transition-colors">*/}
                        {/*    <Bell className="w-5 h-5 text-muted-foreground" />*/}
                        {/*</button>*/}
                        {/*<button className="p-2 hover:bg-secondary rounded-lg transition-colors">*/}
                        {/*    <Moon className="w-5 h-5 text-muted-foreground" />*/}
                        {/*</button>*/}
                        {/*<button className="p-2 hover:bg-secondary rounded-lg transition-colors">*/}
                        {/*    <LogIn className="w-5 h-5 text-muted-foreground" />*/}
                        {/*</button>*/}
                        {/*<Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-6">*/}
                        {/*    나도 질문하기*/}
                        {/*</Button>*/}
                    </div>
                </div>
            </div>
        </header>
    )
}
