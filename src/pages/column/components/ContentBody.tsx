interface props {
    body: string;
}

export default function ContentBody({ body }: props) {
    return (
        <article className="prose prose-gray max-w-none">
            <div className="space-y-6 text-gray-700 leading-relaxed"
                 dangerouslySetInnerHTML={{ __html: body }}>
            </div>
        </article>
    )
}