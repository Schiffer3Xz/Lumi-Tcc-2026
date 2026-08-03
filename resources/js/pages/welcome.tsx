import { Head, Link } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import {
    BookOpen, Sparkles, Users, ShieldCheck, ArrowRight, LogIn, UserPlus,
    Menu, X, Clock, TrendingUp, Search, GraduationCap, Star, Quote,
    ChevronDown, Mail, MapPin, Heart, CheckCircle, Calendar, BarChart3, Bell
} from 'lucide-react';

/* ──────────────────────────────────────────────
   Reveal — anima elementos ao entrar no viewport
─────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = '' }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    obs.unobserve(el);
                }
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

/* ──────────────────────────────────────────────
   FaqItem — item de acordeão para o FAQ
─────────────────────────────────────────────── */
function FaqItem({ question, answer, isOpen, onToggle }) {
    return (
        <div className={`rounded-2xl border transition-colors duration-300 ${isOpen ? 'border-blue-200 bg-blue-50/40' : 'border-slate-200/70 bg-white hover:border-slate-300'}`}>
            <button onClick={onToggle} className="w-full flex items-center justify-between gap-4 p-5 text-left">
                <span className="font-semibold text-slate-800 text-sm">{question}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <p className="text-sm text-slate-500 leading-relaxed px-5 pb-5">{answer}</p>
                </div>
            </div>
        </div>
    );
}

