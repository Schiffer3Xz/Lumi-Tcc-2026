import React, { useState, useRef, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function ConfigPage({ auth }) {
    const [privacy, setPrivacy] = useState(false);
    const [social, setSocial] = useState(true);
    const [recommendations, setRecommendations] = useState(true);
    const [friendRequests, setFriendRequests] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

    const user = auth?.user ?? { name: 'Usuário', email: 'usuario@exemplo.com' };

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
        },
        {
            id: 'config',
            label: 'Config',
            icon: 'fa-solid fa-gear',
            href: route('profile'),
            active: true,
        },
    ];

    return (
        <>
            <Head title="Sala de Leitura - Configurações" />

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

                {/* SIDEBAR PADRÃO */}
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
                    {/* TOPBAR / NAVBAR SUPERIOR */}
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
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white shadow-xs">
                                        {user.name.charAt(0).toUpperCase()}
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

                    {/* ÁREA DE CONTEÚDO E SIDEBAR DIREITA */}
                    <div className="flex flex-1 overflow-hidden">
                        {/* CONTEÚDO PRINCIPAL DE CONFIGURAÇÕES */}
                        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
                            <div>
                                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                    SALA DE LEITURA
                                </span>
                                <h2 className="text-2xl font-bold text-slate-900">Configurações</h2>
                            </div>

                            {/* CARTÃO DE PERFIL */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 flex items-center justify-between shadow-xs">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-800 font-bold text-xl flex items-center justify-center border border-blue-200">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full absolute bottom-0 right-0" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-lg text-slate-900">{user.name}</h3>
                                            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium border border-blue-100">
                                                🛡️ Aluno Verificado
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400">{user.email}</p>
                                    </div>
                                </div>
                                <Link
                                    href={route('profile.edit')}
                                    className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-medium transition-colors"
                                >
                                    <i className="fa-solid fa-pen-to-square text-xs" />
                                    Editar Perfil
                                </Link>
                            </div>

                            {/* MÉTRICAS DA CONTA */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <StatCard icon="fa-book-open" count="14" label="Livros Lidos" />
                                <StatCard icon="fa-book-bookmark" count="2" label="Em Leitura" />
                                <StatCard icon="fa-bookmark" count="7" label="Na Estante" />
                                <StatCard icon="fa-star" count="9" label="Avaliações" />
                            </div>

                            {/* BANNER DE REGRAS */}
                            <div className="bg-[#EFEAE1] border border-[#E3DCCE] rounded-2xl p-6 text-slate-800 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-yellow-400/30 text-yellow-800 rounded-xl">
                                        <i className="fa-solid fa-circle-info text-lg" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">Regras da Sala de Leitura</h4>
                                        <p className="text-xs text-slate-500">Normas vigentes — Ano letivo 2026</p>
                                    </div>
                                </div>

                                <ol className="space-y-2 text-xs text-slate-700">
                                    {[
                                        "Prazo máximo de empréstimo: 7 dias úteis por exemplar.",
                                        "Máximo de 2 livros emprestados simultaneamente por aluno.",
                                        "Renovações devem ser solicitadas pelo sistema até o dia do vencimento.",
                                        "Danos ou extravios resultam em reposição do exemplar pelo responsável.",
                                        "Respeite o silêncio e o espaço coletivo da sala de leitura.",
                                        "A devolução fora do prazo implica suspensão do serviço por 7 dias."
                                    ].map((rule, idx) => (
                                        <li key={idx} className="flex items-start gap-2.5">
                                            <span className="w-4 h-4 bg-yellow-400/40 text-yellow-900 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                                                {idx + 1}
                                            </span>
                                            <span>{rule}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </main>

                        {/* PAINEL DIREITO - PREFERÊNCIAS */}
                        <aside className="hidden lg:block w-80 bg-white border-l border-slate-200/80 p-6 space-y-6 overflow-y-auto">
                            <div>
                                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                    CONTA
                                </span>
                                <h3 className="text-base font-bold text-slate-900">Preferências</h3>
                            </div>

                            {/* PRIVACIDADE */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <i className="fa-solid fa-lock text-[10px]" />
                                    <span>Privacidade</span>
                                </div>

                                <ToggleCard
                                    title="Avaliações Públicas"
                                    description="Suas avaliações são privadas."
                                    enabled={privacy}
                                    onChange={() => setPrivacy(!privacy)}
                                />
                                <ToggleCard
                                    title="Ativar Recursos Sociais"
                                    description="Chat, seguidores e feed de atividades."
                                    enabled={social}
                                    onChange={() => setSocial(!social)}
                                />
                            </div>

                            {/* NOTIFICAÇÕES */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <i className="fa-solid fa-bell text-[10px]" />
                                    <span>Notificações</span>
                                </div>

                                <ToggleCard
                                    title="Recomendações de Livros"
                                    description="Receba sugestões personalizadas semanalmente."
                                    enabled={recommendations}
                                    onChange={() => setRecommendations(!recommendations)}
                                />
                                <ToggleCard
                                    title="Solicitações de Amizade"
                                    description="Alertas quando alguém quiser seguir você."
                                    enabled={friendRequests}
                                    onChange={() => setFriendRequests(!friendRequests)}
                                />
                            </div>

                            {/* SESSÃO ATUAL */}
                            <div className="pt-4 border-t border-slate-100 space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                    Sessão Atual
                                </span>
                                <p className="text-xs text-slate-500">Última atividade: hoje</p>
                                <p className="text-xs text-slate-400">Dispositivo: Navegador Web</p>
                            </div>
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

function ToggleCard({ title, description, enabled, onChange }) {
    return (
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 flex items-start justify-between gap-2">
            <div>
                <h4 className="text-xs font-bold text-slate-800">{title}</h4>
                <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{description}</p>
            </div>
            <button
                onClick={onChange}
                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors shrink-0 mt-0.5 ${
                    enabled ? 'bg-amber-400 justify-end' : 'bg-slate-300 justify-start'
                }`}
            >
                <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </button>
        </div>
    );
}