import ReaderLayout from '@/layouts/reader-layout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

const relationName = (value, fallback = 'Não informado') => value?.name || fallback;

export default function BookDetails({ book, similarBooks = [], comments = [], auth }) {
    const user = auth?.user ?? { name: 'Usuário', email: '' };
    const availability = book.availability?.availability || relationName(book.availability, 'Disponibilidade não informada');
    const isAvailable = /dispon[ií]vel|disponibilidade|livre/i.test(availability);
    const [isFavorite, setIsFavorite] = useState(book.is_favorite || false);
    const [activeTab, setActiveTab] = useState('synopsis');
    const [userRating, setUserRating] = useState(book.user_rating || 0);
    const [comment, setComment] = useState(book.user_comment || '');
    const [isCommentFormOpen, setIsCommentFormOpen] = useState(Boolean(book.user_rating));
    const [openCommentMenuId, setOpenCommentMenuId] = useState(null);

    const toggleFavorite = () => {
        router.post(route('book.favorite', book.id), {}, {
            preserveScroll: true,
            onSuccess: () => setIsFavorite((current) => !current),
        });
    };

    const rateBook = (rating) => {
        router.post(route('book.rating', book.id), { rating }, {
            preserveScroll: true,
            onSuccess: () => {
                setUserRating(rating);
                setIsCommentFormOpen(true);
            },
        });
    };

    const submitComment = () => {
        const text = comment.trim();
        if (!text || !userRating) return;

        router.post(route('book.rating', book.id), { rating: userRating, comment: text }, {
            preserveScroll: true,
            onSuccess: () => {
                setComment('');
                setIsCommentFormOpen(false);
            },
        });
    };

    const deleteComment = (commentId) => {
        setOpenCommentMenuId(null);

        if (window.confirm('Tem certeza que deseja excluir este comentário?')) {
            router.delete(route('book.comment.destroy', [book.id, commentId]), { preserveScroll: true });
        }
    };

    return (
        <ReaderLayout
            title="Detalhes do livro"
            user={user}
            activeItem="biblioteca"
            variant="library"
            topbar={{ title: 'Detalhes do livro', subtitle: 'Informações detalhadas do catálogo da biblioteca.' }}
        >
            <main className="mx-auto max-w-6xl pb-12">
                {/* Top Navigation & Actions Bar */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <Link 
                        href={route('catalogo')} 
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-800"
                    >
                        <i className="fa-solid fa-arrow-left text-xs" aria-hidden="true" />
                        Voltar ao catálogo
                    </Link>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={toggleFavorite}
                            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                                isFavorite 
                                    ? 'border-rose-200 bg-rose-50 text-rose-600' 
                                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            <i className={`${isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart text-base`} />
                            {isFavorite ? 'Nos Favoritos' : 'Favoritar'}
                        </button>

                    </div>
                </div>

                {/* Main Hero Showcase Card */}
                <article className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                    <div className="grid lg:grid-cols-[320px_minmax(0,1fr)]">
                        {/* Left Column: Cover & Quick Actions */}
                        <div className="relative flex flex-col items-center justify-between bg-gradient-to-b from-slate-100 to-slate-200/60 p-8">
                            <div className="absolute top-4 left-4">
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-sm ${
                                    isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                    <span className={`h-2 w-2 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                    {availability}
                                </span>
                            </div>

                            <div className="my-8 flex w-full justify-center">
                                {book.cover_url ? (
                                    <img 
                                        src={book.cover_url} 
                                        alt={book.title} 
                                        className="max-h-[440px] w-full max-w-[280px] rounded-2xl object-cover shadow-2xl ring-1 ring-slate-900/10 transition duration-300 hover:scale-[1.02]" 
                                    />
                                ) : (
                                    <div className="flex h-[420px] w-full max-w-[280px] flex-col items-center justify-center rounded-2xl bg-slate-900 p-6 text-center text-white shadow-xl">
                                        <i className="fa-solid fa-book mb-4 text-5xl text-yellow-400/80" aria-hidden="true" />
                                        <span className="font-bold text-lg leading-snug">{book.title}</span>
                                        <span className="mt-2 text-xs text-slate-400">{relationName(book.author)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="w-full rounded-2xl bg-white/80 p-4 backdrop-blur-md shadow-sm border border-slate-200/60 text-center">
                                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Formato do Acervo</span>
                                <p className="mt-1 font-medium text-slate-800 text-sm flex items-center justify-center gap-2">
                                    <i className="fa-solid fa-barcode text-blue-600" />
                                    ISBN / Código: {book.isbn || '978-85-XXXX-XXX-X'}
                                </p>
                            </div>
                        </div>

                        {/* Right Column: Complete Book Information */}
                        <div className="flex flex-col justify-between p-6 sm:p-10">
                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-bold tracking-wider text-blue-600 uppercase">
                                            {relationName(book.genre)}
                                        </span>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-xs font-medium text-slate-500">{book.publisher || 'Editora não informada'}</span>
                                    </div>
                                    <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                                        {book.title}
                                    </h1>
                                    <p className="mt-2 text-base font-medium text-slate-600">
                                        Escrito por <span className="text-slate-900 font-semibold">{relationName(book.author)}</span>
                                    </p>
                                </div>

                                {/* Metrics Grid */}
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                                        <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avaliação</span>
                                        <div className="mt-1.5 flex items-center gap-1.5">
                                            <i className="fa-solid fa-star text-yellow-400 text-sm" />
                                            <strong className="text-base text-slate-900">{Number(book.rating || 0).toFixed(1)}</strong>
                                            <span className="text-xs text-slate-400">/5.0</span>
                                        </div>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                                        <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Páginas</span>
                                            <strong className="mt-1.5 block text-base text-slate-900">{book.page_count ?? '-'}</strong>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                                        <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Publicação</span>
                                            <strong className="mt-1.5 block text-base text-slate-900">{book.publication_year ?? '-'}</strong>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                                        <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Leitores</span>
                                            <strong className="mt-1.5 block text-base text-slate-900">{book.readers_count ?? 0}</strong>
                                    </div>
                                </div>

                                {/* Interactive Navigation Tabs inside Details */}
                                <div className="border-b border-slate-200">
                                    <nav className="-mb-px flex gap-6">
                                        <button 
                                            onClick={() => setActiveTab('synopsis')}
                                            className={`pb-3 text-sm font-semibold border-b-2 transition ${
                                                activeTab === 'synopsis' 
                                                    ? 'border-blue-600 text-blue-600' 
                                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                                            }`}
                                        >
                                            Sinopse & Detalhes
                                        </button>
                                        <button 
                                            onClick={() => setActiveTab('author')}
                                            className={`pb-3 text-sm font-semibold border-b-2 transition ${
                                                activeTab === 'author' 
                                                    ? 'border-blue-600 text-blue-600' 
                                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                                            }`}
                                        >
                                            Sobre o Autor
                                        </button>
                                    </nav>
                                </div>

                                {/* Tab Content Area */}
                                <div className="pt-2 min-h-[160px]">
                                    {activeTab === 'synopsis' && (
                                        <div className="space-y-4 animate-fadeIn">
                                            <p className="text-sm leading-relaxed text-slate-600">
                                                {book.description || 'Descrição não cadastrada.'}
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                                                <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                                                    <i className="fa-solid fa-language text-blue-600" />
                                                    <span><strong>Idioma:</strong> Português (BR)</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                                                    <i className="fa-solid fa-bookmark text-blue-600" />
                                                    <span><strong>Gênero:</strong> {relationName(book.genre)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'author' && (
                                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 animate-fadeIn">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-lg shadow-md">
                                                {relationName(book.author).charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-base">{relationName(book.author)}</h3>
                                                <p className="mt-1 text-xs leading-relaxed text-slate-600">Informações adicionais do autor não cadastradas.</p>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>

                            {/* Community Rating Trigger */}
                            <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
                                <div className="text-xs text-slate-500">
                                    Avalie esta obra para ajudar outros leitores da comunidade.
                                </div>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button 
                                            key={star}
                                            onClick={() => rateBook(star)}
                                            className="text-lg transition hover:scale-110 focus:outline-none"
                                        >
                                            <i className={`${star <= userRating ? 'fa-solid text-yellow-400' : 'fa-regular text-slate-300'} fa-star`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {isCommentFormOpen && (
                                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <label htmlFor="book-comment" className="block text-sm font-semibold text-slate-800">
                                        Quer deixar algum comentário?
                                    </label>
                                    <textarea
                                        id="book-comment"
                                        value={comment}
                                        onChange={(event) => setComment(event.target.value)}
                                        maxLength={1000}
                                        placeholder="Conte o que achou desta leitura..."
                                        className="mt-3 min-h-24 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                    <div className="mt-3 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={submitComment}
                                            disabled={!comment.trim()}
                                            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Publicar comentário
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </article>

                {/* Secondary Section: Related Recommendations */}
                <section className="mt-10">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <i className="fa-solid fa-compass text-blue-600" />
                            Livros Similares no Acervo
                        </h2>
                        <span className="text-xs font-semibold text-slate-400">Recomendações baseadas no gênero</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {similarBooks.map((item) => (
                            <Link href={route('book.show', item.id)} key={item.id} className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:shadow-md">
                                <div className="flex h-20 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-800 text-center text-white shadow-inner">
                                    {item.cover_url ? <img src={item.cover_url} alt={item.title} className="h-full w-full object-cover" /> : <i className="fa-solid fa-book text-sm text-yellow-300/80" />}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-bold text-sm text-slate-900 truncate">{item.title}</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {relationName(item.author)}
                                    </p>
                                    <span className="mt-2 inline-block text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer">
                                        Ver detalhes →
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="mt-10 border-t border-slate-200 pt-8">
                    <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                        <i className="fa-solid fa-comments text-blue-600" aria-hidden="true" />
                        Comentários dos leitores
                    </h2>
                    {comments.length > 0 ? (
                        <div className="mt-5 space-y-3">
                            {comments.map((item) => (
                                <article key={item.id} className="flex items-start gap-2.5 pt-1 text-xs">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[11px] font-bold text-white">
                                        {item.author.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-2">
                                                <span className="truncate text-[11px] font-bold text-slate-800">{item.author}</span>
                                                <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                                                    <i className="fa-solid fa-star text-[9px] text-yellow-400" aria-hidden="true" />
                                                    {Number(item.rating).toFixed(1)}
                                                </span>
                                            </div>
                                            {item.can_delete && (
                                                <div className="relative shrink-0">
                                                    <button
                                                        type="button"
                                                        aria-label="Mais opções do comentário"
                                                        aria-expanded={openCommentMenuId === item.id}
                                                        onClick={() => setOpenCommentMenuId((current) => (current === item.id ? null : item.id))}
                                                        className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-white hover:text-slate-600"
                                                    >
                                                        <i className="fa-solid fa-ellipsis-vertical text-xs" aria-hidden="true" />
                                                    </button>
                                                    {openCommentMenuId === item.id && (
                                                        <div className="absolute top-full right-0 z-10 mt-1 w-28 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                                                            <button
                                                                type="button"
                                                                onClick={() => deleteComment(item.id)}
                                                                className="w-full rounded-md px-3 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50"
                                                            >
                                                                Excluir
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <p className="mt-1.5 text-[11px] leading-relaxed text-slate-600">{item.comment}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-3 text-sm text-slate-500">Ainda não há comentários para este livro.</p>
                    )}
                </section>
            </main>
        </ReaderLayout>
    );
}
