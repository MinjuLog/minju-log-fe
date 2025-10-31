import type TopicType from "../types/TopicType.ts";

interface props {
    topics: TopicType[]
    selectedTopicId?: number | null
    selectedTopic: string
    setSelectedTopic: (topic: string) => void
    setSelectedTopicId?: (id: number | null) => void
    isTopicDropdownOpen: boolean
    setIsTopicDropdownOpen: (isOpen: boolean) => void
}

export default function TopicSelection({
                                           topics,
                                           selectedTopicId,
                                           selectedTopic,
                                           setSelectedTopic,
                                            isTopicDropdownOpen,
                                            setIsTopicDropdownOpen,
                                       }: props) {

    return (
        <div className="mb-8">
            <label className="mb-2 block text-sm font-medium text-gray-900">토픽</label>
            <p className="mb-3 text-sm text-gray-500">
                "다른 지역은?" 에 존재하는 토픽을 인용할 수 있어요
            </p>

            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsTopicDropdownOpen(!isTopicDropdownOpen)}
                    className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-left text-gray-500 hover:border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    <span>{selectedTopic || "관련 토픽 선택"}</span>
                    <svg
                        className={`h-5 w-5 transition-transform ${
                            isTopicDropdownOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>

                {isTopicDropdownOpen && (
                    <div className="absolute z-10 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                        {topics.map((topic) => (
                            topic.id === -1 ? (
                                <button
                                    key={topic.id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedTopic("")
                                        setIsTopicDropdownOpen(false)
                                    }}
                                    className={`w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 ${
                                        topic.id === selectedTopicId ? "bg-gray-100 font-medium" : ""
                                    }`}
                                >
                                    {topic.title}
                                </button>
                            ) : (
                                <button
                                    key={topic.id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedTopic(`(${topic.region}) ${topic.title}`)
                                        //setSelectedTopicId(topic.id)
                                        setIsTopicDropdownOpen(false)
                                    }}
                                    className={`w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 ${
                                        topic.id === selectedTopicId ? "bg-gray-100 font-medium" : ""
                                    }`}
                                >
                                    {`(${topic.region}) ${topic.title}`}
                                </button>
                            )
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}