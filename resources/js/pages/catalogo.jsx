import EmptyState from '@/components/shared/EmptyState';
import SectionHeader from '@/components/shared/SectionHeader';
import { BOOK_GENRES } from '@/constants/genres';
import BookFilters from '@/features/books/BookFilters';
import BookGrid from '@/features/books/BookGrid';
import BookPagination from '@/features/books/BookPagination';
import GenreDrawer from '@/features/books/GenreDrawer';
import useBookFilters from '@/features/books/useBookFilters';
import ReaderLayout from '@/layouts/reader-layout';

import { useMemo, useRef, useState } from 'react';

export default function Catalogo({ books = [], auth, genres = [], filters, pagination, catalogTotal }) {
    const { query: searchQuery, genre: generoAtivo, changeQuery, changeGenre, changePage } = useBookFilters('catalogo', filters, [
        'books', 'filters', 'pagination', 'catalogTotal',
    ]);
    const [isGenresSidebarOpen, setIsGenresSidebarOpen] = useState(false);
    const catalogRef = useRef(null);

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

    const { first, last, total } = pagination;
    const selectPage = (value) => {
        changePage(value, () => {
            catalogRef.current?.scrollIntoView({ block: 'start' });
            catalogRef.current?.focus({ preventScroll: true });
        });
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
                    Olá, <span className="font-semibold text-gray-700">{user.name}</span>! — {catalogTotal}{' '}
                    {catalogTotal === 1 ? 'livro cadastrado' : 'livros cadastrados'} no catálogo
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
                        <span role="status">Exibindo {first}–{last} de {total} livros</span>
                    </span>
                </SectionHeader>

                {/* GRID DE TODOS OS LIVROS */}
                <BookGrid
                    books={books}
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
                <BookPagination pagination={pagination} onPageChange={selectPage} />
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
