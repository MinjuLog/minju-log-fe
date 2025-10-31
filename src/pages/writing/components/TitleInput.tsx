interface props {
    title: string;
    setTitle: (newTitle: string) => void;
    titleMinLength: number;
    titleMaxLength: number;
}

export default function TitleInput({ title, setTitle, titleMinLength, titleMaxLength }: props) {
    return (
        <div className="mb-8">
            <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-900">제목</label>
                <span className="text-sm text-gray-500">
                                        {title.length} / {titleMaxLength}자 (최소 {titleMinLength}자)
                                      </span>
            </div>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, titleMaxLength))}
                placeholder="제목을 작성해 주세요."
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
        </div>
    )
}