import TextLink from '@/components/text-link';
import { cn } from '@/lib/utils';
import { Head, Link } from '@inertiajs/react';

const authTabs = [
    { routeName: 'login', label: 'Entrar no Sistema' },
    { routeName: 'register', label: 'Criar Conta' },
];

export default function ReadingAuthLayout({ title, subtitle, activePage = null, heading = 'Sala de Leitura', children, className = '' }) {
    return (
        <main
            id="conteudo-principal"
            className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-slate-100 bg-gradient-to-br from-slate-100 via-blue-50/50 to-slate-200 p-4"
        >
            <Head title={title} />
            <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute top-1/4 -right-20 h-80 w-80 rounded-full bg-indigo-100/40 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute right-10 -bottom-20 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />

            <div
                className={cn(
                    'relative z-10 my-4 w-full max-w-md rounded-3xl border border-white/80 bg-white/90 p-5 text-slate-900 shadow-[0_20px_50px_rgba(8,112,184,0.07)] backdrop-blur-xl sm:my-8 sm:p-8',
                    className,
                )}
            >
                <div className="mb-8 flex flex-col items-center text-center">
                    <Link
                        href={route('home')}
                        aria-label="Lumi — página inicial"
                        className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                    >
                        <svg aria-hidden="true" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">{heading}</h1>
                    <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
                </div>

                {activePage && (
                    <nav aria-label="Acesso à plataforma" className="mb-6 flex rounded-full bg-slate-100/80 p-1">
                        {authTabs.map(({ routeName, label }) => (
                            <TextLink
                                key={routeName}
                                href={route(routeName)}
                                aria-current={activePage === routeName ? 'page' : undefined}
                                className={cn(
                                    'flex min-h-10 flex-1 items-center justify-center rounded-full px-2 py-2 text-center text-xs font-semibold transition-all',
                                    activePage === routeName ? 'bg-amber-300 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900',
                                )}
                            >
                                {label}
                            </TextLink>
                        ))}
                    </nav>
                )}

                {children}
            </div>
        </main>
    );
}
