interface props {
    body: string;
}

export default function ContentBody({ body }: props) {
    const html = body
        .replace(/<a /g, '<a style="color:#2563eb;text-decoration:underline" ')
        .replace(
            /<h1>/g,
            '<h1 style="font-size:1.75rem;font-weight:600;color:#111827;margin-bottom:0;">'
        )
        .replace(
            /<h3>/g,
            '<h3 style="font-size:1.25rem;font-weight:600;color:#111827;margin:0;">'
        );
    return (
        <article className="prose prose-gray max-w-none">
            <div className="space-y-6 text-gray-700 leading-relaxed"
                 dangerouslySetInnerHTML={{ __html: html }}>
            </div>
        </article>
    )
}