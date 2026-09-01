import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function Feed({ auth, users = [], posts = [] }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [currentPosts, setCurrentPosts] = useState(posts);
    const [likedPosts, setLikedPosts] = useState({});
    const profileRef = useRef(null);

    const user = auth?.user ?? { name: 'Estudante', email: '' };

    useEffect(() => {
        setCurrentPosts(posts);
    }, [posts]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleLike = (postId) => {
        setLikedPosts((prev) => {
            const isLiked = !!prev[postId];

            const updated = {
                ...prev,
                [postId]: !isLiked,
            };

            setCurrentPosts((currentPosts) =>
                currentPosts.map((post) =>
                    post.id === postId
                        ? {
                              ...post,
                              likesCount: post.likesCount + (isLiked ? -1 : 1),
                          }
                        : post,
                ),
            );

            return updated;
        });
    };

    const NAV_ITEMS = [
        {
            id: 'home',
            label: 'Home',
            icon: 'fa-solid fa-house',
            href: route('dashboard'),
        },
        {
            id: 'biblioteca',
            label: 'Catálogo',
            icon: 'fa-solid fa-book-open',
            href: route('catalogo'),
        },
        {
            id: 'usuarios',
            label: 'Social',
            icon: 'fa-solid fa-users',
            href: route('list'),
            active: true,
        },
        {
            id: 'config',
            label: 'Config',
            icon: 'fa-solid fa-gear',
            href: route('profile'),
        },
    ];

    return (
        <>
            <Head title="Sala de Leitura - Feed da Comunidade" />

            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

            <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-700">
                {/* OVERLAY MOBILE */}
                {mobileOpen && <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden" onClick={() => setMobileOpen(false)} />}

                {/* SIDEBAR ESQUERDA */}
                <aside
                    className={`fixed top-0 left-0 z-50 flex h-screen w-20 flex-shrink-0 flex-col items-center gap-8 bg-[#1A2332] py-6 transition-transform duration-300 ease-in-out lg:sticky ${
                        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
                >
                    <div className="text-yellow-300">
                        <i className="fa-solid fa-feather-pointed text-2xl" />
                    </div>

                    <nav className="flex flex-1 flex-col gap-3">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={`relative flex flex-col items-center gap-1 rounded-xl p-3 transition-all duration-200 ${
                                    item.active ? 'bg-yellow-300/10 text-yellow-300' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                                title={item.label}
                            >
                                {item.active && <span className="absolute top-1/2 left-0 h-8 w-1 -translate-y-1/2 rounded-r-full bg-amber-400" />}

                                <i className={`${item.icon} text-lg`} />
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    <button className="rounded-xl p-3 text-slate-400 transition-all hover:bg-white/5 hover:text-white">
                        <i className="fa-solid fa-gear text-lg" />
                    </button>
                </aside>

                {/* CONTEÚDO PRINCIPAL + SIDEBAR DIREITA */}
                <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
                    {/* TOPBAR */}
                    <header className="sticky top-0 z-30 flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/90 px-6 backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden">
                                <i className="fa-solid fa-bars text-xl" />
                            </button>

                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-base font-bold text-white shadow-xs">
                                    <i className="fa-solid fa-book-open" />
                                </div>

                                <div>
                                    <h1 className="text-sm leading-tight font-bold text-slate-800">Sala de Leitura</h1>

                                    <p className="text-[11px] font-medium text-slate-400">Plataforma Escolar Web</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="relative rounded-full p-2.5 text-slate-600 transition-colors hover:bg-slate-100">
                                <i className="fa-regular fa-bell text-lg" />
                                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
                            </button>

                            {/* PERFIL */}
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2.5 rounded-full border border-slate-200/60 p-1 pr-3 transition-colors hover:bg-slate-50"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>

                                    <span className="hidden text-xs font-semibold text-slate-700 sm:block">{user.name}</span>

                                    <i className="fa-solid fa-chevron-down text-[10px] text-slate-400" />
                                </button>

                                {profileOpen && (
                                    <div className="absolute right-0 z-50 mt-2 w-52 rounded-2xl border border-slate-100 bg-white py-1.5 shadow-xl">
                                        <div className="border-b border-slate-100 px-4 py-2.5">
                                            <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Conta</p>

                                            <p className="truncate text-xs font-bold text-slate-800">{user.name}</p>
                                        </div>

                                        <Link
                                            href={route('profile.edit')}
                                            className="flex w-full items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
                                        >
                                            <i className="fa-solid fa-gear text-slate-400" />
                                            Configurações
                                        </Link>

                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50"
                                        >
                                            <i className="fa-solid fa-right-from-bracket" />
                                            Sair da Conta
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* ÁREA DE CONTEÚDO */}
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

                                {/* LISTA DE POSTS */}
                                {currentPosts.map((post) => {
                                    const isLiked = !!likedPosts[post.id];

                                    return (
                                        <article
                                            key={post.id}
                                            className="flex flex-col gap-4 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-xs transition-all hover:border-slate-300/80"
                                        >
                                            {/* CABEÇALHO DO POST */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white shadow-xs ${
                                                            post.author?.bg ?? 'bg-slate-800'
                                                        }`}
                                                    >
                                                        {post.author?.avatar ?? post.author?.name?.charAt(0).toUpperCase()}
                                                    </div>

                                                    <div>
                                                        <div className="flex items-center gap-1.5">
                                                            <h3 className="text-xs font-bold text-slate-800">{post.author?.name}</h3>

                                                            <span className="text-[11px] text-slate-400">@{post.author?.username}</span>
                                                        </div>

                                                        <p className="text-[10px] text-slate-400">{post.time}</p>
                                                    </div>
                                                </div>

                                                <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600">
                                                    <i className="fa-solid fa-ellipsis-vertical" />
                                                </button>
                                            </div>

                                            {/* CONTEÚDO */}
                                            <p className="text-xs leading-relaxed text-slate-600">{post.content}</p>

                                            {/* CARTÃO DE LIVRO (SE HOUVER) */}
                                            {post.book && (
                                                <div className="flex items-center gap-3 rounded-xl border border-slate-200/60 bg-slate-50/70 p-3">
                                                    <div
                                                        className={`flex h-12 w-9 flex-shrink-0 items-center justify-center rounded-md ${post.book.coverBg} text-sm font-bold text-white shadow-xs`}
                                                    >
                                                        📖
                                                    </div>

                                                    <div className="min-w-0">
                                                        <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[9px] font-bold tracking-wider text-amber-800 uppercase">
                                                            {post.book.badge}
                                                        </span>

                                                        <p className="mt-1 truncate text-xs font-bold text-slate-800">{post.book.title}</p>

                                                        <p className="text-[10px] text-slate-500">{post.book.author}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* FOTO DO POST (SE HOUVER) */}
                                            {post.image && (
                                                <div className="max-h-[360px] overflow-hidden rounded-xl border border-slate-100 bg-slate-900/5">
                                                    <img
                                                        src={post.image}
                                                        alt="Imagem da publicação"
                                                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.01]"
                                                    />
                                                </div>
                                            )}

                                            {/* AÇÕES */}
                                            <div className="flex items-center gap-6 border-t border-slate-100 pt-3 text-xs font-medium text-slate-500">
                                                <button
                                                    onClick={() => toggleLike(post.id)}
                                                    className={`flex items-center gap-1.5 transition-colors ${
                                                        isLiked ? 'font-bold text-rose-500' : 'hover:text-rose-500'
                                                    }`}
                                                >
                                                    <i className={`${isLiked ? 'fa-solid' : 'fa-regular'} fa-heart text-sm`} />

                                                    <span>{post.likesCount ?? 0}</span>
                                                </button>

                                                <button className="flex items-center gap-1.5 transition-colors hover:text-blue-600">
                                                    <i className="fa-regular fa-comment text-sm" />
                                                    <span>{post.commentsCount ?? 0}</span>
                                                </button>

                                                <button className="flex items-center gap-1.5 transition-colors hover:text-blue-600">
                                                    <i className="fa-solid fa-share-nodes text-sm" />
                                                    <span className="hidden sm:inline">Compartilhar</span>
                                                </button>

                                                <button className="ml-auto text-slate-400 transition-colors hover:text-slate-600">
                                                    <i className="fa-regular fa-bookmark text-sm" />
                                                </button>
                                            </div>

                                            {/* COMENTÁRIOS */}
                                            <div className="flex flex-col gap-3 pt-1">
                                                {/* INPUT */}
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-white">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>

                                                    <div className="relative flex-1">
                                                        <input
                                                            type="text"
                                                            placeholder="Escreva um comentário..."
                                                            className="w-full rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-1.5 pr-8 text-xs text-slate-700 transition-all outline-none focus:border-blue-400 focus:bg-white"
                                                        />

                                                        <button className="absolute top-1/2 right-2.5 -translate-y-1/2 text-xs text-slate-400 transition-colors hover:text-blue-600">
                                                            <i className="fa-solid fa-paper-plane" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* COMENTÁRIOS REAIS */}
                                                {post.comments?.map((comment) => (
                                                    <div key={comment.id} className="flex items-start gap-2.5 pt-1 text-xs">
                                                        <div
                                                            className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                                                                comment.bg ?? 'bg-slate-100 text-slate-700'
                                                            }`}
                                                        >
                                                            {comment.avatar ?? comment.user?.charAt(0).toUpperCase()}
                                                        </div>

                                                        <div className="flex-1 rounded-xl border border-slate-100 bg-slate-50/80 p-2.5">
                                                            <div className="mb-0.5 flex items-center justify-between">
                                                                <span className="text-[11px] font-bold text-slate-800">{comment.user}</span>

                                                                <span className="text-[9px] text-slate-400">{comment.time}</span>
                                                            </div>

                                                            <p className="text-[11px] leading-relaxed text-slate-600">{comment.text}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        </main>

                        {/* SIDEBAR DIREITA */}
                        <aside className="hidden h-full w-[340px] flex-shrink-0 flex-col border-l border-slate-200/80 bg-white xl:flex">
                            {/* CAMPO DE BUSCA */}
                            <div className="border-b border-slate-100 bg-slate-50/50 p-4">
                                <span className="mb-1.5 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">ENCONTRAR PESSOAS</span>

                                <div className="relative">
                                    <i className="fa-solid fa-magnifying-glass absolute top-1/2 left-3 -translate-y-1/2 text-xs text-slate-400" />

                                    <input
                                        type="text"
                                        placeholder="Buscar leitores na escola..."
                                        className="w-full rounded-xl border border-slate-200/90 bg-white py-2 pr-3 pl-9 text-xs text-slate-700 shadow-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
                                {/* USUÁRIOS DA APLICAÇÃO */}
                                <div>
                                    <div className="mb-3 flex items-center justify-between">
                                        <h3 className="text-xs font-bold tracking-wider text-slate-800 uppercase">Leitores em Destaque</h3>

                                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                                            {users.length} ativos
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        {users.slice(0, 5).map((u) => (
                                            <div
                                                key={u.id}
                                                onClick={() => router.get(`people/${u.id}`)}
                                                className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent p-2 transition-all hover:border-slate-100 hover:bg-slate-50"
                                            >
                                                <div className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                                                    {u.name
                                                        .split(' ')
                                                        .map((n) => n[0])
                                                        .slice(0, 2)
                                                        .join('')
                                                        .toUpperCase()}

                                                    <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full border border-white bg-emerald-500" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-xs font-bold text-slate-800">{u.name}</p>

                                                    <p className="truncate text-[10px] text-slate-400">@{u.nickname}</p>
                                                </div>

                                                <i className="fa-regular fa-comment text-xs text-slate-300 transition-colors hover:text-blue-600" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                {/* SUGESTÕES DE AMIZADES */}
                                <div>
                                    <h3 className="mb-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">Sugestões para Você</h3>

                                    <div className="flex flex-col gap-3">{/* Dados reais podem entrar aqui */}</div>
                                </div>

                                <hr className="border-slate-100" />

                                {/* TÓPICOS POPULARES */}
                                <div>
                                    <h3 className="mb-3 flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                        <i className="fa-solid fa-fire text-amber-500" />
                                        Em Alta na Escola
                                    </h3>

                                    <div className="flex flex-col gap-1.5">{/* Dados reais podem entrar aqui */}</div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
}
