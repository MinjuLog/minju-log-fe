import ContentHeader from "./components/ContentHeader.tsx";
import ContentBody from "./components/ContentBody.tsx";
import ContentFooter from "./components/ContentFooter.tsx";

const mock = {
    header: {
        tag: "NEW",
        category: "법률",
        title: "교통사고 발생 시의 민사상의 문제(8)",
        timeAgo: "10분 전",
        author: "송인호 변호사"
    },
    body: {
        content: `<p>
                            1. 자동차 보험 표준 약관을 검토하고자 하는데, 우선 피보험자는 보험회사에 보상을 청구할 수 있는 자를
                            말하는데, 기명 피보험자(피보험 자동차를 소유, 사용, 관리하는 자 중에서 보험계약자가 지정하여 보험 증권의
                            기명피보험자란에 기재된 자), 친족 피보험자(기명피보험자와 같이 살거나 살림을 같이 하는 친족으로서 피보험
                            자동차를 사용, 관리하는 자), 승낙 피보험자(기명피보험자의 승낙을 얻어 피보험 자동차를 사용, 관리하는 자),
                            사용 피보험자(기명피보험자의 사용자 또는 이에 준하는 자) 및 운전 피보험자(다른 피보험자를 위하여 피보험
                            자동차를 운전 중인 자)로 나뉩니다.
                        </p>

                        <p>
                            2. 대인배상 1에서 말하는 피보험자는 위 1. 항에서 살펴본 기명, 친족, 승낙, 사용 및 운전 피보험자를
                            말하는데, 자동차 손해배상 보장법 자동차 보험자에 해당하는 자가 있다면 그 자도 대인배상 1의 피보험자로
                            보고, 대인배상 2와 대물배상에서의 피보험자는 기명, 친족, 사용 피보험자는 제외이 없고, 승낙 및 운전
                            피보험자의 경우 자동차 취급업자가 업무상 위탁받은 피보험 자동차를 사용하거나 관리하는 경우에는
                            피보험자에서 제외합니다.
                        </p>

                        <p>
                            3. 승낙 피보험자의 승낙과 관련하여, 기명피보험자로부터의 명시적, 개별적 승낙을 받아야만 하는 것이 아니고,
                            묵시적 포괄적인 승낙이어도 무방한데, 그 승낙은 기명피보험자로부터 승낙임을 요하고, 기명피보험자로부터
                            승낙인 이상 승낙은 승낙 피보험자에게 직접적으로 하건 전대를 승낙하는 등 간접적으로 하건 상관이 없습니다.
                        </p>`
    },
    footer: {
        author: "송인호 변호사",
        company: "정현 법률사무소",
        writeCount: 172,
        replyCount: 1043,
    }

}

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
