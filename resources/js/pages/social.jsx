import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { router } from '@inertiajs/react';

export default function Feed({ auth, users }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

    const user = auth?.user ?? { name: 'asdf', email: '' };

    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
            <Head title="Sala de Leitura - Interação Social" />

            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

            <div className="flex min-h-screen bg-[#F4F6F9] font-sans text-slate-700">
                {/* OVERLAY MOBILE */}
                {mobileOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />}

                {/* SIDEBAR ORIGINAL (INALTERADA) */}
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
                                    item.active ? 'bg-yellow-300/10 text-yellow-300' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                                title={item.label}
                            >
                                {item.active && <span className="absolute top-1/2 left-0 h-8 w-1 -translate-y-1/2 rounded-r-full bg-yellow-300" />}

                                <i className={`${item.icon} text-lg`} />
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    <button className="rounded-xl p-3 text-gray-400 transition-all hover:bg-white/5 hover:text-white">
                        <i className="fa-solid fa-gear text-lg" />
                    </button>
                </aside>

                {/* CONTEÚDO PRINCIPAL + SIDEBAR DIREITA */}
                <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
                    {/* TOPBAR / NAVBAR SUPERIOR */}
                    <header className="sticky top-0 z-30 flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-6">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden">
                                <i className="fa-solid fa-bars text-xl" />
                            </button>

                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-base font-bold text-white shadow-sm shadow-blue-200">
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
                                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                            </button>

                            {/* PERFIL */}
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2.5 rounded-full border border-transparent p-1.5 pr-3 transition-colors hover:border-slate-200 hover:bg-slate-100"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white shadow-xs">
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

                    {/* ÁREA DE CONTEÚDO DIVIDIDA */}
                    <div className="flex flex-1 overflow-hidden">
                        {/* FEED PRINCIPAL DE PUBLICAÇÕES */}
                        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                            <div className="mx-auto flex max-w-[760px] flex-col gap-6">
                                {/* CABEÇALHO CLEAN DO FEED */}
                                <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
                                    <div>
                                        <span className="mb-0.5 block text-[10px] font-bold tracking-widest text-blue-600 uppercase">
                                            COMUNIDADE LITERÁRIA
                                        </span>
                                        <h2 className="text-xl font-bold text-slate-800">Feed de Atividades</h2>
                                    </div>

                                    <div className="flex items-center gap-2 rounded-xl border border-slate-200/60 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
                                        <i className="fa-solid fa-arrow-down-wide-short text-blue-500" />
                                        <span>Mais recentes</span>
                                    </div>
                                </div>

                                {/* CAIXA DE CRIAÇÃO DE POST */}
                                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white shadow-xs">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 rounded-xl border border-slate-200/70 bg-slate-50 p-3 transition-all focus-within:border-blue-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
                                            <textarea
                                                rows="2"
                                                placeholder="Compartilhe suas leituras, opiniões ou trechos favoritos..."
                                                className="w-full resize-none border-0 bg-transparent p-0 text-xs text-slate-700 placeholder-slate-400 outline-none focus:ring-0"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 pl-12">
                                        <div className="flex gap-2">
                                            <button
                                                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-blue-600"
                                                title="Adicionar Foto"
                                            >
                                                <i className="fa-regular fa-image text-sm" />
                                                <span>Foto</span>
                                            </button>
                                            <button
                                                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-blue-600"
                                                title="Marcar Livro"
                                            >
                                                <i className="fa-solid fa-book text-sm" />
                                                <span>Livro</span>
                                            </button>
                                        </div>

                                        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2 text-xs font-semibold text-white shadow-sm shadow-blue-200 transition-all hover:bg-blue-700">
                                            <i className="fa-solid fa-paper-plane text-[10px]" /> Publicar
                                        </button>
                                    </div>
                                </div>

                                {/* POST COM FOTO E LIVRO VINCULADO */}
                                <article className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-xs">
                                                LM
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1.5">
                                                    <h4 className="text-xs font-bold text-slate-800">Lara Mendonça</h4>
                                                    <span className="text-[11px] text-slate-400">@lara.leitora</span>
                                                </div>
                                                <p className="text-[10px] text-slate-400">há 12 minutos</p>
                                            </div>
                                        </div>

                                        <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600">
                                            <i className="fa-solid fa-ellipsis-vertical" />
                                        </button>
                                    </div>

                                    <p className="text-xs leading-relaxed text-slate-600">
                                        Terminei O Alquimista hoje de manhã e estou sem palavras. A frase &quot;quando você quer algo, todo o universo
                                        conspira para que você realize seu desejo&quot; nunca fez tanto sentido. Olhem essa edição ilustrada
                                        maravilhosa que chegou hoje! ✨
                                    </p>

                                    {/* MINI CARTÃO DE INFORMAÇÃO DO LIVRO */}
                                    <div className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-slate-50 p-3">
                                        <div className="flex h-13 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-700 text-xs font-bold text-white shadow-xs">
                                            📖
                                        </div>
                                        <div className="min-w-0">
                                            <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[9px] font-semibold tracking-wider text-amber-800 uppercase">
                                                Livro Mencionado
                                            </span>
                                            <p className="mt-0.5 truncate text-xs font-bold text-slate-800">O Alquimista</p>
                                            <p className="text-[10px] text-slate-500">Paulo Coelho</p>
                                        </div>
                                    </div>

                                    {/* FOTO DO POST */}
                                    <div className="max-h-[380px] overflow-hidden rounded-xl border border-slate-100 bg-slate-900/5">
                                        <img
                                            src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80"
                                            alt="Foto da Leitura"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    <div className="flex items-center gap-6 border-t border-slate-100 pt-2 text-xs font-medium text-slate-500">
                                        <button className="flex items-center gap-1.5 text-slate-600 transition-colors hover:text-red-500">
                                            <i className="fa-regular fa-heart text-sm" /> 24
                                        </button>
                                        <button className="flex items-center gap-1.5 text-slate-600 transition-colors hover:text-blue-600">
                                            <i className="fa-regular fa-comment text-sm" /> 7
                                        </button>
                                        <button className="flex items-center gap-1.5 text-slate-600 transition-colors hover:text-blue-600">
                                            <i className="fa-solid fa-share-nodes text-sm" /> Compartilhar
                                        </button>
                                        <button className="ml-auto text-slate-400 hover:text-slate-600">
                                            <i className="fa-regular fa-bookmark text-sm" />
                                        </button>
                                    </div>

                                    {/* COMENTÁRIOS */}
                                    <div className="flex flex-col gap-3 pt-1">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-white">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="relative flex-1">
                                                <input
                                                    type="text"
                                                    placeholder="Escreva um comentário..."
                                                    className="w-full rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-1.5 pr-8 text-xs text-slate-700 transition-all outline-none focus:border-blue-300 focus:bg-white"
                                                />
                                                <button className="absolute top-1/2 right-2.5 -translate-y-1/2 text-xs text-slate-400 hover:text-blue-600">
                                                    <i className="fa-solid fa-paper-plane" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2.5 pt-1 text-xs">
                                            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                                                CS
                                            </div>
                                            <div className="flex-1 rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                                                <div className="mb-0.5 flex items-center justify-between">
                                                    <span className="text-[11px] font-bold text-slate-800">Carlos Silva</span>
                                                    <span className="text-[9px] text-slate-400">há 8 minutos</span>
                                                </div>
                                                <p className="text-[11px] text-slate-600">
                                                    Edição incrível! Esse livro mudou totalmente minha forma de pensar.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </main>

                        {/* SIDEBAR DIREITA COMPLETA FIXA: COMUNIDADE & MENSAGENS */}
                        <aside className="hidden h-full w-[350px] flex-shrink-0 flex-col border-l border-slate-200/80 bg-white xl:flex">
                            {/* CAMPO DE BUSCA DE NOVAS PESSOAS */}
                            <div className="border-b border-slate-100 bg-slate-50/50 p-4">
                                <span className="mb-1.5 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">ENCONTRAR PESSOAS</span>
                                <div className="relative">
                                    <i className="fa-solid fa-magnifying-glass absolute top-1/2 left-3 -translate-y-1/2 text-xs text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar usuários na rede..."
                                        className="w-full rounded-xl border border-slate-200/90 bg-white py-2 pr-3 pl-9 text-xs text-slate-700 shadow-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* LISTA DE PESSOAS ADICIONADAS E SUGESTÕES */}
                            <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
                                {/* LISTA DE CONTATOS (CHAT) */}
                                <div>
                                    <div className="mb-3 flex items-center justify-between">
                                        <h3 className="text-xs font-bold tracking-wider text-slate-800 uppercase">Sugestões de Amizades</h3>

                                        <span className="rounded-full border border-emerald-200/60 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                                            {users.length} usuários
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        {users.map((user) => (
                                            <div
                                                key={user.id}
                                                  onClick={() => router.get(`people/${user.id}`)}
                                                className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent p-2.5 transition-all hover:border-slate-100 hover:bg-slate-50"
                                            >
                                                <div className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 shadow-xs">
                                                    {user.name
                                                        .split(' ')
                                                        .map((name) => name[0])
                                                        .slice(0, 2)
                                                        .join('')
                                                        .toUpperCase()}

                                                    <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-xs font-bold text-slate-800">{user.name}</p>

                                                    <p className="truncate text-[11px] text-slate-400">@{user.nickname}</p>
                                                </div>

                                                <i className="fa-regular fa-comment text-xs text-slate-300" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                {/* SUGESTÕES DE LEITORES (PESSOAS NÃO ADICIONADAS) */}
                                <div>
                                    <h3 className="mb-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">Amigos Adicionados   </h3>

                                    <div className="flex flex-col gap-3">
                                        {[
                                            {
                                                name: 'Rafaela Torres',
                                                books: '28 livros lidos',
                                                initials: 'RT',
                                                color: 'bg-indigo-100 text-indigo-700',
                                            },
                                            { name: 'Lucas Vance', books: '14 livros lidos', initials: 'LV', color: 'bg-rose-100 text-rose-700' },
                                        ].map((person, idx) => (
                                            <div key={idx} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2.5">
                                                    <div
                                                        className={`h-8 w-8 rounded-full ${person.color} flex items-center justify-center text-xs font-bold shadow-xs`}
                                                    >
                                                        {person.initials}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-800">{person.name}</p>
                                                        <p className="text-[10px] text-slate-400">{person.books}</p>
                                                    </div>
                                                </div>

                                                <button className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 transition-all hover:bg-blue-600 hover:text-white">
                                                    <i className="fa-solid fa-user-plus text-[10px]" /> Adicionar
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                {/* TÓPICOS POPULARES */}
                                <div>
                                    <h3 className="mb-3 flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                        <i className="fa-solid fa-fire text-amber-500" /> TÓPICOS POPULARES
                                    </h3>

                                    <div className="flex flex-col gap-2">
                                        {[
                                            { rank: 1, tag: '#DomCasmurro', posts: '34 publicações' },
                                            { rank: 2, tag: '#SemanaLiterária', posts: '21 publicações' },
                                            { rank: 3, tag: '#LeituradeVerão', posts: '17 publicações' },
                                        ].map((item) => (
                                            <div
                                                key={item.rank}
                                                className="flex items-center justify-between rounded-xl p-2 transition-colors hover:bg-slate-50"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-bold text-slate-400">#{item.rank}</span>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-800">{item.tag}</p>
                                                        <p className="text-[10px] text-slate-400">{item.posts}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
}
