import LandingHero from '@/features/landing/landing-hero';
import LandingNavbar from '@/features/landing/landing-navbar';
import ReadingPreview from '@/features/landing/reading-preview';
import { Head } from '@inertiajs/react';
import { HelpCircle, MessageSquare } from 'lucide-react';

const initialReadings = [
    { id: 1, title: 'Dom Casmurro', author: 'Machado de Assis', progress: 72, color: 'bg-sky-400' },
    { id: 2, title: 'O Alquimista', author: 'Paulo Coelho', progress: 45, color: 'bg-amber-300' },
    { id: 3, title: 'Vidas Secas', author: 'Graciliano Ramos', progress: 20, color: 'bg-sky-300' },
];

const fireflies = [
    { id: 'upper-left', className: 'absolute top-12 left-1/4 w-1.5 h-1.5 bg-amber-200/80 rounded-full blur-[1px] animate-pulse duration-1000' },
    { id: 'middle-left', className: 'absolute top-1/3 left-10 w-2 h-2 bg-amber-300/60 rounded-full blur-[2px] animate-ping duration-1000' },
    { id: 'center', className: 'absolute top-1/2 left-1/3 w-1 h-1 bg-sky-200/70 rounded-full animate-pulse duration-700' },
    { id: 'lower-left', className: 'absolute bottom-1/4 left-16 w-2.5 h-2.5 bg-sky-300/40 rounded-full blur-sm animate-pulse duration-1000' },
    { id: 'upper-right', className: 'absolute top-20 right-1/3 w-1.5 h-1.5 bg-amber-200/60 rounded-full blur-[1px] animate-pulse duration-700' },
    { id: 'lower-right', className: 'absolute bottom-20 right-1/4 w-2 h-2 bg-amber-300/50 rounded-full blur-[1px] animate-ping duration-1000' },
];

export default function LandingPage() {
    return (
        <>
            <Head title="Lumi - Sala de Leitura Digital" />
            <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-[#1b2234] font-sans text-white selection:bg-amber-300 selection:text-slate-900">
                {fireflies.map(({ id, className }) => (
                    <div key={id} aria-hidden="true" className={className} />
                ))}
                <LandingNavbar
                    homeHref={route('dashboard')}
                    links={[
                        { id: 'features', href: '#funcionalidades', label: 'Funcionalidades', isAnchor: true },
                        { id: 'catalog', href: route('catalogo'), label: 'Catálogo' },
                        { id: 'schools', href: '#escolas', label: 'Para Escolas', isAnchor: true },
                    ]}
                    action={{ href: route('login'), label: 'Entrar' }}
                />
                <LandingHero
                    badge="Sala de Leitura Digital"
                    title={
                        <>
                            Onde a leitura <br />
                            <span className="text-amber-300 drop-shadow-[0_0_15px_rgba(252,211,77,0.3)]">brilha</span> como <br />
                            vagalume
                        </>
                    }
                    description="Uma plataforma escolar completa para descobrir livros, acompanhar leituras, participar de debates e crescer junto com a comunidade leitora."
                    primaryAction={{ href: route('register'), label: 'Começar agora' }}
                    secondaryAction={{ href: route('catalogo'), label: 'Ver catálogo' }}
                >
                    <ReadingPreview initialReadings={initialReadings} title="Minhas Leituras">
                        <div className="flex items-start gap-3 rounded-2xl border border-slate-700/50 bg-slate-800/70 p-3.5 text-xs text-slate-300 shadow-sm">
                            <MessageSquare className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-400" />
                            <p className="leading-snug">
                                <span className="font-semibold text-white">Ana Costa</span> comentou em <span className="italic">“Dom Casmurro”</span>
                            </p>
                        </div>
                    </ReadingPreview>
                </LandingHero>
                <footer className="relative z-10 flex flex-col items-center justify-center gap-2 pb-6 text-xs text-slate-500">
                    <div className="h-6 w-px animate-bounce bg-slate-700/80" />
                    <span className="text-[10px] font-bold tracking-widest text-slate-400">SCROLL</span>
                </footer>
                <button
                    type="button"
                    title="Ajuda e Suporte"
                    aria-label="Ajuda e Suporte"
                    className="fixed right-5 bottom-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-800/90 text-slate-300 shadow-lg transition-all duration-200 hover:scale-110 hover:bg-amber-300 hover:text-slate-900"
                >
                    <HelpCircle className="h-5 w-5" />
                </button>
            </div>
        </>
    );
}
