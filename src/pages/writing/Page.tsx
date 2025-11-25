"use client"

import {useEffect, useState} from "react"
import TitleInput from "./components/TitleInput.tsx";
import ContentInput from "./components/ContentInput.tsx";
import Sidebar from "./components/Sidebar.tsx";
import TopicSelection from "./components/TopicSelection.tsx";
import DurationSelection from "./components/DurationSelection.tsx";
import type TopicType from "./types/TopicType.ts";
import {useNavigate} from "react-router-dom";
import HashTagInput from "./components/HashTagInput.tsx";
import {createProposal} from "../../api/proposal/proposal.ts";
import type CreateProposalResponse from "../../api/proposal/type/CreateProposalResponse.ts";
import type ErrorResponse from "../../api/type/ErrorResponse.ts";
import {getTopicList} from "../../api/topic/topic.ts";

// const topicsMock: TopicType[] = [
//     {
//         id: -1,
//         region: "선택 안함",
//         title: "선택 안함",
//     },
//     {
//         id: 1,
//         region: "전남 곡성군",
//         title: "청년 농부들이 만든 스마트팜 협동조합",
//     },
//     {
//         id: 2,
//         region: "강원 춘천시",
//         title: "도심 속 폐공장을 청년 창업 공간으로 재탄생",
//     },
//     {
//         id: 3,
//         region: "전북 전주시",
//         title: "지역 예술가와 함께 하는 ‘거리 예술 축제’ 운영",
//     },
//     {
//         id: 4,
//         region: "경북 안동시",
//         title: "전통시장 디지털화로 소상공인 매출 30%↑",
//     },
//     {
//         id: 5,
//         region: "제주 서귀포시",
//         title: "친환경 전기차 공유로 탄소중립 도시 실현",
//     },
//     {
//         id: 6,
//         region: "서울 은평구",
//         title: "주민이 직접 기획하는 마을 의사결정 플랫폼",
//     },
// ];

function TopicSelectionSkeleton() {
    return (
        <div className="mb-6">
            <div className="mb-2 h-4 w-24 rounded-full bg-gray-200" /> {/* 라벨 자리 */}
            <div className="h-10 w-full rounded-md bg-gray-100" />       {/* 드롭다운 자리 */}
        </div>
    );
}

export default function WritingPage() {
    // const [author, setAuthor] = useState("");
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [selectedTopicId, setSelectedTopicId] = useState<number>(-1)
    const [selectedTopic, setSelectedTopic] = useState("")
    const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false)
    const [postingPeriod, setPostingPeriod] = useState("")
    const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false)
    const [dueDate, setDueDate] = useState("")
    const [topics, setTopics] = useState<TopicType[]>([])
    const [loading, setLoading] = useState(true);

    const [selectedHashTags, setSelectedHashTags] = useState<string[]>([]);


    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const res = await getTopicList();
                if (!res.ok) {
                    alert(res.message);
                    return
                }

                const topics = res.result.map(r => {
                    return {
                        id: r.id,
                        region: r.region,
                        title: r.title,
                    }
                })

                setTopics([
                    {
                        id: -1,
                        region: "선택 안함",
                        title: "선택 안함",
                    },
                    ...topics,
                ]);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);


    // const authorMaxLength = 10
    // const authorMinLength = 1
    const titleMaxLength = 30
    const titleMinLength = 5
    const contentMaxLength = 150
    const contentMinLength = 5

    const navigate = useNavigate();

    const postingPeriods = [
        // { label: "1일", value: "1day" },
        // { label: "3일", value: "3days" },
        { label: "7일", value: "7days" },
        { label: "14일", value: "14days" },
        { label: "30일", value: "30days" },
        // { label: "무제한", value: "unlimited" },
    ]

    const handleSubmit = async () => {
        if (!dueDate) {
            alert(`게시 기간을 설정해야 합니다.`);
            return;
        }

        if (title.length < titleMinLength) {
            alert(`제목은 최소 ${titleMinLength}자 이상이어야 합니다.`)
            return
        }
        if (content.length < contentMinLength) {
            alert(`내용은 최소 ${contentMinLength}자 이상이어야 합니다.`)
            return
        }

        const res: CreateProposalResponse | ErrorResponse = await createProposal({
            userId: localStorage.getItem("userId") ?? "",
            title: title,
            body: content,
            hashtags: selectedHashTags,
            dueDate: dueDate,
            ...(selectedTopicId != null && { topicId: selectedTopicId }),
        })

        if (!res.ok) {
            alert(res.message)
        } else {
            navigate(`/discussions/${res.proposalId}`)
        }
    }

    return (
        <div className="">
            <div className="mx-auto max-w-7xl px-4 py-8">
                <div className="flex gap-6">
                    {/* Main Form */}
                    <div className="flex-1">
                        <div className="rounded-lg bg-white p-8 shadow-sm">
                            {/* Title Field */}
                            {/*<AuthorInput*/}
                            {/*    author={author}*/}
                            {/*    setAuthor={setAuthor}*/}
                            {/*    authorMaxLength={authorMaxLength}*/}
                            {/*    authorMinLength={authorMinLength}*/}
                            {/*/>*/}

                            {/* Title Field */}
                            <TitleInput
                                title={title}
                                setTitle={setTitle}
                                titleMinLength={titleMinLength}
                                titleMaxLength={titleMaxLength}
                            />

                            {/* Topic Field */}
                            {loading ? (
                                <TopicSelectionSkeleton />
                            ) : (
                                <TopicSelection
                                    topics={topics}
                                    selectedTopic={selectedTopic}
                                    setSelectedTopicId={setSelectedTopicId}
                                    setSelectedTopic={setSelectedTopic}
                                    isTopicDropdownOpen={isTopicDropdownOpen}
                                    setIsTopicDropdownOpen={setIsTopicDropdownOpen}
                                />
                            )}

                            {/* Duration Field */}
                            <DurationSelection
                                isPeriodDropdownOpen={isPeriodDropdownOpen}
                                setIsPeriodDropdownOpen={setIsPeriodDropdownOpen}
                                postingPeriod={postingPeriod}
                                setPostingPeriod={setPostingPeriod}
                                postingPeriods={postingPeriods}
                                setDueDate={setDueDate}
                            />

                            {/* Content Field */}
                            <ContentInput
                                content={content}
                                setContent={setContent}
                                contentMaxLength={contentMaxLength}
                                contentMinLength={contentMinLength}
                            />

                            {/* Hashtag Field */}
                            <HashTagInput
                                selectedHashTags={selectedHashTags}
                                setSelectedHashTags={setSelectedHashTags}
                            />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <Sidebar handleSubmit={handleSubmit} />
                </div>
            </div>
        </div>
    )
}
