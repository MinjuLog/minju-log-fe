import {Link} from "react-router-dom";

interface DiscussionElemType {
    id: string,
    endLeft: number;
    mainTitle: string;
    subTitle: string;
    best: string;
    content: string;
    votes: number;
}

const discussionsMock: DiscussionElemType[] = [
    {
        endLeft: 4,
        mainTitle: "하루 100개 인형뽑기",
        subTitle: "영업 방해일까",
        best: "정당한 개인 자유",
        content: "당연히 정당한 자유죠. 과하면 민폐라고 하시는 분들은 어떤 마인드인가? 정당한 돈을 ...",
        votes: 494,
        id: "claw-01",
    },
    {
        endLeft: 4,
        mainTitle: "하루 100개 인형뽑기",
        subTitle: "영업 방해일까",
        best: "정당한 개인 자유",
        content: "당연히 정당한 자유죠. 과하면 민폐라고 하시는 분들은 어떤 마인드인가? 정당한 돈을 ...",
        votes: 494,
        id: "claw-02",
    },
];


function DiscussionElem({ item }: { item: DiscussionElemType }) {
    return (
        <div className="rounded-2xl p-5 bg-gray-100">
            <p className="mb-2 text-center text-sm text-gray-600">
                종료까지 {item.endLeft}일 남음
            </p>

            <h3 className="mb-4 text-center text-lg font-bold leading-tight text-gray-900">
                {item.mainTitle}
                <br/>
                {item.subTitle}
            </h3>

            <div className="mb-4 flex items-center gap-2">
                <div
                    className="flex justify-content-center items-center gap-1 rounded-sm p-1 bg-red-500 hover:bg-red-600">
                    <svg fill="none" height="10" viewBox="0 0 26 30" width="10" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10.5519 0.384617C11.4185 0.652531 21.9801 4.19638 19.9154 17.6177C20.9332 16.8338 22.19 15.327 22.5327 12.5495C22.5893 12.0792 23.0116 11.7434 23.4767 11.8007C23.764 11.8358 24.0006 12.0137 24.1241 12.2558C26.0293 15.6546 26.0363 19.3304 24.8719 22.4204C24.3895 23.7014 23.7006 24.8866 22.8581 25.9126C22.0111 26.9444 21.014 27.809 19.9189 28.4431C17.7436 29.7043 15.1829 30.0798 12.636 29.0959C11.3805 28.6104 9.82601 27.7084 8.73993 26.0458C8.01868 24.9402 7.51208 23.5129 7.45436 21.6716C6.55422 23.2943 5.82145 25.6996 6.86466 28.5062C7.02968 28.9496 6.80926 29.4445 6.37073 29.6118C6.15032 29.696 5.91719 29.6797 5.71873 29.5872C4.71244 29.1134 3.85039 28.4992 3.13029 27.7773C1.54468 26.1909 0.651485 24.1024 0.404509 21.875C0.161012 19.6838 0.545297 17.3532 1.51236 15.2426C2.10782 13.9428 2.9237 12.7237 3.95193 11.6695C4.13426 11.4811 4.32812 11.2869 4.52317 11.0904C6.6604 8.9342 9.03758 6.53345 9.41277 1.13432C9.44393 0.661678 9.84669 0.303683 10.3129 0.33525C10.396 0.3411 10.4756 0.358649 10.5495 0.386729L10.5519 0.384617Z"
                            fill="white"></path>
                    </svg>
                    <p className="text-[11px] text-white">베스트</p>
                </div>
                <span className="text-sm font-medium text-red-500">{item.best}</span>
            </div>

            <p className="mb-8 text-[13px] leading-relaxed text-gray-500">{item.content}</p>

            <div className="relative w-full">
                {/* 🔥 베스트 배지 */}
                <div className="absolute left-1/2 -top-7 -translate-x-1/2">
                    <div className="flex items-center gap-1 rounded-lg p-2 bg-white shadow-lg">
                        <svg
                            fill="red"
                            height="15"
                            viewBox="0 0 26 30"
                            width="15"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M10.5519 0.384617C11.4185 0.652531 21.9801 4.19638 19.9154 17.6177C20.9332 16.8338 22.19 15.327 22.5327 12.5495C22.5893 12.0792 23.0116 11.7434 23.4767 11.8007C23.764 11.8358 24.0006 12.0137 24.1241 12.2558C26.0293 15.6546 26.0363 19.3304 24.8719 22.4204C24.3895 23.7014 23.7006 24.8866 22.8581 25.9126C22.0111 26.9444 21.014 27.809 19.9189 28.4431C17.7436 29.7043 15.1829 30.0798 12.636 29.0959C11.3805 28.6104 9.82601 27.7084 8.73993 26.0458C8.01868 24.9402 7.51208 23.5129 7.45436 21.6716C6.55422 23.2943 5.82145 25.6996 6.86466 28.5062C7.02968 28.9496 6.80926 29.4445 6.37073 29.6118C6.15032 29.696 5.91719 29.6797 5.71873 29.5872C4.71244 29.1134 3.85039 28.4992 3.13029 27.7773C1.54468 26.1909 0.651485 24.1024 0.404509 21.875C0.161012 19.6838 0.545297 17.3532 1.51236 15.2426C2.10782 13.9428 2.9237 12.7237 3.95193 11.6695C4.13426 11.4811 4.32812 11.2869 4.52317 11.0904C6.6604 8.9342 9.03758 6.53345 9.41277 1.13432C9.44393 0.661678 9.84669 0.303683 10.3129 0.33525C10.396 0.3411 10.4756 0.358649 10.5495 0.386729L10.5519 0.384617Z"
                                fill="red"
                            ></path>
                        </svg>
                        <p className="text-[13px]">{item.votes}명 투표 중!</p>
                    </div>
                </div>

                {/* 🔵 투표 버튼 */}
                <button className="text-white w-full rounded-full bg-blue-600 py-2 text-base hover:bg-blue-700">
                    투표하기
                </button>
            </div>
        </div>
    );
}

export default function Sidebar() {
    const data: DiscussionElemType[] = discussionsMock; // 필요한 만큼 사용

    return (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="sticky top-4 space-y-4">
                {/* Home Link */}
                <Link to="/" className="mb-4 flex items-center rounded-lg p-1 hover:bg-gray-100">
                    <span className="font-medium text-gray-900">스파링 홈</span>
                    <svg className="css-111o5ku" fill="none" height="20" viewBox="0 0 20 20" width="20"
                         xmlns="http://www.w3.org/2000/svg">
                        <path clipRule="evenodd"
                              d="M6.57967 16.629C6.14033 16.1897 6.14033 15.4773 6.57967 15.038L11.6175 10.0002L6.57967 4.96233C6.14033 4.52299 6.14033 3.81068 6.57967 3.37134C7.01901 2.932 7.73132 2.932 8.17066 3.37134L14.004 9.20467C14.4433 9.64401 14.4433 10.3563 14.004 10.7957L8.17066 16.629C7.73132 17.0683 7.01901 17.0683 6.57967 16.629Z"
                              fill="var(--color-gray-800)" fillRule="evenodd"></path>
                    </svg>
                </Link>

                {/* 목 데이터로 렌더 */}
                {data.map(item => <DiscussionElem item={item}/>)}
            </div>
        </div>
    );
}