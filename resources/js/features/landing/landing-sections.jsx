import { Link } from '@inertiajs/react';
import { ArrowRight, BookOpen, Library, MessageSquare, School } from 'lucide-react';

const features = [
    {
        icon: Library,
        title: 'Descubra seu próximo livro',
        description: 'Explore o catálogo e encontre informações sobre as obras da sala de leitura.',
    },
    { icon: BookOpen, title: 'Acompanhe suas leituras', description: 'Organize sua estante e registre o progresso dos livros que você está lendo.' },
    { icon: MessageSquare, title: 'Compartilhe descobertas', description: 'Converse sobre livros e acompanhe as publicações da comunidade leitora.' },
];

export default function LandingSections() {
    return (
        <div className="relative z-10 mx-auto w-full max-w-7xl space-y-16 px-5 pt-16 pb-20 sm:px-8 md:px-16">
            <section id="funcionalidades" aria-labelledby="features-title" className="scroll-mt-8">
                <p className="text-xs font-bold tracking-widest text-amber-300 uppercase">Uma leitura de cada vez</p>
                <h2 id="features-title" className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                    Seu espaço de leitura
                </h2>
                <div className="mt-8 grid gap-5 md:grid-cols-3">
                    {features.map(({ icon: Icon, title, description }) => (
                        <article key={title} className="bg-lumi-landing-card/60 rounded-2xl border border-slate-700/60 p-6">
                            <Icon aria-hidden="true" className="mb-5 size-6 text-amber-300" />
                            <h3 className="text-base font-bold">{title}</h3>
                            <p className="mt-3 text-sm leading-relaxed text-slate-300">{description}</p>
                        </article>
                    ))}
                </div>
            </section>
            <section
                id="escolas"
                aria-labelledby="schools-title"
                className="bg-lumi-landing-card/60 flex scroll-mt-8 flex-col gap-6 rounded-3xl border border-slate-700/60 p-6 sm:p-8 md:flex-row md:items-center"
            >
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-slate-800 text-amber-300">
                    <School aria-hidden="true" className="size-7" />
                </div>
                <div className="flex-1">
                    <h2 id="schools-title" className="text-2xl font-bold tracking-tight">
                        A sala de leitura, mais perto
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
                        O Lumi reúne o acervo e a comunidade escolar em um só lugar. Consulte o catálogo e crie sua conta para organizar suas leituras
                        e participar das conversas.
                    </p>
                </div>
                <Link
                    href={route('register')}
                    className="text-lumi-landing inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-amber-300 px-6 py-3 text-sm font-bold transition-colors hover:bg-amber-400 md:self-center"
                >
                    Criar minha conta <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
            </section>
        </div>
    );
}
