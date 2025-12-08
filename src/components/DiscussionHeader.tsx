import { Link } from "react-router-dom";

export default function DiscussionHeader() {
    return (
        <div className="flex items-start justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold text-foreground">동네한표</h1>

                <p className="text-lg text-muted-foreground leading-relaxed mt-2">
                    동네에 소소한 불편함들을 말해주세요. <br/>
                    많은 투표가 쌓여 기사까지  보도되어 실제 생활에 반영되는 경험을 해보세요! <br/>
                    정치적인 성향의 글은 무통보 삭제될 수 있습니다.
                </p>
            </div>

            <Link
                to="/discussions/write"
                className="px-6 py-2.5 rounded-lg border border-border hover:bg-secondary transition-colors text-sm font-medium"
            >
                동네한표 생성하기
            </Link>
        </div>
    );
}