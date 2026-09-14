import EmptyState from '@/components/shared/EmptyState';
import QuickAccessPanel from '@/components/shared/QuickAccessPanel';
import SectionHeader from '@/components/shared/SectionHeader';
import { BOOK_GENRES } from '@/constants/genres';
import BookFilters from '@/features/books/BookFilters';
import BookGrid from '@/features/books/BookGrid';
import ReadingProgressCard from '@/features/books/ReadingProgressCard';
import ReaderLayout from '@/layouts/reader-layout';
import { Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const QUICK_ACCESS = [
    { label: 'Consultar Histórico', icon: 'fa-solid fa-clock-rotate-left' },
    { label: 'Regras da Sala de Leitura', icon: 'fa-solid fa-gavel' },
    { label: 'Configurações de Privacidade', icon: 'fa-solid fa-shield-halved' },
];

const getTextValue = (value) => {
    if (!value) return '';
    return typeof value === 'object' ? value.name || '' : String(value);
};

export default function Home({ books = [], auth }) {
    const [generoAtivo, setGeneroAtivo] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');
    const user = auth?.user ?? { name: 'Usuário', email: '' };

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
                        showSearchButton={false}
                    />
                    <ReadingProgressCard
                        eyebrow="PROGRESSO ATUAL"
                        title="Seu Progresso de Leitura"
                        description="Sem leitura ativa"
                        actionLabel="Adicionar Progresso"
                        progressLabel="0%"
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
                <div className="hidden lg:block">
                    <div className="sticky top-6">
                        <QuickAccessPanel title="Acesso Rápido" items={QUICK_ACCESS} />
                    </div>
                </div>
            </div>
        </ReaderLayout>
    );
}
