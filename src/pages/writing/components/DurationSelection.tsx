import addDaysToToday from "../util/addDaysToDay.ts";

interface props {
    isPeriodDropdownOpen: boolean;
    setIsPeriodDropdownOpen: (isPeriodDropdownOpen: boolean) => void;
    postingPeriod: string;
    setPostingPeriod: (postingPeriod: string) => void;
    postingPeriods: {
        value: string;
        label: string;
    }[]
    setDueDate: (setDueDate: string) => void;
}

export default function DurationSelection({ isPeriodDropdownOpen, setIsPeriodDropdownOpen, postingPeriod, setPostingPeriod, postingPeriods, setDueDate }: props) {
    return (
        <div className="mb-8">
            <label className="mb-2 block text-sm font-medium text-gray-900">게시 기간</label>
            <p className="mb-3 text-sm text-gray-500">질문이 게시될 기간을 선택해주세요.</p>
            <div className="relative">
                <button
                    onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)}
                    className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-left text-gray-500 hover:border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    <span>
                      {postingPeriod ? postingPeriods.find((p) => p.value === postingPeriod)?.label : "게시 기간 선택"}
                    </span>
                    <svg
                        className={`h-5 w-5 transition-transform ${isPeriodDropdownOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                    </svg>
                </button>

                {isPeriodDropdownOpen && (
                    <div className="absolute z-10 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                        {postingPeriods.map((period) => (
                            <button
                                key={period.value}
                                onClick={() => {
                                    setPostingPeriod(period.value)
                                    setDueDate(addDaysToToday(period.value))
                                    setIsPeriodDropdownOpen(false)
                                }}
                                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
                            >
                                {period.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}