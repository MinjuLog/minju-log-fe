interface props {
    author: string;
    setAuthor: (author: string) => void;
    authorMinLength: number;
    authorMaxLength: number;
}

export default function AuthorInput({ author, setAuthor, authorMinLength, authorMaxLength }: props) {
    return (
        <div className="mb-8">
            <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-900">작성자</label>
                <span className="text-sm text-gray-500">
                    {author.length} / {authorMaxLength}자 (최소 {authorMinLength}자)
                  </span>

            </div>
            <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value.slice(0, authorMaxLength))}
                placeholder="작성자 이름을 입력해주세요."
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
        </div>
    )
}