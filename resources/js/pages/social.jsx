import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ChatDialog from '@/features/social/ChatDialog';
import CommunitySidebar from '@/features/social/CommunitySidebar';
import PostFeed from '@/features/social/PostFeed';

import ReaderLayout from '@/layouts/reader-layout';
import { Link, usePoll } from '@inertiajs/react';
import { useState } from 'react';

export default function Feed({
    auth,
    suggestedUsers = [],
    followedUsers = [],
    allUsers = [],
    conversationUsers = [],
    trendingPosts = [],
    posts = [],
    filters = {},
}) {
    const user = auth?.user ?? { name: 'Estudante', email: '' };
    const [chatUser, setChatUser] = useState(null);
    const [peopleOpen, setPeopleOpen] = useState(false);
    usePoll(15000, { only: ['conversationUsers'] });
    const sidebarProps = {
        suggestedUsers,
        followedUsers,
        allUsers,
        conversationUsers,
        trendingPosts,
        onChat: (reader) => {
            setPeopleOpen(false);
            setChatUser(reader);
        },
    };

    return (
        <>
            <ReaderLayout title="Sala de Leitura - Feed da Comunidade" user={user} activeItem="usuarios" variant="social">
                <div className="flex flex-1 overflow-hidden">
                    {/* FEED PRINCIPAL */}
                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                        <div className="mx-auto flex max-w-[720px] flex-col gap-6">
                            {/* CABEÇALHO DO FEED */}
                            <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white p-5 shadow-xs">
                                <div>
                                    <span className="mb-0.5 block text-[10px] font-bold tracking-widest text-blue-600 uppercase">
                                        COMUNIDADE LITERÁRIA
                                    </span>

                                    <h2 className="text-lg font-bold text-slate-800">Atividades e Publicações</h2>
                                </div>

                                <div className="flex items-center gap-2 rounded-xl border border-slate-200/60 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                                    <i className="fa-solid fa-arrow-down-wide-short text-blue-500" />
                                    <span>Mais recentes</span>
                                </div>
                            </div>

                            <Dialog open={peopleOpen} onOpenChange={setPeopleOpen}>
                                <DialogTrigger asChild>
                                    <button
                                        type="button"
                                        className="rounded-xl border border-slate-200 bg-white p-3 text-sm font-semibold text-blue-600 xl:hidden"
                                    >
                                        Pessoas e conversas
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-md overflow-hidden rounded-2xl bg-white p-0">
                                    <div className="px-5 pt-5">
                                        <DialogTitle>Pessoas e conversas</DialogTitle>
                                        <DialogDescription>Encontre leitores, converse e acompanhe a comunidade.</DialogDescription>
                                    </div>
                                    <div className="h-[65dvh]">
                                        <CommunitySidebar {...sidebarProps} />
                                    </div>
                                </DialogContent>
                            </Dialog>
                            {/* LISTA DE POSTS */}
                            <nav aria-label="Filtrar publicações" className="flex gap-4 text-xs font-semibold">
                                <Link
                                    href={route('list')}
                                    aria-current={!filters.saved && !filters.post ? 'page' : undefined}
                                    className={!filters.saved && !filters.post ? 'text-blue-600' : 'text-slate-500'}
                                >
                                    {filters.post ? 'Voltar para todas as publicações' : 'Todas as publicações'}
                                </Link>
                                <Link
                                    href={route('list', { saved: 1 })}
                                    aria-current={filters.saved ? 'page' : undefined}
                                    className={filters.saved ? 'text-blue-600' : 'text-slate-500'}
                                >
                                    Salvas
                                </Link>
                            </nav>
                            <PostFeed posts={posts} user={user} savedOnly={filters.saved} />
                        </div>
                    </main>

                    <aside className="hidden h-full w-[360px] shrink-0 border-l border-slate-200/80 xl:block">
                        <CommunitySidebar {...sidebarProps} />
                    </aside>
                </div>
                <ChatDialog recipient={chatUser} viewerId={user.id} onClose={() => setChatUser(null)} />
            </ReaderLayout>
        </>
    );
}
