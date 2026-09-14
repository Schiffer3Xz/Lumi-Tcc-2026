import FollowButton from '@/features/profile/FollowButton';
import ProfileBookHistory from '@/features/profile/ProfileBookHistory';
import ProfileReaderSidebar from '@/features/profile/ProfileReaderSidebar';
import ProfileStatCard from '@/features/profile/ProfileStatCard';
import ProfileSummary from '@/features/profile/ProfileSummary';
import ReaderLayout from '@/layouts/reader-layout';
import { router } from '@inertiajs/react';

export default function UserProfilePage({ auth, targetUser, users = [], isFollowing: initialIsFollowing = false }) {
    // Usuário logado
    const user = auth?.user ?? { name: 'Usuário', email: 'usuario@exemplo.com' };

    // Usuário do Perfil Visualizado (targetUser vindo do Laravel)
    const profile = targetUser ?? {
        id: null,
        name: 'Usuário Desconhecido',
        nickname: '@usuario',
        description: 'Sem descrição cadastrada.',
        profile_photo: null,
        read_books: [],
        reading_books: [],
        shelf_books: [],
        rated_books: [],
        shelf_books_count: 0,
        rated_books_count: 0,
        posts_count: 0,
    };

    const getBookList = (value) => (Array.isArray(value) ? value : []);

    const readBooks = getBookList(profile.read_books);
    const readingBooks = getBookList(profile.reading_books);
    const shelfBooks = getBookList(profile.shelf_books);
    const ratedBooks = getBookList(profile.rated_books);

    // Junção/Histórico de todos os livros associados para exibir na lista do perfil
    const allUserBooks = [
        ...readingBooks.map((b) => ({ ...b, status: 'Lendo' })),
        ...readBooks.map((b) => ({ ...b, status: 'Lido' })),
        ...shelfBooks.map((b) => ({ ...b, status: 'Na Estante' })),
    ];

    const handleSelectUser = (userId) => {
        router.get(route('people', userId));
    };

    return (
        <ReaderLayout
            title={`Perfil de ${profile.name} - Sala de Leitura`}
            user={user}
            activeItem="usuarios"
            variant="profile"
            topbar={{ showPhoto: true }}
        >
            <div className="flex flex-1 overflow-hidden">
                {/* PAINEL PRINCIPAL DO PERFIL */}
                <main className="flex-1 space-y-6 overflow-y-auto p-6 lg:p-8">
                    <div>
                        <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">PERFIL SOCIAL</span>
                        <h2 className="text-2xl font-bold text-slate-900">Estante do Leitor</h2>
                    </div>

                    {/* CARTÃO DE PERFIL */}
                    <ProfileSummary
                        user={profile}
                        variant="reader"
                        action={<FollowButton userId={targetUser?.id} initialIsFollowing={initialIsFollowing} />}
                    />

                    {/* ESTATÍSTICAS DO USUÁRIO */}
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                        <ProfileStatCard icon="fa-book-open" count={0} label="Livros Lidos" />
                        <ProfileStatCard icon="fa-book-bookmark" count={0} label="Lendo Agora" />
                        <ProfileStatCard icon="fa-bookmark" count={profile.shelf_books_count ?? 0} label="Na Estante" />
                        <ProfileStatCard icon="fa-star" count={profile.rated_books_count ?? 0} label="Avaliações" />
                        <ProfileStatCard icon="fa-newspaper" count={profile.posts_count ?? 0} label="Posts" />
                    </div>

                    {/* HISTÓRICO DE LIVROS */}
                    <ProfileBookHistory books={allUserBooks} />
                </main>

                {/* PAINEL DIREITO - OUTROS USUÁRIOS */}
                <ProfileReaderSidebar users={users} selectedUserId={profile.id} onSelectUser={handleSelectUser} reviews={ratedBooks} />
            </div>
        </ReaderLayout>
    );
}
