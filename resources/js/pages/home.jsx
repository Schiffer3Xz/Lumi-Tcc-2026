import EmptyState from '@/components/shared/EmptyState';
import QuickAccessPanel from '@/components/shared/QuickAccessPanel';
import SectionHeader from '@/components/shared/SectionHeader';
import { BOOK_GENRES } from '@/constants/genres';
import BookFilters from '@/features/books/BookFilters';
import BookGrid from '@/features/books/BookGrid';
import ReadingProgressCard from '@/features/books/ReadingProgressCard';
import PrivacySettings from '@/features/profile/PrivacySettings';
import ReadingRules from '@/features/profile/ReadingRules';
import { readingRules } from '@/features/profile/profile-data';
import ReaderLayout from '@/layouts/reader-layout';
import { Link, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

const QUICK_ACCESS = [
    { label: 'Consultar Histórico', icon: 'fa-solid fa-clock-rotate-left', routeName: 'reading.history' },
    { label: 'Regras da Sala de Leitura', icon: 'fa-solid fa-gavel', panel: 'rules' },
    { label: 'Configurações de Privacidade', icon: 'fa-solid fa-shield-halved', panel: 'privacy' },
];

const getTextValue = (value) => {
    if (!value) return '';
    return typeof value === 'object' ? value.name || '' : String(value);
};

export default function Home({ books = [], auth, genres = [], readingProgress = [] }) {
    const [generoAtivo, setGeneroAtivo] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');
    const [isGenresSidebarOpen, setIsGenresSidebarOpen] = useState(false);
    const [isProgressSidebarOpen, setIsProgressSidebarOpen] = useState(false);
    const [isBookPickerOpen, setIsBookPickerOpen] = useState(false);
    const [progressSearch, setProgressSearch] = useState('');
    const [draftPages, setDraftPages] = useState({});
    const user = auth?.user ?? { name: 'Visitante', email: '' };
    const openProgress = () => (auth?.user ? setIsProgressSidebarOpen(true) : router.get(route('login')));

    const allGenres = useMemo(() => {
        const genresByLabel = new Map(BOOK_GENRES.map((genre) => [genre.label.toLowerCase(), genre]));

        genres.forEach((genre) => {
            const label = genre.label?.trim();

            if (label) {
                genresByLabel.set(label.toLowerCase(), { ...genre, label });
            }
        });

        return Array.from(genresByLabel.values()).sort((first, second) => first.label.localeCompare(second.label, 'pt-BR'));
    }, [genres]);

    useEffect(() => {
        setDraftPages(Object.fromEntries(readingProgress.map((progress) => [progress.id, Number(progress.current_page || 0)])));
    }, [readingProgress]);

    // Lógica de filtragem combinada por busca textual e gênero ativo
    const filteredBooks = useMemo(() => {
        return books.filter((book) => {
            const title = getTextValue(book.title).toLowerCase();
            const author = getTextValue(book.author).toLowerCase();
            const genre = getTextValue(book.genre).toLowerCase();
            const query = searchQuery.toLowerCase();

            const titleMatch = title.includes(query);
            const authorMatch = author.includes(query);
            const genreTextMatch = genre.includes(query);

            const matchesSearch = titleMatch || authorMatch || genreTextMatch;

            const matchesGenre = generoAtivo === 'Todos' || genre === generoAtivo.toLowerCase();

            return matchesSearch && matchesGenre;
        });
    }, [books, searchQuery, generoAtivo]);

    // 3 livros melhores avaliados dentro dos livros filtrados
    const topRatedBooks = useMemo(() => {
        return [...filteredBooks].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0)).slice(0, 3);
    }, [filteredBooks]);

    const progressPercentage = useMemo(() => {
        if (!readingProgress.length) return 0;

        return Math.round(
            readingProgress.reduce((total, progress) => {
                const pages = Number(progress.book?.page_count || 0);
                const currentPage = draftPages[progress.id] ?? Number(progress.current_page || 0);
                return total + (pages ? (currentPage / pages) * 100 : 0);
            }, 0) / readingProgress.length,
        );
    }, [draftPages, readingProgress]);

    const availableProgressBooks = useMemo(() => {
        const query = progressSearch.trim().toLowerCase();
        const selectedIds = new Set(readingProgress.map((progress) => progress.book.id));

        return books.filter((book) => {
            const matchesQuery =
                !query || getTextValue(book.title).toLowerCase().includes(query) || getTextValue(book.author).toLowerCase().includes(query);
            return matchesQuery && !selectedIds.has(book.id);
        });
    }, [books, progressSearch, readingProgress]);

    const addBookToProgress = (bookId) => {
        router.post(
            route('reading-progress.store'),
            { book_id: bookId },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsBookPickerOpen(false);
                    setIsProgressSidebarOpen(true);
                },
            },
        );
    };

    const updateCurrentPage = (progress, currentPage) => {
        const page = Math.max(0, Math.min(Number(currentPage) || 0, Number(progress.book.page_count) || 0));
        setDraftPages((currentPages) => ({ ...currentPages, [progress.id]: page }));
    };

    const closeProgressSidebar = () => {
        const changedProgress = readingProgress
            .map((progress) => ({ id: progress.id, current_page: draftPages[progress.id] ?? Number(progress.current_page || 0) }))
            .filter((progress) => progress.current_page !== Number(readingProgress.find((item) => item.id === progress.id)?.current_page || 0));

        if (changedProgress.length) {
            router.patch(route('reading-progress.sync'), { progresses: changedProgress }, { preserveScroll: true });
        }

        setIsProgressSidebarOpen(false);
    };

    return (
        <ReaderLayout
            title="Sala de Leitura"
            user={user}
            activeItem="home"
            variant="library"
            topbar={{ title: 'Descubra sua próxima história.', subtitle: 'Explore nosso catálogo e encontre livros que combinam com você.' }}
        >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
                {/* ==================== COLUNA PRINCIPAL ==================== */}
                <div className="min-w-0">
                    {/* Saudação */}
                    <p className="mb-3 text-sm text-gray-500">
                        Olá, <span className="font-semibold text-gray-700">{user.name}</span>! — {filteredBooks.length}{' '}
                        {filteredBooks.length === 1 ? 'livro encontrado' : 'livros encontrados'}
                    </p>
                    {/* Barra de busca */}
                    <BookFilters
                        query={searchQuery}
                        onQueryChange={setSearchQuery}
                        genres={BOOK_GENRES}
                        selectedGenre={generoAtivo}
                        onGenreChange={setGeneroAtivo}
                        onMoreGenres={() => setIsGenresSidebarOpen(true)}
                        showSearchButton={false}
                    />
                    <ReadingProgressCard
                        eyebrow="PROGRESSO ATUAL"
                        title="Seu Progresso de Leitura"
                        description={
                            readingProgress.length
                                ? `${readingProgress.length} ${readingProgress.length === 1 ? 'livro em leitura' : 'livros em leitura'}`
                                : 'Sem leitura ativa'
                        }
                        actionLabel={auth?.user ? 'Adicionar progresso' : 'Entrar para acompanhar leitura'}
                        onAction={openProgress}
                        onClick={openProgress}
                        progressLabel={`${progressPercentage}%`}
                    />
                    {/* ==================== 3 LIVROS MELHORES AVALIADOS ==================== */}
                    <SectionHeader title="Melhores Avaliados">
                        <Link href={route('catalogo')} className="text-sm font-medium text-[#81A9D4] transition-colors hover:text-[#6B9AC4]">
                            Ver todos
                        </Link>
                    </SectionHeader>
                    <BookGrid
                        books={topRatedBooks}
                        variant="catalog"
                        className="lg:grid-cols-3"
                        cardProps={{ className: 'min-h-72', imageClassName: 'h-72 sm:h-80' }}
                        emptyState={
                            <EmptyState
                                title="Nenhum livro encontrado"
                                description="Não encontramos resultados para os filtros selecionados."
                                icon="fa-solid fa-books"
                                className="col-span-full mb-8"
                            />
                        }
                    />
                </div>
                {/* ==================== SIDEBAR DIREITA ==================== */}
                <div>
                    <div className="sticky top-6">
                        <QuickAccessPanel
                            title="Acesso Rápido"
                            items={QUICK_ACCESS.map((item) => ({
                                ...item,
                                ...(item.panel === 'privacy' && !auth?.user
                                    ? { href: route('login') }
                                    : item.routeName
                                      ? { href: route(item.routeName) }
                                      : {
                                            dialog:
                                                item.panel === 'rules'
                                                    ? {
                                                          description: 'Consulte as orientações da sala de leitura.',
                                                          content: <ReadingRules rules={readingRules} />,
                                                      }
                                                    : {
                                                          description: 'Controle a privacidade das avaliações e os avisos da conta.',
                                                          content: <PrivacySettings />,
                                                      },
                                        }),
                            }))}
                        />
                    </div>
                </div>
            </div>

            {isProgressSidebarOpen && (
                <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Progresso de leitura">
                    <button
                        type="button"
                        aria-label="Fechar progresso de leitura"
                        onClick={closeProgressSidebar}
                        className="animate-in fade-in absolute inset-0 cursor-default bg-slate-900/25 duration-200"
                    />
                    <aside className="animate-in slide-in-from-right relative flex h-full w-full max-w-md flex-col bg-white p-5 shadow-2xl duration-300">
                        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <p className="text-[10px] font-bold tracking-widest text-blue-600 uppercase">MINHAS LEITURAS</p>
                                <h2 className="text-lg font-bold text-slate-800">Progresso de leitura</h2>
                                <p className="mt-1 text-xs text-slate-500">{readingProgress.length}/3 livros em andamento</p>
                            </div>
                            <button
                                type="button"
                                onClick={closeProgressSidebar}
                                aria-label="Fechar progresso de leitura"
                                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                            >
                                <i className="fa-solid fa-xmark" aria-hidden="true" />
                            </button>
                        </div>

                        <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
                            {readingProgress.map((progress) => {
                                const pageCount = Number(progress.book.page_count || 0);
                                const currentPage = draftPages[progress.id] ?? Number(progress.current_page || 0);
                                const percentage = pageCount ? Math.round((currentPage / pageCount) * 100) : 0;

                                return (
                                    <article key={progress.id} className="rounded-xl border border-slate-200 p-3">
                                        <div className="flex gap-3">
                                            <div className="h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                                                {progress.book.cover_url ? (
                                                    <img src={progress.book.cover_url} alt="" className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center text-slate-400">
                                                        <i className="fa-solid fa-book" aria-hidden="true" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex gap-2">
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="truncate text-sm font-bold text-slate-800">{progress.book.title}</h3>
                                                        <p className="truncate text-xs text-slate-500">
                                                            {progress.book.author || 'Autor não informado'}
                                                        </p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        aria-label={`Remover ${progress.book.title} do progresso`}
                                                        onClick={() =>
                                                            router.delete(route('reading-progress.destroy', progress.id), { preserveScroll: true })
                                                        }
                                                        className="h-7 w-7 shrink-0 rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600"
                                                    >
                                                        <i className="fa-solid fa-trash-can text-xs" aria-hidden="true" />
                                                    </button>
                                                </div>
                                                <div className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-600">
                                                    <span>
                                                        Página {currentPage} de {pageCount || '-'}
                                                    </span>
                                                    <span>{percentage}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max={pageCount || 0}
                                                    value={Math.min(currentPage, pageCount || 0)}
                                                    onChange={(event) => updateCurrentPage(progress, event.target.value)}
                                                    disabled={!pageCount}
                                                    aria-label={`Página atual de ${progress.book.title}`}
                                                    className="mt-1 h-2 w-full cursor-pointer accent-[#6B9AC4] disabled:cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        <button
                            type="button"
                            disabled={readingProgress.length >= 3}
                            onClick={() => setIsBookPickerOpen(true)}
                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A2332] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#27364d] disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                            <i className="fa-solid fa-plus text-xs" aria-hidden="true" />
                            {readingProgress.length >= 3 ? 'Limite de 3 livros atingido' : 'Adicionar livro'}
                        </button>
                    </aside>
                </div>
            )}

            {isBookPickerOpen && (
                <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true" aria-label="Adicionar livro ao progresso">
                    <button
                        type="button"
                        aria-label="Fechar seleção de livros"
                        onClick={() => setIsBookPickerOpen(false)}
                        className="animate-in fade-in absolute inset-0 cursor-default bg-slate-900/40 duration-200"
                    />
                    <aside className="animate-in slide-in-from-right relative flex h-full w-full max-w-md flex-col bg-white p-5 shadow-2xl duration-300">
                        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <p className="text-[10px] font-bold tracking-widest text-blue-600 uppercase">PROGRESSO DE LEITURA</p>
                                <h2 className="text-lg font-bold text-slate-800">Adicionar livro</h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsBookPickerOpen(false)}
                                aria-label="Fechar seleção de livros"
                                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                            >
                                <i className="fa-solid fa-xmark" aria-hidden="true" />
                            </button>
                        </div>
                        <label className="relative mb-4 block">
                            <span className="sr-only">Pesquisar livros</span>
                            <i
                                className="fa-solid fa-magnifying-glass absolute top-1/2 left-3 -translate-y-1/2 text-xs text-slate-400"
                                aria-hidden="true"
                            />
                            <input
                                value={progressSearch}
                                onChange={(event) => setProgressSearch(event.target.value)}
                                placeholder="Pesquisar por título ou autor..."
                                className="w-full rounded-xl border border-slate-200 py-3 pr-4 pl-9 text-sm transition outline-none focus:border-[#81A9D4] focus:ring-2 focus:ring-[#81A9D4]/20"
                            />
                        </label>
                        <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
                            {availableProgressBooks.map((book) => (
                                <button
                                    key={book.id}
                                    type="button"
                                    onClick={() => addBookToProgress(book.id)}
                                    className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition-colors hover:border-[#81A9D4] hover:bg-blue-50/40"
                                >
                                    <div className="h-16 w-11 shrink-0 overflow-hidden rounded-md bg-slate-100">
                                        {book.cover_url ? (
                                            <img src={book.cover_url} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-slate-400">
                                                <i className="fa-solid fa-book text-xs" aria-hidden="true" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="truncate text-sm font-bold text-slate-800">{book.title}</h3>
                                        <p className="truncate text-xs text-slate-500">{getTextValue(book.author) || 'Autor não informado'}</p>
                                        <p className="mt-1 text-[11px] text-slate-400">{book.page_count || '-'} páginas</p>
                                    </div>
                                    <i className="fa-solid fa-plus text-xs text-[#6B9AC4]" aria-hidden="true" />
                                </button>
                            ))}
                        </div>
                    </aside>
                </div>
            )}

            {isGenresSidebarOpen && (
                <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Todos os gêneros">
                    <button
                        type="button"
                        aria-label="Fechar gêneros"
                        onClick={() => setIsGenresSidebarOpen(false)}
                        className="absolute inset-0 cursor-default bg-slate-900/25"
                    />

                    <aside className="relative flex h-full w-full max-w-sm flex-col bg-white p-5 shadow-2xl">
                        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <p className="text-[10px] font-bold tracking-widest text-blue-600 uppercase">CATÁLOGO</p>
                                <h2 className="text-lg font-bold text-slate-800">Todos os gêneros</h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsGenresSidebarOpen(false)}
                                aria-label="Fechar gêneros"
                                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                            >
                                <i className="fa-solid fa-xmark" aria-hidden="true" />
                            </button>
                        </div>

                        <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
                            {allGenres.map((genre) => (
                                <button
                                    key={genre.label}
                                    type="button"
                                    onClick={() => {
                                        setGeneroAtivo(genre.label);
                                        setIsGenresSidebarOpen(false);
                                    }}
                                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                                        generoAtivo === genre.label
                                            ? 'border-slate-800 bg-slate-800 font-semibold text-yellow-300'
                                            : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                                >
                                    <i className={`${genre.icon} w-4 text-center text-xs`} aria-hidden="true" />
                                    <span>{genre.label}</span>
                                </button>
                            ))}
                        </div>
                    </aside>
                </div>
            )}
        </ReaderLayout>
    );
}
