import EmptyState from '@/components/shared/EmptyState';
import SectionHeader from '@/components/shared/SectionHeader';
import { BOOK_GENRES } from '@/constants/genres';
import BookFilters from '@/features/books/BookFilters';
import BookGrid from '@/features/books/BookGrid';
import ReaderLayout from '@/layouts/reader-layout';

import { useMemo, useState } from 'react';

const getRelationName = (value) => {
    if (!value) return '';
    return typeof value === 'object' ? value.name || '' : value;
};

export default function Catalogo({ books = [], auth, genres = [] }) {
    const [generoAtivo, setGeneroAtivo] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');
    const [isGenresSidebarOpen, setIsGenresSidebarOpen] = useState(false);

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
                    onQueryChange={setSearchQuery}
                    genres={BOOK_GENRES}
                    selectedGenre={generoAtivo}
                    onGenreChange={setGeneroAtivo}
                    onMoreGenres={() => setIsGenresSidebarOpen(true)}
                    showSearchButton={false}
                />

                {/* Cabeçalho do Catálogo */}
                <SectionHeader title="Catálogo Completo">
                    <span className="text-xs font-semibold text-gray-400">
                        Exibindo {filteredBooks.length} de {books.length}
                    </span>
                </SectionHeader>

                {/* GRID DE TODOS OS LIVROS */}
                <BookGrid
                    books={filteredBooks}
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
            </div>

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