/* ──────────────────────────────────────────────
   LandingPage
─────────────────────────────────────────────── */
export default function LandingPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [openFaq, setOpenFaq] = useState(0);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const features = [
        { icon: BookOpen,    title: 'Acervo Inteligente',       desc: 'Busca avançada por títulos, autores, categorias e disponibilidade em tempo real.', color: 'blue' },
        { icon: Users,       title: 'Gestão de Alunos',         desc: 'Cadastre estudantes, acompanhe histórico de leituras e prazos de devolução.',     color: 'indigo' },
        { icon: Calendar,    title: 'Controle de Empréstimos',   desc: 'Automatize empréstimos e devoluções com lembretes automáticos por e-mail.',        color: 'emerald' },
        { icon: BarChart3,   title: 'Relatórios e Estatísticas', desc: 'Dashboards interativos com métricas de leitura e engajamento por turma.',          color: 'amber' },
        { icon: ShieldCheck, title: 'Segurança e LGPD',         desc: 'Plataforma em conformidade com a LGPD, com criptografia e backups automáticos.',    color: 'rose' },
        { icon: Bell,        title: 'Notificações Inteligentes', desc: 'Alertas de atraso, novidades do acervo e recomendações personalizadas.',            color: 'violet' },
    ];

    const colorMap = {
        blue:    'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
        indigo:  'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white',
        emerald: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
        amber:   'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white',
        rose:    'bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white',
        violet:  'bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white',
    };

    const stats = [
        { value: '500+',  label: 'Escolas cadastradas' },
        { value: '50k+',  label: 'Livros catalogados' },
        { value: '120k+', label: 'Empréstimos realizados' },
        { value: '4.9',   label: 'Avaliação dos usuários' },
    ];

    const steps = [
        { num: '01', title: 'Cadastre seu acervo', desc: 'Importe via planilha ou adicione livros manualmente com todos os dados bibliográficos em minutos.' },
        { num: '02', title: 'Gerencie empréstimos', desc: 'Registre empréstimos e devoluções com lembretes automáticos para alunos e responsáveis.' },
        { num: '03', title: 'Acompanhe resultados', desc: 'Visualize relatórios completos de engajamento e desenvolvimento da leitura escolar.' },
    ];

    const testimonials = [
        { name: 'Mariana Costa',       role: 'Bibliotecária — E.E. João Paulo II',  text: 'A plataforma transformou nossa gestão. Reduzimos em 80% o tempo gasto com controle de empréstimos.', rating: 5 },
        { name: 'Ricardo Alves',       role: 'Coordenador — Colégio Aurora',         text: 'Os relatórios de engajamento nos ajudaram a identificar alunos que precisavam de incentivo à leitura.', rating: 5 },
        { name: 'Patrícia Mendes',     role: 'Diretora — Instituto Educare',         text: 'Implementação simples e suporte excelente. Nossos alunos amaram a experiência de buscar livros online.', rating: 5 },
    ];

    const faqs = [
        { q: 'Como funciona o cadastro da escola?',     a: 'Basta criar uma conta, cadastrar os dados da instituição e começar a adicionar livros ao acervo. O processo leva menos de 10 minutos.' },
        { q: 'A plataforma está em conformidade com a LGPD?', a: 'Sim. Todos os dados dos alunos são criptografados e a plataforma segue integralmente as diretrizes da Lei Geral de Proteção de Dados.' },
        { q: 'É possível importar um acervo existente?', a: 'Sim. Oferecemos importação via planilha (CSV/Excel) e também integração com bases bibliográficas para acelerar o cadastro.' },
        { q: 'Existe limite de alunos ou livros?',      a: 'Não. O sistema suporta acervos e cadastros ilimitados, escalando conforme a necessidade da sua instituição.' },
    ];

    const navLinks = [
        { label: 'Recursos',      href: '#recursos' },
        { label: 'Como Funciona', href: '#como-funciona' },
        { label: 'Depoimentos',   href: '#depoimentos' },
        { label: 'FAQ',           href: '#faq' },
    ];

    return (
        <div className="min-h-screen w-full flex flex-col bg-slate-50 relative overflow-x-hidden text-slate-800 scroll-smooth">
            <Head title="Sala de Leitura — Plataforma Escolar de Gestão de Leitura" />

            {/* Keyframes inline */}
            <style>{`
                @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
                @keyframes floatSlow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
                @keyframes shimmer { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-float-slow { animation: floatSlow 8s ease-in-out infinite; }
                .animate-shimmer { background-size: 200% 200%; animation: shimmer 8s ease infinite; }
            `}</style>

            {/* Blobs decorativos de fundo */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-blue-200/30 blur-3xl" />
                <div className="absolute top-1/3 -right-24 w-[24rem] h-[24rem] rounded-full bg-indigo-200/25 blur-3xl" />
                <div className="absolute bottom-0 left-1/4 w-[30rem] h-[30rem] rounded-full bg-amber-100/20 blur-3xl" />
            </div>

            {/* ═══════════════════════════════════════
                HEADER
            ═══════════════════════════════════════ */}
            <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <a href="#" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 text-white group-hover:scale-105 transition-transform">
                            <BookOpen className="w-4.5 h-4.5" />
                        </div>
                        <span className="text-base font-bold text-slate-900 tracking-tight">Sala de Leitura</span>
                    </a>

                    {/* Nav desktop */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navLinks.map(link => (
                            <a key={link.href} href={link.href} className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 rounded-lg transition-colors">
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* Ações desktop */}
                    <div className="hidden lg:flex items-center gap-2.5">
                        <Link href={route('login')} className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5">
                            <LogIn className="w-3.5 h-3.5" /> Entrar
                        </Link>
                        <Link href={route('register')} className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-300 hover:bg-amber-400 text-slate-900 shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5">
                            <UserPlus className="w-3.5 h-3.5" /> Criar Conta
                        </Link>
                    </div>

                    {/* Hamburger mobile */}
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Menu mobile */}
                <div className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-96' : 'max-h-0'} ${scrolled ? 'bg-white/95 backdrop-blur-xl' : 'bg-white/90 backdrop-blur-xl'}`}>
                    <div className="px-6 py-4 flex flex-col gap-1">
                        {navLinks.map(link => (
                            <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                {link.label}
                            </a>
                        ))}
                        <div className="h-px bg-slate-200 my-2" />
                        <Link href={route('login')} className="px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">Entrar</Link>
                        <Link href={route('register')} className="px-3 py-2.5 text-sm font-semibold text-center rounded-lg bg-amber-300 hover:bg-amber-400 text-slate-900 transition-colors">Criar Conta</Link>
                    </div>
                </div>
            </header>

            {/* ═══════════════════════════════════════
                HERO
            ═══════════════════════════════════════ */}
            <section className="relative pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    {/* Lado esquerdo — texto */}
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-medium text-slate-600 mb-6">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>Inovação no incentivo à leitura escolar</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1]">
                            O ecossistema digital para a sua{' '}
                            <span className="relative inline-block">
                                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent animate-shimmer">Sala de Leitura</span>
                                <svg className="absolute -bottom-2 left-0 w-full h-2 text-amber-300" viewBox="0 0 200 8" preserveAspectRatio="none">
                                    <path d="M2 5 Q 50 1, 100 4 T 198 3" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                                </svg>
                            </span>
                        </h1>

                        <p className="text-base sm:text-lg text-slate-600 max-w-xl mb-8 leading-relaxed lg:mx-0 mx-auto">
                            Organize acervos, acompanhe o desenvolvimento literário dos alunos e gerencie empréstimos de forma simples, rápida e segura em um só lugar.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-3 lg:justify-start justify-center">
                            <Link href={route('login')} className="w-full sm:w-auto px-7 py-3.5 bg-amber-300 hover:bg-amber-400 text-slate-900 font-semibold rounded-2xl shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-2 text-sm hover:-translate-y-0.5">
                                <LogIn className="w-4 h-4" /> Acessar Sistema <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href={route('register')} className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-2xl shadow-sm border border-slate-200 transition-all flex items-center justify-center gap-2 text-sm hover:-translate-y-0.5">
                                Criar Nova Conta
                            </Link>
                        </div>

                        {/* Trust badges */}
                        <div className="flex items-center gap-5 mt-8 justify-center lg:justify-start">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <CheckCircle className="w-4 h-4 text-emerald-500" /> Sem cartão de crédito
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <CheckCircle className="w-4 h-4 text-emerald-500" /> Configuração em 5 min
                            </div>
                        </div>
                    </div>

                    {/* Lado direito — mockup de dashboard */}
                    <div className="relative">
                        {/* Card principal flutuante */}
                        <div className="relative animate-float">
                            <div className="bg-white rounded-3xl shadow-2xl shadow-slate-300/50 border border-slate-200/60 overflow-hidden">
                                {/* Janela header */}
                                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-100 bg-slate-50/80">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                                    <div className="ml-3 text-[10px] font-medium text-slate-400">sala-de-leitura.app/dashboard</div>
                                </div>

                                {/* Conteúdo do mockup */}
                                <div className="p-5 space-y-4">
                                    {/* Mini título + busca */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-xs font-bold text-slate-800">Acervo da Escola</div>
                                            <div className="text-[10px] text-slate-400">328 livros cadastrados</div>
                                        </div>
                                        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-100 rounded-lg w-32">
                                            <Search className="w-3 h-3 text-slate-400" />
                                            <span className="text-[10px] text-slate-400">Buscar livro...</span>
                                        </div>
                                    </div>

                                    {/* Stats mini */}
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="bg-blue-50 rounded-xl p-2.5">
                                            <div className="text-base font-bold text-blue-600">142</div>
                                            <div className="text-[9px] text-slate-500">Disponíveis</div>
                                        </div>
                                        <div className="bg-amber-50 rounded-xl p-2.5">
                                            <div className="text-base font-bold text-amber-600">86</div>
                                            <div className="text-[9px] text-slate-500">Emprestados</div>
                                        </div>
                                        <div className="bg-emerald-50 rounded-xl p-2.5">
                                            <div className="text-base font-bold text-emerald-600">98%</div>
                                            <div className="text-[9px] text-slate-500">Devoluções</div>
                                        </div>
                                    </div>

                                    {/* Lista de livros */}
                                    <div className="space-y-2">
                                        {[
                                            { title: 'O Pequeno Príncipe', status: 'Disponível', color: 'emerald' },
                                            { title: 'Dom Casmurro',       status: 'Emprestado', color: 'amber' },
                                            { title: 'A Moreninha',        status: 'Disponível', color: 'emerald' },
                                        ].map((book, i) => (
                                            <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-7 h-9 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-md flex items-center justify-center">
                                                        <BookOpen className="w-3 h-3 text-white" />
                                                    </div>
                                                    <span className="text-[11px] font-medium text-slate-700">{book.title}</span>
                                                </div>
                                                <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full bg-${book.color}-100 text-${book.color}-600`}>{book.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card flutuante secundário — notificação */}
                        <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl shadow-slate-300/40 border border-slate-200/60 p-3 flex items-center gap-2.5 animate-float-slow hidden sm:flex">
                            <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                                <Bell className="w-4 h-4 text-violet-600" />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-slate-800">Novo empréstimo!</div>
                                <div className="text-[9px] text-slate-400">Há 2 minutos</div>
                            </div>
                        </div>

                        {/* Card flutuante — avaliação */}
                        <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl shadow-slate-300/40 border border-slate-200/60 p-3 flex items-center gap-2.5 animate-float hidden sm:flex" style={{ animationDelay: '1s' }}>
                            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-slate-800">4.9 / 5.0</div>
                                <div className="text-[9px] text-slate-400">Avaliação geral</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                STATS BAR
            ═══════════════════════════════════════ */}
            <section className="py-12 px-6 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <Reveal>
                        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl shadow-xl shadow-blue-500/20 p-8 sm:p-10">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                {stats.map((stat, i) => (
                                    <div key={i} className="text-center">
                                        <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">{stat.value}</div>
                                        <div className="text-xs text-blue-100">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                FEATURES
            ═══════════════════════════════════════ */}
            <section id="recursos" className="py-20 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <Reveal>
                        <div className="text-center mb-14">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium mb-4">
                                <Sparkles className="w-3.5 h-3.5" /> Funcionalidades
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">Tudo que sua escola precisa</h2>
                            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
                                Uma plataforma completa para gerenciar todo o ciclo de leitura escolar — do cadastro do acervo aos relatórios de engajamento.
                            </p>
                        </div>
                    </Reveal>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map((feature, i) => (
                            <Reveal key={i} delay={i * 80}>
                                <div className="group bg-white rounded-2xl p-6 border border-slate-200/70 hover:border-transparent hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 h-full">
                                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300 ${colorMap[feature.color]}`}>
                                        <feature.icon className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-sm mb-1.5">{feature.title}</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                COMO FUNCIONA
            ═══════════════════════════════════════ */}
            <section id="como-funciona" className="py-20 px-6 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <Reveal>
                        <div className="text-center mb-14">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium mb-4">
                                <TrendingUp className="w-3.5 h-3.5" /> Passo a Passo
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">Comece em 3 passos simples</h2>
                            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
                                Sem complicações. Sua escola pode estar gerenciando o acervo literário ainda hoje.
                            </p>
                        </div>
                    </Reveal>

                    <div className="grid md:grid-cols-3 gap-6 relative">
                        {/* Linha conectora */}
                        <div className="hidden md:block absolute top-8 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-200" />

                        {steps.map((step, i) => (
                            <Reveal key={i} delay={i * 120}>
                                <div className="relative text-center">
                                    <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border-2 border-blue-100 shadow-lg shadow-blue-100/50 mb-5 z-10">
                                        <span className="text-lg font-extrabold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">{step.num}</span>
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-sm mb-2">{step.title}</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                DEPOIMENTOS
            ═══════════════════════════════════════ */}
            <section id="depoimentos" className="py-20 px-6 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <Reveal>
                        <div className="text-center mb-14">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-medium mb-4">
                                <Star className="w-3.5 h-3.5 fill-amber-400" /> Depoimentos
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">Quem usa, recomenda</h2>
                            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
                                Escolas de todo o Brasil já transformaram a gestão de suas salas de leitura.
                            </p>
                        </div>
                    </Reveal>

                    <div className="grid md:grid-cols-3 gap-5">
                        {testimonials.map((t, i) => (
                            <Reveal key={i} delay={i * 100}>
                                <div className="bg-white rounded-2xl p-6 border border-slate-200/70 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 h-full flex flex-col">
                                    <Quote className="w-7 h-7 text-blue-100 mb-3" />
                                    <p className="text-sm text-slate-600 leading-relaxed mb-5 flex-1">"{t.text}"</p>
                                    <div className="flex items-center gap-1 mb-4">
                                        {Array.from({ length: t.rating }).map((_, j) => (
                                            <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                                            {t.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-800">{t.name}</div>
                                            <div className="text-[10px] text-slate-400">{t.role}</div>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                FAQ
            ═══════════════════════════════════════ */}
            <section id="faq" className="py-20 px-6 relative z-10">
                <div className="max-w-2xl mx-auto">
                    <Reveal>
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-600 text-xs font-medium mb-4">
                                <CheckCircle className="w-3.5 h-3.5" /> Dúvidas Frequentes
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">Perguntas frequentes</h2>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Tudo que você precisa saber antes de começar.
                            </p>
                        </div>
                    </Reveal>

                    <Reveal delay={100}>
                        <div className="space-y-3">
                            {faqs.map((faq, i) => (
                                <FaqItem
                                    key={i}
                                    question={faq.q}
                                    answer={faq.a}
                                    isOpen={openFaq === i}
                                    onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                                />
                            ))}
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                CTA FINAL
            ═══════════════════════════════════════ */}
            <section className="py-20 px-6 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <Reveal>
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 p-10 sm:p-14 text-center shadow-2xl shadow-blue-500/30">
                            {/* Elementos decorativos */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
                            <div className="absolute -bottom-10 -left-10 w-52 h-52 rounded-full bg-amber-300/10 blur-3xl" />

                            <div className="relative z-10">
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md mb-6">
                                    <GraduationCap className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
                                    Pronto para transformar a leitura na sua escola?
                                </h2>
                                <p className="text-blue-100 max-w-lg mx-auto mb-8 text-sm leading-relaxed">
                                    Junte-se a mais de 500 instituições que já modernizaram suas salas de leitura. Comece agora — é grátis para testar.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                    <Link href={route('register')} className="w-full sm:w-auto px-8 py-3.5 bg-amber-300 hover:bg-amber-400 text-slate-900 font-semibold rounded-2xl shadow-lg shadow-amber-900/20 transition-all flex items-center justify-center gap-2 text-sm hover:-translate-y-0.5">
                                        <UserPlus className="w-4 h-4" /> Criar Conta Grátis
                                    </Link>
                                    <Link href={route('login')} className="w-full sm:w-auto px-8 py-3.5 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-semibold rounded-2xl border border-white/20 transition-all flex items-center justify-center gap-2 text-sm">
                                        <LogIn className="w-4 h-4" /> Já tenho conta
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                FOOTER
            ═══════════════════════════════════════ */}
            <footer className="relative z-10 bg-slate-900 text-slate-400 mt-auto">
                <div className="max-w-7xl mx-auto px-6 py-14">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                        {/* Brand */}
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white">
                                    <BookOpen className="w-4.5 h-4.5" />
                                </div>
                                <span className="text-sm font-bold text-white">Sala de Leitura</span>
                            </div>
                            <p className="text-xs leading-relaxed text-slate-500">
                                O ecossistema digital para gestão de leitura escolar. Feito com dedicação para escolas de todo o Brasil.
                            </p>
                        </div>

                        {/* Links — Plataforma */}
                        <div>
                            <h4 className="text-xs font-bold text-white mb-4 uppercase tracking-wider">Plataforma</h4>
                            <ul className="space-y-2.5">
                                <li><a href="#recursos" className="text-xs hover:text-white transition-colors">Recursos</a></li>
                                <li><a href="#como-funciona" className="text-xs hover:text-white transition-colors">Como Funciona</a></li>
                                <li><a href="#depoimentos" className="text-xs hover:text-white transition-colors">Depoimentos</a></li>
                                <li><a href="#faq" className="text-xs hover:text-white transition-colors">FAQ</a></li>
                            </ul>
                        </div>

                        {/* Links — Conta */}
                        <div>
                            <h4 className="text-xs font-bold text-white mb-4 uppercase tracking-wider">Conta</h4>
                            <ul className="space-y-2.5">
                                <li><Link href={route('login')} className="text-xs hover:text-white transition-colors">Entrar</Link></li>
                                <li><Link href={route('register')} className="text-xs hover:text-white transition-colors">Criar Conta</Link></li>
                            </ul>
                        </div>

                        {/* Contato */}
                        <div>
                            <h4 className="text-xs font-bold text-white mb-4 uppercase tracking-wider">Contato</h4>
                            <ul className="space-y-2.5">
                                <li className="flex items-center gap-2 text-xs"><Mail className="w-3.5 h-3.5" /> contato@saladeleitura.app</li>
                                <li className="flex items-center gap-2 text-xs"><MapPin className="w-3.5 h-3.5" /> Brasil</li>
                            </ul>
                        </div>
                    </div>

                    {/* Base do footer */}
                    <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-slate-500">
                            &copy; {new Date().getFullYear()} Sala de Leitura — Plataforma Escolar. Todos os direitos reservados.
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            Feito com <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> para escolas brasileiras
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}