import { cn } from '@/lib/utils';

export default function BookCard({ book, variant = 'catalog', showRating = book.rating !== undefined && book.rating !== null, className, children }) {
    return (
        <div
            className={cn(
                'group relative aspect-[2/3] w-full overflow-hidden rounded-2xl border border-slate-100 bg-[#1A2332] shadow-sm transition-all duration-200 hover:scale-[1.02]',
                variant === 'featured' ? 'hover:shadow-md' : 'hover:shadow-lg',
                className,
            )}
        >
            {book.cover_url ? (
                <img src={book.cover_url} alt={book.title} className="h-full w-full object-cover" />
            ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#1A2332] to-[#253248] p-4 text-center">
                    <i className="fa-solid fa-book mb-2 text-3xl text-yellow-300/40" aria-hidden="true" />
                    <span className="line-clamp-3 px-2 text-xs font-semibold text-white/80">{book.title}</span>
                </div>
            )}
            {showRating && (
                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-lg bg-[#1A2332]/85 px-2.5 py-1 backdrop-blur-sm">
                    <i className="fa-solid fa-star text-[10px] text-yellow-400" aria-hidden="true" />
                    <span className="text-xs font-bold text-white" aria-label={`Avaliação: ${Number(book.rating || 0).toFixed(1)}`}>
                        {Number(book.rating || 0).toFixed(1)}
                    </span>
                </div>
            )}
            {children}
        </div>
    );
}
