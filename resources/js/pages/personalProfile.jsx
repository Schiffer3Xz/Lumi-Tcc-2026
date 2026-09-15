import CreatePostModal from '@/features/profile/CreatePostModal';
import PreferencesPanel from '@/features/profile/PreferencesPanel';
import { defaultPersonalProfile, readingRules } from '@/features/profile/profile-data';
import ProfilePosts from '@/features/profile/ProfilePosts';
import ProfileStatCard from '@/features/profile/ProfileStatCard';
import ProfileSummary from '@/features/profile/ProfileSummary';
import ReadingRules from '@/features/profile/ReadingRules';
import ReaderLayout from '@/layouts/reader-layout';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function ConfigPage({ auth, posts = [], profileUser }) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const user = auth?.user ?? defaultPersonalProfile;

    return (
        <>
            <ReaderLayout
                title="Sala de Leitura - Perfil & Configurações"
                user={user}
                activeItem="config"
                variant="profile"
                topbar={{
                    actions: (
                        <button
                            onClick={() => setDrawerOpen(true)}
                            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                        >
                            <i className="fa-solid fa-sliders text-xs" />
                            <span>Preferências</span>
                        </button>
                    ),
                }}
            >
                {drawerOpen && <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setDrawerOpen(false)} />}
                <div className="flex flex-1 overflow-hidden">
                    {/* CONTEÚDO PRINCIPAL */}
                    <main className="flex-1 space-y-6 overflow-y-auto p-4 md:p-8">
                        {/* CARTÃO DE PERFIL */}
                        <ProfileSummary
                            user={{ ...user, ...profileUser }}
                            action={
                                <Link
                                    href={route('profile.edit')}
                                    className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 sm:w-auto"
                                >
                                    <i className="fa-solid fa-pen-to-square text-xs" />
                                    Editar Perfil
                                </Link>
                            }
                        />

                        {/* MÉTRICAS DA CONTA */}
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                            <ProfileStatCard icon="fa-book-open" count={0} label="Livros Lidos" />
                            <ProfileStatCard icon="fa-book-bookmark" count={profileUser?.reading_books_count ?? 0} label="Em Leitura" />
                            <ProfileStatCard icon="fa-bookmark" count={profileUser?.shelf_books_count ?? 0} label="Na Estante" />
                            <ProfileStatCard icon="fa-star" count={profileUser?.rated_books_count ?? 0} label="Avaliações" />
                            <ProfileStatCard icon="fa-newspaper" count={profileUser?.posts_count ?? 0} label="Posts" />
                        </div>

                        <ProfilePosts posts={posts} user={user} createPostHref={route('post')} />

                        {/* BANNER DE REGRAS */}
                        <ReadingRules rules={readingRules} />
                    </main>

                    {/* PAINEL DIREITO - PREFERÊNCIAS */}
                    <PreferencesPanel isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
                </div>
            </ReaderLayout>
            <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        </>
    );
}
