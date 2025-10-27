import ContentHeader from "./components/ContentHeader.tsx";
import ContentBody from "./components/ContentBody.tsx";
import ContentFooter from "./components/ContentFooter.tsx";

const mock = {
    header: {
        tag: "HOT",
        category: "정책·예산",
        title: "청년 예산 삭감, 지방 재정의 불편한 진실",
        timeAgo: "15분 전",
        author: "김은서 정책연구원",
    },
    body: {
        content: `
      <p>
        1. 최근 여러 지자체에서 청년 창업 및 주거 지원 예산이 대폭 삭감되었습니다.
        이유는 ‘재정 건전성 확보’이지만, 실제로는 지역 축제나 홍보비 예산은 거의 줄지 않았습니다.
        결국 우선순위의 문제라는 지적이 나오고 있습니다.
      </p>

      <p>
        2. 청년 정책 예산은 단기적으로는 지출처럼 보이지만,
        장기적으로는 지역 인구 유지와 경제 순환에 기여하는 투자입니다.
        특히 수도권으로 인구가 유출되는 현 시점에서 청년층 지원을 줄이는 것은
        지역 소멸을 가속화시킬 수 있다는 우려가 있습니다.
      </p>

      <p>
        3. 따라서 예산 삭감이 불가피하다면, 전면적인 삭감보다는
        ‘성과 중심 재편’이 필요합니다.
        단순 지원금보다는 주거, 교육, 교통 인프라 개선 등
        정착 여건을 강화하는 방향으로 정책이 전환되어야 합니다.
      </p>
    `,
    },
    footer: {
        author: "김은서 정책연구원",
        company: "지방행정정책연구소",
        writeCount: 47,
        replyCount: 892,
    },
};

export default function ColumnPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-8">
            <ContentHeader tag={mock.header.tag}
                           category={mock.header.category}
                           title={mock.header.title}
                           timeAgo={mock.header.timeAgo}
                           author={mock.header.author}
            />
            <ContentBody body={mock.body.content}/>
            <ContentFooter
                author={mock.footer.author}
                company={mock.footer.company}
                writeCount={mock.footer.writeCount}
                replyCount={mock.footer.replyCount}
            />
        </div>
    )
}
