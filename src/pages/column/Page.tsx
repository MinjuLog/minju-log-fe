import ContentHeader from "./components/ContentHeader.tsx";
import ContentBody from "./components/ContentBody.tsx";
import ContentFooter from "./components/ContentFooter.tsx";
import {useNavigate} from "react-router-dom";

const mock = {
    id: 1,
    header: {
        tag: "HOT",
        category: "지역 혁신·농업",
        title: "전남 곡성, 청년이 일으킨 스마트팜 혁신 모델",
        timeAgo: "22분 전",
        author: "민주로그팀",
    },
    body: {
        content: `
      <p>
        1. 전남 곡성군은 고령화로 인한 농업 인력난을 해결하기 위해 
        청년 주도의 스마트팜 협동조합을 설립했습니다. 
        IoT 기반의 온도·습도 자동 제어 시스템을 도입해 노동 시간을 40% 줄이고, 
        생산량은 1.5배 늘어나는 성과를 보였습니다.
      </p>

      <p>
        2. 특히 곡성군은 단순한 시설 지원에 그치지 않고 
        청년 교육·창업·운영을 아우르는 ‘스마트팜 인큐베이팅 프로그램’을 운영하고 있습니다. 
        농업기술센터와 지역 대학이 협력하여 기술 교육을 담당하고, 
        초기 운영비는 군과 지역 기업이 공동으로 부담하는 구조를 만들었습니다.
      </p>

      <p>
        3. 그 결과, 청년 귀농·귀촌 인구가 전년 대비 27% 증가했으며 
        참여 농가의 월평균 소득은 기존 대비 35% 상승했습니다. 
        이러한 성과는 곡성형 스마트팜이 단순한 농업 자동화를 넘어 
        ‘지역 일자리와 인구 유지’를 연결한 새로운 농정 모델이라는 평가를 받고 있습니다.
      </p>

      <p>
        4. 앞으로는 데이터를 기반으로 작물별 최적 생육 환경을 분석하는 
        ‘곡성형 농업데이터 플랫폼’ 구축이 추진 중입니다. 
        군은 이 시스템을 통해 생산 효율뿐만 아니라 
        병해충 조기 진단·에너지 절감 등 실질적 농가 지원으로 발전시키겠다는 계획입니다.
      </p>
    `,
    },
    footer: {
        author: "박지후 지역정책연구원",
        company: "지속가능농정연구소",
        writeCount: 62,
        replyCount: 1043,
    },
};

export default function ColumnPage() {
    const navigate = useNavigate();

    const onQuotationClick = () => {
        navigate(`/discussions/write?quotation=${mock.id}`);
    };

    return (
        <div className="mx-auto max-w-3xl px-4 py-8">
            <ContentHeader
                tag={mock.header.tag}
                category={mock.header.category}
                title={mock.header.title}
                timeAgo={mock.header.timeAgo}
                author={mock.header.author}
            />

            <ContentBody body={mock.body.content} />

            <ContentFooter
                onQuotationClick={onQuotationClick}
            />
        </div>
    );
}
