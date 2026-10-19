import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ChatDialog from '@/features/social/ChatDialog';
import CommunitySidebar from '@/features/social/CommunitySidebar';
import CreateGroupDialog from '@/features/social/CreateGroupDialog';
import PostFeed from '@/features/social/PostFeed';
import subscribeToChat from '@/features/social/subscribeToChat';

import ReaderLayout from '@/layouts/reader-layout';
import { Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function Feed({
    auth,
    suggestedUsers = [],
    followedUsers = [],
    allUsers = [],
    conversationUsers = [],
    trendingPosts = [],
    posts = [],
    filters = {},
    directMessages = {},
    groupConversations = [],
}) {
    const user = auth?.user ?? { name: 'Estudante', email: '' };
    const [chatUser, setChatUser] = useState(null);
    const [peopleOpen, setPeopleOpen] = useState(false);
    const [createGroupOpen, setCreateGroupOpen] = useState(false);
    const activeGroup = chatUser?.is_group ? groupConversations.find((group) => group.id === chatUser.id) : null;
    const openChatTimerRef = useRef(null);
    const pendingDialogRef = useRef(null);

    useEffect(() => {
        const target = filters.group
            ? groupConversations.find((group) => Number(group.id) === Number(filters.group))
            : conversationUsers.find((reader) => Number(reader.id) === Number(filters.chat));
        if (target) setChatUser(target);
    }, [filters.group, filters.chat]);

    useEffect(() => () => window.clearTimeout(openChatTimerRef.current), []);

    useEffect(
        () =>
            subscribeToChat({
                echo: window.Echo,
                viewerId: user.id,
                reload: (options) => router.reload(options),
                onUpdate: (event) => {
                    if (event.deleted || Number(event.removedUserId) === Number(user.id)) {
                        setChatUser((current) => (current?.is_group && Number(current.id) === Number(event.conversationId) ? null : current));
                    }
                },
            }),
        [user.id],
    );

    const openChat = (reader) => {
        router.reload({ only: ['directMessages', 'groupConversations', 'conversationUsers'] });
        if (!peopleOpen) {
            setChatUser(reader);
            return;
        }

        setPeopleOpen(false);
        pendingDialogRef.current = () => setChatUser(reader);
    };

    const sidebarProps = {
        suggestedUsers,
        followedUsers,
        allUsers,
        conversationUsers,
        groupConversations,
        trendingPosts,
        onChat: openChat,
        onCreateGroup: () => {
            if (!peopleOpen) {
                setCreateGroupOpen(true);
                return;
            }
            pendingDialogRef.current = () => setCreateGroupOpen(true);
            setPeopleOpen(false);
        },
    };

    return (
        <>
            <ReaderLayout title="Sala de Leitura - Feed da Comunidade" user={user} activeItem="usuarios" variant="social">
                <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
                    {/* FEED PRINCIPAL */}
                    <main id="reader-main-content" tabIndex={-1} className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                        <div className="mx-auto flex max-w-[720px] flex-col gap-6">
                            {/* CABEÇALHO DO FEED */}
                            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-xs">
                                <div>
                                    <span className="text-caption-sm mb-0.5 block font-bold tracking-widest text-blue-600 uppercase">
                                        COMUNIDADE LITERÁRIA
                                    </span>

                                    <h2 className="text-lg font-bold text-slate-800">Atividades e Publicações</h2>
                                </div>

                                <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
                                    <div className="flex items-center gap-2 rounded-xl border border-slate-200/60 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                                        <i className="fa-solid fa-arrow-down-wide-short text-blue-500" aria-hidden="true" />
                                        <span>Mais recentes</span>
                                    </div>
                                    <Link
                                        href={route('post')}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                    >
                                        <i className="fa-solid fa-plus" aria-hidden="true" />
                                        Novo post
                                    </Link>
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
                                <DialogContent
                                    className="top-0 left-0 flex h-dvh max-h-dvh w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 bg-white p-0 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] sm:top-1/2 sm:left-1/2 sm:h-[85dvh] sm:max-h-[90dvh] sm:w-[calc(100vw_-_2rem)] sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:border"
                                    onCloseAutoFocus={(event) => {
                                        const openPendingDialog = pendingDialogRef.current;
                                        if (!openPendingDialog) return;
                                        event.preventDefault();
                                        pendingDialogRef.current = null;
                                        // Wait for Radix to release the people dialog's focus trap.
                                        openChatTimerRef.current = window.setTimeout(openPendingDialog, 0);
                                    }}
                                >
                                    <div className="shrink-0 border-b border-slate-100 px-4 py-5 pr-14">
                                        <DialogTitle>Pessoas e conversas</DialogTitle>
                                        <DialogDescription>Encontre leitores, converse e acompanhe a comunidade.</DialogDescription>
                                    </div>
                                    <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
                                        <CommunitySidebar {...sidebarProps} />
                                    </div>
                                </DialogContent>
                            </Dialog>
                            {/* LISTA DE POSTS */}
                            <nav aria-label="Filtrar publicações" className="flex flex-wrap gap-4 text-xs font-semibold">
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
                {createGroupOpen && (
                    <CreateGroupDialog
                        users={allUsers}
                        onClose={() => setCreateGroupOpen(false)}
                        onCreated={(group) => {
                            setCreateGroupOpen(false);
                            window.clearTimeout(openChatTimerRef.current);
                            openChatTimerRef.current = window.setTimeout(() => setChatUser(group), 200);
                        }}
                    />
                )}
                {chatUser && (!chatUser.is_group || activeGroup) && (
                    <ChatDialog
                        key={`${chatUser.is_group ? 'group' : 'user'}-${chatUser.id}`}
                        recipient={activeGroup ?? chatUser}
                        viewerId={user.id}
                        messages={chatUser.is_group ? (activeGroup?.messages ?? []) : (directMessages?.[chatUser.id]?.messages ?? [])}
                        conversationId={chatUser.is_group ? chatUser.id : directMessages?.[chatUser.id]?.conversation_id}
                        onClose={() => {
                            setChatUser(null);
                            router.reload({ only: ['directMessages', 'groupConversations', 'conversationUsers'] });
                        }}
                    />
                )}
            </ReaderLayout>
        </>
    );
}
