import EmptyState from '@/components/shared/EmptyState';
import SectionHeader from '@/components/shared/SectionHeader';
import { BOOK_GENRES } from '@/constants/genres';
import BookFilters from '@/features/books/BookFilters';
import BookGrid from '@/features/books/BookGrid';
import ReaderLayout from '@/layouts/reader-layout';

import { useState } from 'react';

const getRelationName = (value) => {
    if (!value) return '';
    return typeof value === 'object' ? value.name || '' : value;
};

export default function Catalogo({ books = [], auth }) {
    const [generoAtivo, setGeneroAtivo] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');

    const user = auth?.user ?? { name: 'Usuário', email: '' };

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
        </ReaderLayout>
    );
}
