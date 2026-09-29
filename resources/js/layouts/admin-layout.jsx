import Sidebar from '@/components/layout/Sidebar';
import FireflyIcon from '@/components/shared/FireflyIcon';
import AdminTopbar from '@/features/admin/AdminTopbar';
import { adminNavigation, adminSections } from '@/features/admin/navigation';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import '../../css/admin.css';

export default function AdminLayout({ title, section = 'dashboard', firstAccess = false, step = 1, children }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const { flash } = usePage().props;
    const { url } = usePage();
    const messages = flash?.success && (
        <div role="status" className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            {flash.success}
        </div>
    );
    return (
        <div className="admin-app bg-lumi-canvas min-h-dvh font-sans text-slate-700 antialiased">
            <Head title={title}>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
            </Head>
            <a
                href="#admin-content"
                className="sr-only fixed top-4 left-4 z-[100] rounded-xl bg-white p-3 text-sm font-semibold text-blue-700 shadow-lg focus:not-sr-only"
            >
                Ir para o conteúdo
            </a>
            {firstAccess ? (
                <main
                    id="admin-content"
                    tabIndex={-1}
                    className="admin-content flex min-h-dvh items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 px-4 py-10"
                >
                    <div className="w-full max-w-2xl">
                        <div className="mb-7 text-center">
                            <span className="bg-lumi-navy mb-3 inline-flex rounded-2xl p-4 text-yellow-300">
                                <FireflyIcon className="size-7" />
                            </span>
                            <p className="text-xl font-bold text-slate-900">Sala de Leitura</p>
                            <p className="mt-1 text-xs text-slate-500">Plataforma Escolar Web · Administração</p>
                        </div>
                        <ol aria-label="Etapas do primeiro acesso" className="mb-6 grid grid-cols-2 gap-3">
                            {['Configurar perfil', 'Verificar e-mail'].map((label, index) => (
                                <li
                                    key={label}
                                    aria-current={step === index + 1 ? 'step' : undefined}
                                    className={`rounded-xl border px-3 py-3 text-center text-xs font-semibold ${step === index + 1 ? 'border-yellow-300 bg-yellow-300 text-slate-900' : 'border-white bg-white/60 text-slate-500'}`}
                                >
                                    {index + 1}. {label}
                                </li>
                            ))}
                        </ol>
                        {messages}
                        {children}
                        <p className="mt-6 text-center text-xs text-slate-500">Acesso administrativo · Sala de Leitura</p>
                    </div>
                </main>
            ) : (
                <div className="flex min-h-dvh">
                    <Sidebar
                        id="admin-sidebar"
                        items={adminNavigation.map((item) => ({ ...item, href: route(item.route) }))}
                        activeItem={section}
                        isOpen={menuOpen}
                        onClose={() => setMenuOpen(false)}
                    >
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            aria-label="Sair da conta"
                            className="rounded-xl p-3 text-slate-400 hover:bg-white/5 hover:text-white"
                        >
                            <i className="fa-solid fa-right-from-bracket" aria-hidden="true" />
                        </Link>
                    </Sidebar>
                    <div className="flex min-w-0 flex-1 flex-col">
                        <AdminTopbar isMenuOpen={menuOpen} onMenuToggle={() => setMenuOpen(!menuOpen)} />
                        <main id="admin-content" tabIndex={-1} className="admin-content max-w-lumi-page mx-auto w-full flex-1 p-4 sm:p-6 lg:p-8">
                            {adminSections[section] && (
                                <nav aria-label="Navegação da seção" className="mb-6 flex flex-wrap gap-2">
                                    {adminSections[section].map(([name, label]) => {
                                        const href = route(name);
                                        const active = url.split('?')[0] === new URL(href, 'http://localhost').pathname;
                                        return (
                                            <Link
                                                key={name}
                                                href={href}
                                                aria-current={active ? 'page' : undefined}
                                                className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${active ? 'border-lumi-navy bg-lumi-navy text-yellow-300' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                                            >
                                                {label}
                                            </Link>
                                        );
                                    })}
                                </nav>
                            )}
                            {messages}
                            {children}
                        </main>
                        <footer className="px-6 py-5 text-center text-[11px] text-slate-500">Sala de Leitura · Painel administrativo</footer>
                    </div>
                </div>
            )}
        </div>
    );
}
