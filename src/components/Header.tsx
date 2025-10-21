import { Search, Bell, Moon, LogIn } from "lucide-react"

export function Header() {
    return (
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Navigation */}
                    <div className="flex items-center gap-8">
                        <div className="text-2xl font-bold text-foreground">aha</div>
                        <nav className="hidden md:flex items-center gap-6">
                            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                홈
                            </a>
                            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                토픽
                            </a>
                            <a href="#" className="text-sm font-semibold text-foreground hover:text-foreground/80 transition-colors">
                                스파링
                            </a>
                            <a
                                href="#"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                            >
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold">
                  N
                </span>
                                아핫뉴스
                            </a>
                            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                링크
                            </a>
                            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                미션
                            </a>
                            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                전문가 신청
                            </a>
                            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                멤버십
                            </a>
                        </nav>
                    </div>

                    {/* Right side actions */}
                    <div className="flex items-center gap-3">
                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                            <Search className="w-5 h-5 text-muted-foreground" />
                        </button>
                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                            <Bell className="w-5 h-5 text-muted-foreground" />
                        </button>
                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                            <Moon className="w-5 h-5 text-muted-foreground" />
                        </button>
                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                            <LogIn className="w-5 h-5 text-muted-foreground" />
                        </button>
                        {/*<Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-6">*/}
                        {/*    나도 질문하기*/}
                        {/*</Button>*/}
                    </div>
                </div>
            </div>
        </header>
    )
}
