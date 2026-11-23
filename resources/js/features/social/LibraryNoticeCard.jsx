import PostBookCard from './PostBookCard';

export default function LibraryNoticeCard({ notice, preview = false, admin = false, summary = false, children }) {
    const { author, content, images = [], books = [], publishedAt } = notice;

    return (
        <article className="min-w-0 space-y-4 rounded-2xl border border-slate-200 bg-white p-4 text-slate-800 sm:p-5">
            <header className="flex items-start gap-3">
                <div className="bg-lumi-navy flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-bold text-white">
                    {author.profile_photo
                        ? <img src={author.profile_photo} alt="" className="size-full object-cover" />
                        : author.name.slice(0, 1).toLocaleUpperCase('pt-BR')}
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold break-words">{author.name} <span className="font-normal text-slate-600">publicou</span></h3>
                    {author.username && <p className="text-xs text-slate-500">@{author.username}</p>}
                    {publishedAt && (
                        <time dateTime={publishedAt} className="text-xs text-slate-500">
                            {new Date(publishedAt).toLocaleString('pt-BR', { dateStyle: 'medium', timeStyle: 'short' })}
                        </time>
                    )}
                </div>
                {notice.removedAt && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">Retirado do mural</span>}
            </header>
            {content && <p className={`text-sm leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere] ${summary ? 'line-clamp-3' : ''}`}>{content}</p>}
            {!summary && images.length > 0 && (
                <div className={`grid gap-2 ${images.length > 1 ? 'sm:grid-cols-2' : ''}`}>
                    {images.map((src, index) => (
                        <img key={src} src={src} alt={`Imagem ${index + 1} do comunicado`} loading={preview ? 'eager' : 'lazy'} className="max-h-96 w-full rounded-xl bg-slate-50 object-contain" />
                    ))}
                </div>
            )}
            {!summary && books.map((book) => <PostBookCard key={book.id} book={book} preview={preview || admin} />)}
            {children}
        </article>
    );
}
