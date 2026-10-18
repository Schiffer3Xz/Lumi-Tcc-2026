import EmptyState from '@/components/shared/EmptyState';
import SectionHeader from '@/components/shared/SectionHeader';
import { BOOK_GENRES } from '@/constants/genres';
import BookFilters from '@/features/books/BookFilters';
import BookGrid from '@/features/books/BookGrid';
import GenreDrawer from '@/features/books/GenreDrawer';
import ReaderLayout from '@/layouts/reader-layout';

import { useMemo, useRef, useState } from 'react';

const BOOKS_PER_PAGE = 20;

const getRelationName = (value) => {
    if (!value) return '';
    return typeof value === 'object' ? value.name || '' : value;
};

export default function Catalogo({ books = [], auth, genres = [] }) {
    const [generoAtivo, setGeneroAtivo] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');
    const [isGenresSidebarOpen, setIsGenresSidebarOpen] = useState(false);
    const [page, setPage] = useState(1);
    const catalogRef = useRef(null);
    const changeQuery = (value) => { setSearchQuery(value); setPage(1); };
    const changeGenre = (value) => { setGeneroAtivo(value); setPage(1); };

    const user = auth?.user ?? { name: 'Usuário', email: '' };

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

    // Filtra os livros recebidos da Controller do Laravel
    const filteredBooks = books.filter((book) => {
        const genreName = getRelationName(book.genre);
        const authorName = getRelationName(book.author);

        const matchesGenre = generoAtivo === 'Todos' || genreName.toLowerCase().includes(generoAtivo.toLowerCase());

        const matchesSearch =
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) || authorName.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesGenre && matchesSearch;
    });

    const totalPages = Math.max(1, Math.ceil(filteredBooks.length / BOOKS_PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const start = (currentPage - 1) * BOOKS_PER_PAGE;
    const visibleBooks = filteredBooks.slice(start, start + BOOKS_PER_PAGE);
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)
        .filter((value) => value === 1 || value === totalPages || Math.abs(value - currentPage) <= 1);
    const changePage = (value) => {
        setPage(value);
        catalogRef.current?.scrollIntoView({ block: 'start' });
        catalogRef.current?.focus({ preventScroll: true });
    };

    return (
        <ReaderLayout
            title="Sala de Leitura"
            user={user}
            activeItem="biblioteca"
            variant="library"
            topbar={{ title: 'Lumi, Seu catálogo está aqui!', subtitle: 'Etec João Belarmino' }}
        >
            <div className="w-full">
                {/* Contagem de livros */}
                <p className="mb-3 text-sm text-gray-500">
                    Olá, <span className="font-semibold text-gray-700">{user.name}</span>! — {books.length}{' '}
                    {books.length === 1 ? 'livro cadastrado' : 'livros cadastrados'} no catálogo
                </p>

                {/* Barra de busca */}
                <BookFilters
                    query={searchQuery}
                    onQueryChange={changeQuery}
                    genres={BOOK_GENRES}
                    selectedGenre={generoAtivo}
                    onGenreChange={changeGenre}
                    onMoreGenres={() => setIsGenresSidebarOpen(true)}
                    showSearchButton={false}
                />

                {/* Cabeçalho do Catálogo */}
                <div ref={catalogRef} tabIndex={-1} className="scroll-mt-6 outline-none">
                <SectionHeader title="Catálogo Completo">
                    <span className="text-xs font-semibold text-gray-400">
                        <span role="status">Exibindo {filteredBooks.length ? start + 1 : 0}–{start + visibleBooks.length} de {filteredBooks.length} livros</span>
                    </span>
                </SectionHeader>

                {/* GRID DE TODOS OS LIVROS */}
                <BookGrid
                    books={visibleBooks}
                    className="lg:grid-cols-2 2xl:grid-cols-3"
                    cardProps={{ showActions: Boolean(auth?.user) }}
                    emptyState={
                        <EmptyState
                            title="Nenhum livro encontrado"
                            description="Não há registros no banco de dados correspondentes aos filtros."
                            icon="fa-solid fa-book-open"
                            className="mb-8 p-12"
                        />
                    }
                />
                {totalPages > 1 && (
                    <nav aria-label="Páginas do catálogo" className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-5">
                        <p className="text-sm text-slate-500">Página {currentPage} de {totalPages}</p>
                        <div className="flex flex-wrap items-center gap-2">
                            <button type="button" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-40">Anterior</button>
                            {pageNumbers.map((value, index) => (
                                <span key={value} className="flex items-center gap-2">
                                    {index > 0 && value - pageNumbers[index - 1] > 1 && <span className="text-slate-400" aria-hidden="true">…</span>}
                                    <button type="button" aria-label={`Página ${value}`} aria-current={value === currentPage ? 'page' : undefined} onClick={() => changePage(value)} className={`min-w-10 rounded-xl border px-3 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${value === currentPage ? 'border-lumi-navy bg-lumi-navy text-yellow-300' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>{value}</button>
                                </span>
                            ))}
                            <button type="button" disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-40">Próxima</button>
                        </div>
                    </nav>
                )}
                </div>
            </div>

            <GenreDrawer
                isOpen={isGenresSidebarOpen}
                onClose={() => setIsGenresSidebarOpen(false)}
                genres={allGenres}
                value={generoAtivo}
                onChange={changeGenre}
            />
        </ReaderLayout>
    );
}
