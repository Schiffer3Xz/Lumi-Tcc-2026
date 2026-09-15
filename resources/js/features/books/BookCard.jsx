import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { useRef, useState } from 'react';
import BookDetailsLink from './BookDetailsLink';

export default function BookCard({
    book,
    variant = 'catalog',
    showRating = book.rating !== undefined && book.rating !== null,
    className,
    imageClassName,
    showActions = false,
    children,
}) {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const pending = useRef(false);
    const isFavorite = Boolean(book.is_favorite);

    const setFavorite = (favorite) => {
        if (pending.current) return;
        pending.current = true;
        setBusy(true);
        setError('');
        router.visit(route('book.favorite', book.id), {
            method: favorite ? 'put' : 'delete',
            preserveScroll: true,
            preserveState: true,
            onError: () => setError('Não foi possível atualizar a estante. Tente novamente.'),
            onFinish: () => {
                pending.current = false;
                setBusy(false);
            },
        });
    };

    return (
        <article
            className={cn(
                variant === 'catalog'
                    ? 'group relative flex min-h-56 w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-[#F8F9FA] shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md'
                    : 'group relative aspect-[2/3] w-full overflow-hidden rounded-2xl border border-slate-100 bg-[#1A2332] shadow-sm transition-all duration-200 hover:scale-[1.02]',
                variant === 'featured' ? 'hover:shadow-md' : 'hover:shadow-lg',
                className,
            )}
        >
            <BookDetailsLink
                bookId={book.id}
                className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-600"
            >
                <span className="sr-only">Ver detalhes de {book.title}</span>
            </BookDetailsLink>
            {showActions && (
                <button
                    type="button"
                    disabled={busy}
                    onClick={() => setFavorite(!isFavorite)}
                    aria-label={`${isFavorite ? 'Remover dos favoritos' : 'Favoritar'}: ${book.title}`}
                    aria-pressed={isFavorite}
                    title={isFavorite ? 'Remover dos favoritos e da estante' : 'Favoritar livro'}
                    className={cn(
                        'absolute top-2 right-2 z-20 flex h-9 w-9 items-center justify-center rounded-full border bg-white/95 shadow-sm transition-colors disabled:opacity-50',
                        isFavorite
                            ? 'border-rose-200 text-rose-500 hover:bg-rose-50'
                            : 'border-slate-200 text-slate-400 hover:border-rose-200 hover:text-rose-500',
                    )}
                >
                    <i className={`${isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart text-base`} aria-hidden="true" />
                </button>
            )}
            {variant === 'catalog' ? (
                <>
                    <div
                        className={cn(
                            'aspect-[2/3] h-56 shrink-0 overflow-hidden bg-slate-100 sm:h-60',
                            showActions ? 'w-28 sm:w-32' : 'w-40 sm:w-44',
                            imageClassName,
                        )}
                    >
                        {book.cover_url ? (
                            <img src={book.cover_url} alt={book.title} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                                <i className="fa-solid fa-book text-2xl" aria-hidden="true" />
                            </div>
                        )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
                        <h3 className={cn('line-clamp-2 text-sm leading-tight font-bold text-slate-900', showActions && 'pr-9')}>{book.title}</h3>
                        <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-slate-600">
                            <i className="fa-solid fa-star text-[10px] text-yellow-400" aria-hidden="true" />
                            <span>{Number(book.rating || 0).toFixed(1)}</span>
                        </div>
                        <div className="mt-auto grid grid-cols-2 gap-x-2 gap-y-2 border-t border-slate-200/80 pt-3 text-[10px] text-slate-500">
                            <span className="flex min-w-0 items-center gap-1">
                                <i className="fa-solid fa-building text-[9px] text-slate-400" />
                                <span className="truncate">{book.publisher ?? 'Editora não informada'}</span>
                            </span>
                            <span className="flex items-center gap-1">
                                <i className="fa-solid fa-file-lines text-[9px] text-slate-400" />
                                {book.page_count ?? '-'} págs.
                            </span>
                            <span className="flex items-center gap-1">
                                <i className="fa-regular fa-calendar text-[9px] text-slate-400" />
                                {book.publication_year ?? '-'}
                            </span>
                            <span className="flex items-center gap-1">
                                <i className="fa-solid fa-users text-[9px] text-slate-400" />
                                {book.readers_count ?? 0} leitores
                            </span>
                        </div>
                        {error && (
                            <p role="alert" className="relative z-20 mt-2 text-xs text-red-600">
                                {error}
                            </p>
                        )}
                    </div>
                </>
            ) : book.cover_url ? (
                <img src={book.cover_url} alt={book.title} className="h-full w-full object-cover" />
            ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#1A2332] to-[#253248] p-4 text-center">
                    <i className="fa-solid fa-book mb-2 text-3xl text-yellow-300/40" aria-hidden="true" />
                    <span className="line-clamp-3 px-2 text-xs font-semibold text-white/80">{book.title}</span>
                </div>
            )}
            {showRating && variant !== 'catalog' && (
                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-lg bg-[#1A2332]/85 px-2.5 py-1 backdrop-blur-sm">
                    <i className="fa-solid fa-star text-[10px] text-yellow-400" aria-hidden="true" />
                    <span className="text-xs font-bold text-white" aria-label={`Avaliação: ${Number(book.rating || 0).toFixed(1)}`}>
                        {Number(book.rating || 0).toFixed(1)}
                    </span>
                </div>
            )}
            {children}
        </article>
    );
}
