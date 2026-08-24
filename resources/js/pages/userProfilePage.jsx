import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';

export default function UserProfilePage({ auth, targetUser, users = [], isFollowing: initialIsFollowing = false }) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

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
    };

    const getBookList = (value) => (Array.isArray(value) ? value : []);
    const getBookCount = (value) => (Array.isArray(value) ? value.length : Number(value) || 0);

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

    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectUser = (userId) => {
        router.get(route('people', userId));
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
            <Head title={`Perfil de ${profile.name} - Sala de Leitura`} />

            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
            />

            <div className="flex min-h-screen bg-[#F4F6F9] font-sans text-slate-700">
                {/* OVERLAY MOBILE */}
                {mobileOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                        onClick={() => setMobileOpen(false)}
                    />
                )}

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
                                    item.active
                                        ? 'bg-yellow-300/10 text-yellow-300'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                                title={item.label}
                            >
                                {item.active && (
                                    <span className="absolute top-1/2 left-0 h-8 w-1 -translate-y-1/2 rounded-r-full bg-yellow-300" />
                                )}
                                <i className={`${item.icon} text-lg`} />
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    <button className="rounded-xl p-3 text-gray-400 transition-all hover:bg-white/5 hover:text-white">
                        <i className="fa-solid fa-gear text-lg" />
                    </button>
                </aside>

                {/* CONTEÚDO PRINCIPAL */}
                <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
                    {/* NAVBAR SUPERIOR */}
                    <header className="sticky top-0 z-30 flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-6">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setMobileOpen(true)}
                                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                            >
                                <i className="fa-solid fa-bars text-xl" />
                            </button>

                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-base font-bold text-white shadow-xs shadow-blue-200">
                                    <i className="fa-solid fa-book-open" />
                                </div>
                                <div>
                                    <h1 className="text-sm font-bold leading-tight text-slate-800">
                                        Sala de Leitura
                                    </h1>
                                    <p className="text-[11px] font-medium text-slate-400">
                                        Plataforma Escolar Web
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="relative rounded-full p-2.5 text-slate-600 transition-colors hover:bg-slate-100">
                                <i className="fa-regular fa-bell text-lg" />
                                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                            </button>

                            {/* PERFIL DROPDOWN */}
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2.5 rounded-full border border-transparent p-1.5 pr-3 transition-colors hover:border-slate-200 hover:bg-slate-100"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white shadow-xs overflow-hidden">
                                        {user.profile_photo ? (
                                            <img src={user.profile_photo} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            user.name ? user.name.charAt(0).toUpperCase() : 'U'
                                        )}
                                    </div>
                                    <span className="hidden text-xs font-semibold text-slate-700 sm:block">
                                        {user.name}
                                    </span>
                                    <i className="fa-solid fa-chevron-down text-[10px] text-slate-400" />
                                </button>

                                {profileOpen && (
                                    <div className="absolute right-0 z-50 mt-2 w-52 rounded-2xl border border-slate-100 bg-white py-1.5 shadow-xl">
                                        <div className="border-b border-slate-100 px-4 py-2.5">
                                            <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                                Conta
                                            </p>
                                            <p className="truncate text-xs font-bold text-slate-800">
                                                {user.name}
                                            </p>
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
                                            className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
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
                        {/* PAINEL PRINCIPAL DO PERFIL */}
                        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
                            <div>
                                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                    PERFIL SOCIAL
                                </span>
                                <h2 className="text-2xl font-bold text-slate-900">Estante do Leitor</h2>
                            </div>

                            {/* CARTÃO DE PERFIL */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 flex items-center justify-between shadow-xs">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 font-bold text-xl flex items-center justify-center border border-amber-200 overflow-hidden">
                                            {profile.profile_photo ? (
                                                <img src={profile.profile_photo} alt={profile.name} className="w-full h-full object-cover" />
                                            ) : (
                                                profile.name ? profile.name.charAt(0).toUpperCase() : 'U'
                                            )}
                                        </div>
                                        <span className="w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full absolute bottom-0 right-0" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-lg text-slate-900">{profile.name}</h3>
                                            {profile.nickname && (
                                                <span className="text-xs font-medium text-slate-400">
                                                    @{profile.nickname.replace('@', '')}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {profile.description || 'Nenhuma descrição informada.'}
                                        </p>
                                    </div>
                                </div>
                               <button
                                    onClick={() => {
                                        if (isFollowing) {
                                            router.delete(route('follow.destroy', targetUser.id), {
                                                onSuccess: () => setIsFollowing(false),
                                            });
                                        } else {
                                            router.post(route('follow.store', targetUser.id), {}, {
                                                preserveScroll: true,
                                                preserveState: true,
                                                onSuccess: () => setIsFollowing(true),
                                            });
                                        }
                                    }}
                                    className={`flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl font-medium transition-colors ${
                                        isFollowing
                                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                                >
                                    <i
                                        className={`fa-solid ${
                                            isFollowing ? 'fa-user-check' : 'fa-user-plus'
                                        } text-xs`}
                                    />

                                    {isFollowing ? 'Seguindo' : 'Seguir'}
                                </button>
                            </div>

                            {/* ESTATÍSTICAS DO USUÁRIO */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <StatCard icon="fa-book-open" count={getBookCount(profile.read_books)} label="Livros Lidos" />
                                <StatCard icon="fa-book-bookmark" count={getBookCount(profile.reading_books)} label="Lendo Agora" />
                                <StatCard icon="fa-bookmark" count={getBookCount(profile.shelf_books)} label="Na Estante" />
                                <StatCard icon="fa-star" count={getBookCount(profile.rated_books)} label="Avaliações" />
                            </div>

                            {/* HISTÓRICO DE LIVROS */}
                            <div className="bg-[#EFEAE1] border border-[#E3DCCE] rounded-2xl p-6 text-slate-800 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-amber-400/30 text-amber-900 rounded-xl">
                                            <i className="fa-solid fa-books text-lg" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm">Livros Adicionados</h4>
                                            <p className="text-xs text-slate-500">Títulos registrados pelo usuário</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-semibold bg-white/60 px-3 py-1 rounded-full text-slate-700">
                                        {allUserBooks.length} Títulos
                                    </span>
                                </div>

                                <div className="space-y-2.5">
                                    {allUserBooks.length > 0 ? (
                                        allUserBooks.map((book, idx) => (
                                            <div
                                                key={book.id || idx}
                                                className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-[#E3DCCE]/60 flex items-center justify-between gap-3"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-8 h-8 rounded-lg bg-amber-100/60 text-amber-800 flex items-center justify-center shrink-0 overflow-hidden">
                                                        {book.cover ? (
                                                            <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <i className="fa-solid fa-book text-sm" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h5 className="text-xs font-bold text-slate-800 truncate">
                                                            {book.title || 'Título indisponível'}
                                                        </h5>
                                                        <p className="text-[11px] text-slate-500 truncate">
                                                            {book.author || 'Autor não informado'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 shrink-0">
                                                    <span
                                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                                            book.status === 'Lendo'
                                                                ? 'bg-blue-100 text-blue-700'
                                                                : book.status === 'Lido'
                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                : 'bg-amber-100 text-amber-800'
                                                        }`}
                                                    >
                                                        {book.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-500 text-center py-4">
                                            Nenhum livro registrado no momento.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </main>

                        {/* PAINEL DIREITO - OUTROS USUÁRIOS */}
                        <aside className="hidden lg:block w-80 bg-white border-l border-slate-200/80 p-6 space-y-6 overflow-y-auto">
                            <div>
                                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                    COMUNIDADE
                                </span>
                                <h3 className="text-base font-bold text-slate-900">Outros Usuários</h3>
                            </div>

                            {/* LISTA DE USUÁRIOS VINDOS DA PROP `users` */}
                            <div className="space-y-2">
                                {users && users.length > 0 ? (
                                    users.map((u) => (
                                        <button
                                            key={u.id}
                                            onClick={() => handleSelectUser(u.id)}
                                            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors ${
                                                u.id === profile.id
                                                    ? 'bg-amber-50 border border-amber-200'
                                                    : 'hover:bg-slate-50 border border-transparent'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden">
                                                    {u.profile_photo ? (
                                                        <img src={u.profile_photo} alt={u.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        u.name ? u.name.charAt(0).toUpperCase() : 'U'
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold text-slate-800 truncate">
                                                        {u.name}
                                                    </p>
                                                    {u.nickname && (
                                                        <p className="text-[10px] text-slate-400 truncate">
                                                            @{u.nickname.replace('@', '')}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <i className="fa-solid fa-chevron-right text-[10px] text-slate-400" />
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-400 italic">Nenhum outro usuário encontrado.</p>
                                )}
                            </div>

                            {/* AVALIAÇÕES EM DESTAQUE DO USUÁRIO */}
                            {ratedBooks.length > 0 && (
                                <div className="space-y-3 pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        <i className="fa-solid fa-star text-[10px] text-amber-500" />
                                        <span>Últimas Avaliações</span>
                                    </div>

                                    <div className="space-y-2">
                                        {ratedBooks.slice(0, 3).map((review, idx) => (
                                            <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-slate-800 truncate">
                                                        {review.title || 'Livro Avaliado'}
                                                    </span>
                                                    <span className="text-xs text-amber-500 font-bold shrink-0">
                                                        ★ {review.rating || 5}
                                                    </span>
                                                </div>
                                                {review.comment && (
                                                    <p className="text-[11px] text-slate-500 italic truncate">
                                                        "{review.comment}"
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
}

function StatCard({ icon, count, label }) {
    return (
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex flex-col justify-between h-28 shadow-xs">
            <div className="w-7 h-7 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xs">
                <i className={`fa-solid ${icon}`} />
            </div>
            <div>
                <span className="text-2xl font-bold text-slate-900 block leading-none mb-1">{count}</span>
                <span className="text-xs text-slate-400">{label}</span>
            </div>
        </div>
    );
}