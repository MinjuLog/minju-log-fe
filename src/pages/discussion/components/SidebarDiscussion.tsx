import type SidebarDiscussionType from "../types/SidebarDiscussionType.ts";
import {useNavigate} from "react-router-dom";

interface props {
    sidebarDiscussion: SidebarDiscussionType;
}

export default function SidebarDiscussion({ sidebarDiscussion }: props) {
    const navigate = useNavigate();
    return (
        <div className="rounded-2xl p-5 bg-gray-100">
            <p className="mb-2 text-center text-sm text-gray-600">
                종료까지 {sidebarDiscussion.endLeft} 남음
            </p>

            <h3 className="mb-4 text-center text-lg font-bold leading-tight text-gray-900">
                {sidebarDiscussion.mainTitle}
                <br/>
                {sidebarDiscussion.subTitle}
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
                <span className="text-sm font-medium text-red-500">{sidebarDiscussion.best}</span>
            </div>

            <p
                className="
                mb-8 text-[13px] leading-relaxed text-gray-500
                overflow-hidden
                "
                style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical"
                }}
            >
                {sidebarDiscussion.content}
            </p>

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
                        <p className="text-[13px]">{sidebarDiscussion.votes}명 투표 중!</p>
                    </div>
                </div>

                {/* 🔵 투표 버튼 */}
                <button
                    onClick={() => {
                        navigate(`/discussions/${sidebarDiscussion.id}`);
                        // 이동 직후 새로고침
                        window.location.reload();
                    }}
                    className="text-white w-full rounded-full bg-blue-600 py-2 text-base hover:bg-blue-700"
                >
                    투표하기
                </button>
            </div>
        </div>
    );
}