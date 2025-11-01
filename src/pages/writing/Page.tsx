"use client"

import { useState } from "react"
import TitleInput from "./components/TitleInput.tsx";
import ContentInput from "./components/ContentInput.tsx";
import Sidebar from "./components/Sidebar.tsx";
import TopicSelection from "./components/TopicSelection.tsx";
import DurationSelection from "./components/DurationSelection.tsx";
import type TopicType from "./types/TopicType.ts";
import {useNavigate} from "react-router-dom";

const topicsMock: TopicType[] = [
    {
        id: -1,
        region: "선택 안함",
        title: "선택 안함",
    },
    {
        id: 1,
        region: "전남 곡성군",
        title: "청년 농부들이 만든 스마트팜 협동조합",
    },
    {
        id: 2,
        region: "강원 춘천시",
        title: "도심 속 폐공장을 청년 창업 공간으로 재탄생",
    },
    {
        id: 3,
        region: "전북 전주시",
        title: "지역 예술가와 함께 하는 ‘거리 예술 축제’ 운영",
    },
    {
        id: 4,
        region: "경북 안동시",
        title: "전통시장 디지털화로 소상공인 매출 30%↑",
    },
    {
        id: 5,
        region: "제주 서귀포시",
        title: "친환경 전기차 공유로 탄소중립 도시 실현",
    },
    {
        id: 6,
        region: "서울 은평구",
        title: "주민이 직접 기획하는 마을 의사결정 플랫폼",
    },
];


export default function WritingPage() {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [selectedTopic, setSelectedTopic] = useState("")
    const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false)
    const [postingPeriod, setPostingPeriod] = useState("")
    const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false)

    const titleMaxLength = 80
    const titleMinLength = 5
    const contentMaxLength = 10000
    const contentMinLength = 5

    const navigate = useNavigate();

    const postingPeriods = [
        { label: "1일", value: "1day" },
        { label: "3일", value: "3days" },
        { label: "7일", value: "7days" },
        { label: "14일", value: "14days" },
        { label: "30일", value: "30days" },
        { label: "무제한", value: "unlimited" },
    ]

    const handleImageUpload = () => {
        // Image upload logic
        console.log("[v0] Image upload clicked")
    }

    const handleBulletList = () => {
        // Insert bullet list
        console.log("[v0] Bullet list clicked")
    }

    const handleBold = () => {
        // Apply bold formatting
        console.log("[v0] Bold clicked")
    }

    const handleLink = () => {
        // Insert link
        console.log("[v0] Link clicked")
    }

    const handleSubmit = () => {
        if (title.length < titleMinLength) {
            alert(`제목은 최소 ${titleMinLength}자 이상이어야 합니다.`)
            return
        }
        if (content.length < contentMinLength) {
            alert(`내용은 최소 ${contentMinLength}자 이상이어야 합니다.`)
            return
        }
        navigate("/discussions/1")
        console.log("[v0] Submitting:", { title, content, selectedTopic, postingPeriod })
    }

    return (
        <div className="">
            <div className="mx-auto max-w-7xl px-4 py-8">
                <div className="flex gap-6">
                    {/* Main Form */}
                    <div className="flex-1">
                        <div className="rounded-lg bg-white p-8 shadow-sm">
                            {/* Title Field */}
                            <TitleInput
                                title={title}
                                setTitle={setTitle}
                                titleMinLength={titleMinLength}
                                titleMaxLength={titleMaxLength}
                            />

                            {/* Topic Field */}
                            <TopicSelection
                                //selectedTopicId={selectedTopicId}
                                topics={topicsMock}
                                selectedTopic={selectedTopic}
                                setSelectedTopic={setSelectedTopic}
                                isTopicDropdownOpen={isTopicDropdownOpen}
                                setIsTopicDropdownOpen={setIsTopicDropdownOpen}
                                //setSelectedTopicId={setSelectedTopicId}
                            />

                            {/* Duration Field */}
                            <DurationSelection
                                isPeriodDropdownOpen={isPeriodDropdownOpen}
                                setIsPeriodDropdownOpen={setIsPeriodDropdownOpen}
                                postingPeriod={postingPeriod}
                                setPostingPeriod={setPostingPeriod}
                                postingPeriods={postingPeriods}
                            />

                            {/* Content Field */}
                            <ContentInput
                                content={content}
                                setContent={setContent}
                                handleImageUpload={handleImageUpload}
                                contentMaxLength={contentMaxLength}
                                contentMinLength={contentMinLength}
                                handleBulletList={handleBulletList}
                                handleBold={handleBold}
                                handleLink={handleLink}
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
