import ContentHeader from "./components/ContentHeader.tsx";
import ContentBody from "./components/ContentBody.tsx";
import ContentFooter from "./components/ContentFooter.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getTopicDetail} from "../../api/topic/topic.ts";
import type TopicDetailType from "./type/TopicDetailType.ts";
import topicDetailConverter from "./converter/topicDetailConverter.ts";

// const mock = {
//     id: 1,
//     header: {
//         tag: "HOT",
//         category: "지역 혁신·농업",
//         title: "전남 곡성, 청년이 일으킨 스마트팜 혁신 모델",
//         timeAgo: "22분 전",
//         author: "민주로그팀",
//     },
//     body: {
//         content: `
//       <p>
//         1. 전남 곡성군은 고령화로 인한 농업 인력난을 해결하기 위해
//         청년 주도의 스마트팜 협동조합을 설립했습니다.
//         IoT 기반의 온도·습도 자동 제어 시스템을 도입해 노동 시간을 40% 줄이고,
//         생산량은 1.5배 늘어나는 성과를 보였습니다.
//       </p>
//
//       <p>
//         2. 특히 곡성군은 단순한 시설 지원에 그치지 않고
//         청년 교육·창업·운영을 아우르는 ‘스마트팜 인큐베이팅 프로그램’을 운영하고 있습니다.
//         농업기술센터와 지역 대학이 협력하여 기술 교육을 담당하고,
//         초기 운영비는 군과 지역 기업이 공동으로 부담하는 구조를 만들었습니다.
//       </p>
//
//       <p>
//         3. 그 결과, 청년 귀농·귀촌 인구가 전년 대비 27% 증가했으며
//         참여 농가의 월평균 소득은 기존 대비 35% 상승했습니다.
//         이러한 성과는 곡성형 스마트팜이 단순한 농업 자동화를 넘어
//         ‘지역 일자리와 인구 유지’를 연결한 새로운 농정 모델이라는 평가를 받고 있습니다.
//       </p>
//
//       <p>
//         4. 앞으로는 데이터를 기반으로 작물별 최적 생육 환경을 분석하는
//         ‘곡성형 농업데이터 플랫폼’ 구축이 추진 중입니다.
//         군은 이 시스템을 통해 생산 효율뿐만 아니라
//         병해충 조기 진단·에너지 절감 등 실질적 농가 지원으로 발전시키겠다는 계획입니다.
//       </p>
//     `,
//     },
//     footer: {
//         author: "박지후 지역정책연구원",
//         company: "지속가능농정연구소",
//         writeCount: 62,
//         replyCount: 1043,
//     },
// };

function ContentHeaderSkeleton() {
    return (
        <div className="mb-8 animate-pulse">
            <div className="mb-3 h-5 w-16 rounded-full bg-gray-200" /> {/* tag */}
            <div className="mb-2 h-4 w-40 rounded-full bg-gray-200" /> {/* category */}
            <div className="mb-3 h-7 w-3/4 rounded-md bg-gray-300" /> {/* title */}
            <div className="h-4 w-32 rounded-full bg-gray-200" /> {/* time/author */}
        </div>
    );
}
function ContentBodySkeleton() {
    return (
        <div className="space-y-3 animate-pulse">
            <div className="h-4 w-full rounded-md bg-gray-200" />
            <div className="h-4 w-11/12 rounded-md bg-gray-200" />
            <div className="h-4 w-10/12 rounded-md bg-gray-200" />
            <div className="h-4 w-9/12 rounded-md bg-gray-200" />
        </div>
    );
}
function ContentFooterSkeleton() {
    return (
        <div className="mt-8 flex justify-end animate-pulse">
            <div className="h-9 w-32 rounded-full bg-gray-200" />
        </div>
    );
}

export default function ColumnPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [topicDetail, setTopicDetail] = useState<TopicDetailType | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!id) return;

        const load = async () => {
            try {
                setLoading(true);
                const res = await getTopicDetail(Number(id));

                if (!res.ok) {
                    alert(res.message);
                    return;
                }

                setTopicDetail(topicDetailConverter(res));
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id]);

    const onQuotationClick = () => {
        if (!topicDetail) return;
        navigate(`/discussions/write?quotation=${topicDetail.id}`);
    };

    const isReady = !loading && topicDetail;

    return (
        <div className="mx-auto max-w-3xl px-4 py-8">
            {/* Header */}
            {isReady ? (
                <ContentHeader
                    tag={topicDetail!.header.tag}
                    category={topicDetail!.header.category}
                    title={topicDetail!.header.title}
                    timeAgo={topicDetail!.header.timeAgo}
                    author={topicDetail!.header.author}
                />
            ) : (
                <ContentHeaderSkeleton />
            )}

            {/* Body */}
            {isReady ? (
                <ContentBody body={topicDetail!.body.content} />
            ) : (
                <ContentBodySkeleton />
            )}

            {/* Footer */}
            {isReady ? (
                <ContentFooter onQuotationClick={onQuotationClick} />
            ) : (
                <ContentFooterSkeleton />
            )}
        </div>
    );
}
