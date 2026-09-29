import EmptyState from '@/components/shared/EmptyState';
import QuickAccessPanel from '@/components/shared/QuickAccessPanel';
import SectionHeader from '@/components/shared/SectionHeader';
import { BOOK_GENRES } from '@/constants/genres';
import BookFilters from '@/features/books/BookFilters';
import BookGrid from '@/features/books/BookGrid';
import GenreDrawer from '@/features/books/GenreDrawer';
import ReadingProgressCard from '@/features/books/ReadingProgressCard';
import ReadingProgressDrawer from '@/features/books/ReadingProgressDrawer';
import PrivacySettings from '@/features/profile/PrivacySettings';
import ReadingRules from '@/features/profile/ReadingRules';
import { readingRules } from '@/features/profile/profile-data';
import ReaderLayout from '@/layouts/reader-layout';
import { Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

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
    const user = auth?.user ?? { name: 'Visitante', email: '' };
    const openProgress = () => (auth?.user ? setIsProgressSidebarOpen(true) : router.get(route('reading.history')));

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
                const currentPage = Math.max(0, Math.min(pages, Number(progress.current_page || 0)));
                return total + (pages ? (currentPage / pages) * 100 : 0);
            }, 0) / readingProgress.length,
        );
    }, [readingProgress]);

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
                        progressLabel={`${progressPercentage}%`}
                    />
                    {/* ==================== 3 LIVROS MELHORES AVALIADOS ==================== */}
                    <SectionHeader title="Melhores Avaliados">
                        <Link
                            href={route('catalogo')}
                            className="text-lumi-progress hover:text-lumi-progress-strong text-sm font-medium transition-colors"
                        >
                            Ver todos
                        </Link>
                    </SectionHeader>
                    <BookGrid
                        books={topRatedBooks}
                        variant="catalog"
                        className="grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] lg:grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))]"
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
                                    ? { href: route('privacy') }
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
                <ReadingProgressDrawer books={books} readingProgress={readingProgress} onClose={() => setIsProgressSidebarOpen(false)} />
            )}
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
