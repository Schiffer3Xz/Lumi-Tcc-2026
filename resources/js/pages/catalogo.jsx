import EmptyState from '@/components/shared/EmptyState';
import SectionHeader from '@/components/shared/SectionHeader';
import { BOOK_GENRES } from '@/constants/genres';
import BookFilters from '@/features/books/BookFilters';
import BookGrid from '@/features/books/BookGrid';
import GenreDrawer from '@/features/books/GenreDrawer';
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

            <GenreDrawer
                isOpen={isGenresSidebarOpen}
                onClose={() => setIsGenresSidebarOpen(false)}
                genres={allGenres}
                value={generoAtivo}
                onChange={setGeneroAtivo}
            />
        </ReaderLayout>
    );
}
