import { Head, Link } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import {
    BookOpen, MessagesSquare, Send, Search, Star, Heart, MessageCircle,
    Share2, Users, ArrowRight, LogIn, UserPlus, Menu, X, Sparkles,
    TrendingUp, Bookmark, Eye, Wifi, Zap, ShieldCheck, ChevronDown,
    Quote, CheckCircle, Library, PenLine, Globe
} from 'lucide-react';

/* ═══ Reveal — animação on scroll ═══ */
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

/* ═══ FaqItem ═══ */
function FaqItem({ question, answer, isOpen, onToggle }) {
    return (
        <div className={`rounded-2xl border transition-colors duration-300 ${isOpen ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-200/70 bg-white hover:border-slate-300'}`}>
            <button onClick={onToggle} className="w-full flex items-center justify-between gap-4 p-5 text-left">
                <span className="font-semibold text-slate-800 text-sm">{question}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`} />
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <p className="text-sm text-slate-500 leading-relaxed px-5 pb-5">{answer}</p>
                </div>
            </div>
        </div>
    );
}

export default function LandingPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [openFaq, setOpenFaq] = useState(0);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const pillars = [
        {
            icon: Library,
            tag: 'Catálogo',
            title: 'Explore o Acervo',
            desc: 'Busque, filtre e descubam livros disponíveis na biblioteca da escola em tempo real. Cada livro com sua capa, sinopse, autor e status de disponibilidade.',
            color: 'emerald',
            features: ['Busca por título, autor ou categoria', 'Status de disponibilidade ao vivo', 'Filtros por gênero literário', 'Página detalhada de cada obra'],
        },
        {
            icon: PenLine,
            tag: 'Rede Social',
            title: 'Compartilhe Ideias',
            desc: 'Estudantes postam resenhas, recomendações e opiniões sobre o que estão lendo. Curtam, comentem e compartilhem — uma comunidade literária ativa.',
            color: 'blue',
            features: ['Posts com texto e imagens', 'Curtidas e comentários', 'Feed personalizado', 'Resenhas e recomendações'],
        },
        {
            icon: MessagesSquare,
            tag: 'Chat',
            title: 'Converse em Tempo Real',
            desc: 'Chat instantâneo entre alunos para trocar ideias sobre leituras, combinar empréstimos e tirar dúvidas. Comunicação fluida e direta.',
            color: 'violet',
            features: ['Mensagens instantâneas', 'Indicador "digitando..."', 'Histórico de conversas', 'Notificações em tempo real'],
        },
    ];

    const colorMap = {
        emerald: {
            icon: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
            badge: 'bg-emerald-50 text-emerald-600',
            glow: 'from-emerald-500/20 to-emerald-500/0',
            line: 'bg-emerald-400',
            dot: 'bg-emerald-500',
        },
        blue: {
            icon: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
            badge: 'bg-blue-50 text-blue-600',
            glow: 'from-blue-500/20 to-blue-500/0',
            line: 'bg-blue-400',
            dot: 'bg-blue-500',
        },
        violet: {
            icon: 'bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white',
            badge: 'bg-violet-50 text-violet-600',
            glow: 'from-violet-500/20 to-violet-500/0',
            line: 'bg-violet-400',
            dot: 'bg-violet-500',
        },
    };

    const stats = [
        { value: '500+',  label: 'Livros catalogados' },
        { value: '300+',  label: 'Alunos ativos' },
        { value: '1.2k+', label: 'Posts publicados' },
        { value: '4.9',   label: 'Avaliação dos alunos' },
    ];

    const steps = [
        { num: '01', title: 'Pesquise o livro', desc: 'Use a busca ou navegue pelas categorias para encontrar sua próxima leitura no catálogo da escola.' },
        { num: '02', title: 'Compartilhe sua opinião', desc: 'Escreva uma resenha, recomende para os colegas e participe da comunidade literária.' },
        { num: '03', title: 'Converse com colegas', desc: 'Tire dúvidas, combine trocas de livros e discuta suas leituras no chat em tempo real.' },
    ];

    const testimonials = [
        { name: 'Ana Beatriz', role: 'Aluna — 2º Ano EM', text: 'Encontrei livros que nem sabia que existiam na biblioteca. As resenhas dos colegas me ajudaram muito!', rating: 5 },
        { name: 'Lucas Ferreira', role: 'Aluno — 9º Ano', text: 'O chat é sensacional. Troquei ideias sobre "O Senhor dos Anéis" com gente que eu nem conhecia right aqui na escola.', rating: 5 },
        { name: 'Profª Carla', role: 'Bibliotecária', text: 'Os alunos estão muito mais engajados com a leitura. A rede social criou uma comunidade literária de verdade.', rating: 5 },
    ];

    const faqs = [
        { q: 'Como funciona o catálogo de livros?',           a: 'O catálogo exibe todos os livros da biblioteca escolar com capa, sinopse, autor e status (disponível/emprestado). Você pode buscar por título, autor ou gênero.' },
        { q: 'Preciso de conta para ver os livros?',           a: 'O catálogo é visível para todos, mas para postar resenhas, curtir e usar o chat você precisa criar uma conta com seu e-mail escolar.' },
        { q: 'Como funciona a rede social?',                   a: 'Cada aluno pode publicar resenhas, recomendações e opiniões sobre livros. O feed mostra os posts mais recentes e populares da comunidade.' },
        { q: 'O chat é realmente em tempo real?',              a: 'Sim! O chat usa WebSocket para entregar mensagens instantaneamente, com indicador de "digitando" e notificações em tempo real.' },
        { q: 'A plataforma é segura para alunos?',             a: 'Sim. Apenas estudantes e servidores da escola têm acesso, e todo conteúdo é moderado pela equipe da biblioteca.' },
    ];

    const navLinks = [
        { label: 'Catálogo',     href: '#catalogo' },
        { label: 'Rede Social',  href: '#rede-social' },
        { label: 'Chat',         href: '#chat' },
        { label: 'Como Funciona', href: '#como-funciona' },
        { label: 'FAQ',          href: '#faq' },
    ];

    return (
        <div className="min-h-screen w-full flex flex-col bg-slate-50 relative overflow-x-hidden text-slate-800 scroll-smooth">
            <Head title="Lumi — Catálogo, Rede Social e Chat para Bibliotecas Escolares" />

            {/* Keyframes */}
            <style>{`
                @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
                @keyframes floatSlow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
                @keyframes shimmer { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
                @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(2);opacity:0} }
                @keyframes slide-in { from{transform:translateX(-100%)} to{transform:translateX(0)} }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-float-slow { animation: floatSlow 8s ease-in-out infinite; }
                .animate-shimmer { background-size: 200% 200%; animation: shimmer 8s ease infinite; }
                .animate-pulse-ring { animation: pulse-ring 2s ease-out infinite; }
                .animate-slide-in { animation: slide-in 0.4s ease-out; }
            `}</style>

            {/* Blobs de fundo */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-emerald-200/25 blur-3xl" />
                <div className="absolute top-1/3 -right-24 w-[24rem] h-[24rem] rounded-full bg-blue-200/20 blur-3xl" />
                <div className="absolute bottom-0 left-1/4 w-[30rem] h-[30rem] rounded-full bg-violet-200/20 blur-3xl" />
            </div>

            {/* ═══════════════════════════════════════
                HEADER
            ═══════════════════════════════════════ */}
            <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <a href="#" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 text-white group-hover:scale-105 transition-transform">
                            <BookOpen className="w-4.5 h-4.5" />
                        </div>
                        <span className="text-base font-bold text-slate-900 tracking-tight">Lumi</span>
                    </a>

                    <nav className="hidden lg:flex items-center gap-1">
                        {navLinks.map(link => (
                            <a key={link.href} href={link.href} className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 rounded-lg transition-colors">
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    <div className="hidden lg:flex items-center gap-2.5">
                        <Link href={route('login')} className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5">
                            <LogIn className="w-3.5 h-3.5" /> Entrar
                        </Link>
                        <Link href={route('register')} className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5">
                            <UserPlus className="w-3.5 h-3.5" /> Criar Conta
                        </Link>
                    </div>

                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                <div className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-96' : 'max-h-0'} ${scrolled ? 'bg-white/95 backdrop-blur-xl' : 'bg-white/90 backdrop-blur-xl'}`}>
                    <div className="px-6 py-4 flex flex-col gap-1">
                        {navLinks.map(link => (
                            <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                {link.label}
                            </a>
                        ))}
                        <div className="h-px bg-slate-200 my-2" />
                        <Link href={route('login')} className="px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">Entrar</Link>
                        <Link href={route('register')} className="px-3 py-2.5 text-sm font-semibold text-center rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors">Criar Conta</Link>
                    </div>
                </div>
            </header>

            {/* ═══════════════════════════════════════
                HERO
            ═══════════════════════════════════════ */}
            <section className="relative pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    {/* Texto */}
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-medium text-slate-600 mb-6">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Plataforma literária para escolas</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1]">
                            Catálogo, rede social e chat{' '}
                            <span className="relative inline-block">
                                <span className="bg-gradient-to-r from-emerald-500 via-blue-600 to-violet-600 bg-clip-text text-transparent animate-shimmer">num só lugar</span>
                                <svg className="absolute -bottom-2 left-0 w-full h-2 text-emerald-300" viewBox="0 0 200 8" preserveAspectRatio="none">
                                    <path d="M2 5 Q 50 1, 100 4 T 198 3" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                                </svg>
                            </span>
                        </h1>

                        <p className="text-base sm:text-lg text-slate-600 max-w-xl mb-8 leading-relaxed lg:mx-0 mx-auto">
                            A plataforma que conecta alunos aos livros da biblioteca escolar. Descubra novas leituras, compartilhe suas opiniões e converse com colegas em tempo real.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-3 lg:justify-start justify-center">
                            <Link href={route('register')} className="w-full sm:w-auto px-7 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 text-sm hover:-translate-y-0.5">
                                <UserPlus className="w-4 h-4" /> Criar Conta
                            </Link>
                            <Link href={route('login')} className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-2xl shadow-sm border border-slate-200 transition-all flex items-center justify-center gap-2 text-sm hover:-translate-y-0.5">
                                <LogIn className="w-4 h-4" /> Já tenho conta
                            </Link>
                        </div>

                        <div className="flex items-center gap-5 mt-8 justify-center lg:justify-start flex-wrap">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <CheckCircle className="w-4 h-4 text-emerald-500" /> Catálogo completo
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <CheckCircle className="w-4 h-4 text-emerald-500" /> Rede social ativa
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <CheckCircle className="w-4 h-4 text-emerald-500" /> Chat em tempo real
                            </div>
                        </div>
                    </div>

                    {/* Mockup — dashboard com 3 painéis */}
                    <div className="relative">
                        {/* Painel principal — Catálogo */}
                        <div className="relative animate-float">
                            <div className="bg-white rounded-3xl shadow-2xl shadow-slate-300/50 border border-slate-200/60 overflow-hidden">
                                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-100 bg-slate-50/80">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                                    <div className="ml-3 text-[10px] font-medium text-slate-400">biblioescola.app/catalogo</div>
                                </div>

                                <div className="p-5 space-y-4">
                                    {/* Busca */}
                                    <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-100 rounded-xl">
                                        <Search className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="text-[11px] text-slate-400">Buscar livro, autor ou gênero...</span>
                                    </div>

                                    {/* Grid de livros */}
                                    <div className="grid grid-cols-3 gap-2.5">
                                        {[
                                            { title: 'O Pequeno Príncipe', color: 'from-blue-400 to-blue-600', available: true },
                                            { title: 'Dom Casmurro', color: 'from-amber-400 to-orange-500', available: false },
                                            { title: '1984', color: 'from-slate-500 to-slate-700', available: true },
                                            { title: 'A Moreninha', color: 'from-rose-400 to-rose-600', available: true },
                                            { title: 'Capitães', color: 'from-emerald-400 to-emerald-600', available: false },
                                            { title: 'Frankenstein', color: 'from-violet-400 to-violet-600', available: true },
                                        ].map((book, i) => (
                                            <div key={i} className="group cursor-pointer">
                                                <div className={`aspect-[3/4] rounded-lg bg-gradient-to-b ${book.color} flex items-center justify-center mb-1.5 relative`}>
                                                    <BookOpen className="w-4 h-4 text-white/70" />
                                                    <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white ${book.available ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                                </div>
                                                <div className="text-[8px] font-medium text-slate-700 truncate">{book.title}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Painel flutuante — Post da rede social */}
                        <div className="absolute -bottom-8 -left-4 sm:-left-8 bg-white rounded-2xl shadow-xl shadow-slate-300/40 border border-slate-200/60 p-3.5 w-60 animate-float-slow hidden sm:block">
                            <div className="flex items-center gap-2 mb-2.5">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-[9px] font-bold">AB</div>
                                <div>
                                    <div className="text-[10px] font-bold text-slate-800">Ana Beatriz</div>
                                    <div className="text-[8px] text-slate-400">Acabou de ler • 2min</div>
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-600 leading-relaxed mb-2.5">
                                "O Pequeno Príncipe me fez repensar tudo sobre amizade. Recomendo demais! 🌹"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-[9px] text-rose-500 font-medium">
                                    <Heart className="w-3 h-3 fill-rose-400 text-rose-400" /> 24
                                </div>
                                <div className="flex items-center gap-1 text-[9px] text-slate-400">
                                    <MessageCircle className="w-3 h-3" /> 8
                                </div>
                                <div className="flex items-center gap-1 text-[9px] text-slate-400">
                                    <Share2 className="w-3 h-3" />
                                </div>
                            </div>
                        </div>

                        {/* Painel flutuante — Chat */}
                        <div className="absolute -top-6 -right-2 sm:-right-6 bg-white rounded-2xl shadow-xl shadow-slate-300/40 border border-slate-200/60 p-3.5 w-52 animate-float hidden sm:block" style={{ animationDelay: '1s' }}>
                            <div className="flex items-center gap-1.5 mb-2.5 pb-2 border-b border-slate-100">
                                <div className="relative">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-pulse-ring" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-800">Chat — Literatura</span>
                                <Wifi className="w-3 h-3 text-emerald-500 ml-auto" />
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-start">
                                    <div className="bg-slate-100 rounded-lg rounded-tl-sm px-2.5 py-1 text-[9px] text-slate-700 max-w-[80%]">Alguém leu 1984?</div>
                                </div>
                                <div className="flex justify-end">
                                    <div className="bg-emerald-500 text-white rounded-lg rounded-tr-sm px-2.5 py-1 text-[9px] max-w-[80%]">Eu! incrível livro 📚</div>
                                </div>
                                <div className="flex justify-start">
                                    <div className="bg-slate-100 rounded-lg rounded-tl-sm px-2.5 py-1 text-[9px] text-slate-700 max-w-[80%]">
                                        <span className="inline-flex gap-0.5">
                                            <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </span>
                                    </div>
                                </div>
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
                        <div className="bg-gradient-to-r from-emerald-600 via-blue-600 to-violet-600 rounded-3xl shadow-xl shadow-blue-500/20 p-8 sm:p-10">
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
                OS 3 PILARES — SEÇÕES ALTERNADAS
            ═══════════════════════════════════════ */}
            {pillars.map((pillar, idx) => {
                const isReverse = idx % 2 === 1;
                const colors = colorMap[pillar.color];

                return (
                    <section key={idx} id={pillar.tag.toLowerCase().replace(' ', '-')} className={`py-20 px-6 relative z-10 ${idx === 1 ? 'bg-white/50' : ''}`}>
                        <div className="max-w-6xl mx-auto">
                            <div className={`grid lg:grid-cols-2 gap-12 items-center ${isReverse ? 'lg:grid-flow-col-dense' : ''}`}>
                                {/* Texto */}
                                <Reveal className={isReverse ? 'lg:col-start-2' : ''}>
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${colors.badge} text-xs font-medium mb-4`}>
                                        <pillar.icon className="w-3.5 h-3.5" /> {pillar.tag}
                                    </div>
                                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">{pillar.title}</h2>
                                    <p className="text-slate-600 mb-6 leading-relaxed text-sm sm:text-base">{pillar.desc}</p>
                                    <ul className="space-y-3 mb-8">
                                        {pillar.features.map((feat, i) => (
                                            <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                                                <div className={`w-5 h-5 rounded-full ${colors.icon.split(' ')[0]} ${colors.icon.split(' ')[1]} flex items-center justify-center flex-shrink-0`}>
                                                    <CheckCircle className="w-3 h-3" />
                                                </div>
                                                {feat}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link href={route('register')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 group">
                                        Experimentar
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Reveal>

                                {/* Mockup visual do pilar */}
                                <Reveal delay={150} className={isReverse ? 'lg:col-start-1 lg:row-start-1' : ''}>
                                    <div className="relative">
                                        {/* Glow */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${colors.glow} blur-3xl rounded-3xl`} />

                                        <div className="relative bg-white rounded-3xl shadow-2xl shadow-slate-300/40 border border-slate-200/60 overflow-hidden">
                                            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-100 bg-slate-50/80">
                                                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                                                <div className="ml-3 text-[10px] font-medium text-slate-400">
                                                    biblioescola.app/{pillar.tag.toLowerCase().replace(' ', '-')}
                                                </div>
                                            </div>

                                            {/* Conteúdo específico de cada pilar */}
                                            {idx === 0 && (
                                                /* Catálogo mockup */
                                                <div className="p-5 space-y-4">
                                                    <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-100 rounded-xl">
                                                        <Search className="w-3.5 h-3.5 text-slate-400" />
                                                        <span className="text-[11px] text-slate-400">Buscar livro...</span>
                                                    </div>
                                                    <div className="grid grid-cols-4 gap-2.5">
                                                        {['from-blue-400 to-blue-600', 'from-amber-400 to-orange-500', 'from-slate-500 to-slate-700', 'from-rose-400 to-rose-600', 'from-emerald-400 to-emerald-600', 'from-violet-400 to-violet-600', 'from-cyan-400 to-cyan-600', 'from-red-400 to-red-600'].map((c, i) => (
                                                            <div key={i}>
                                                                <div className={`aspect-[3/4] rounded-lg bg-gradient-to-b ${c} flex items-center justify-center mb-1 relative`}>
                                                                    <BookOpen className="w-3.5 h-3.5 text-white/60" />
                                                                    <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full border border-white ${i % 3 === 0 ? 'bg-red-400' : 'bg-emerald-400'}`} />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {['Todos', 'Romance', 'Aventura', 'Clássicos'].map((cat, i) => (
                                                            <span key={i} className={`text-[9px] px-2.5 py-1 rounded-full ${i === 0 ? 'bg-emerald-100 text-emerald-700 font-medium' : 'bg-slate-100 text-slate-500'}`}>{cat}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {idx === 1 && (
                                                /* Rede social mockup */
                                                <div className="p-4 space-y-3">
                                                    {/* Post 1 */}
                                                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-[9px] font-bold">LF</div>
                                                            <div>
                                                                <div className="text-[10px] font-bold text-slate-800">Lucas Ferreira</div>
                                                                <div className="text-[8px] text-slate-400">Postou uma resenha • 5min</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2 mb-2">
                                                            <div className="w-10 h-14 rounded-md bg-gradient-to-b from-slate-500 to-slate-700 flex items-center justify-center">
                                                                <BookOpen className="w-3 h-3 text-white/60" />
                                                            </div>
                                                            <p className="text-[10px] text-slate-600 leading-relaxed flex-1">
                                                                "1984 é perturbadoramente atual. A linguagem simples mas profunda do Orwell me prendeu do início ao fim. Leitura obrigatória!"
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                                                            <div className="flex items-center gap-1 text-[9px] text-rose-500 font-medium">
                                                                <Heart className="w-3 h-3 fill-rose-400 text-rose-400" /> 32
                                                            </div>
                                                            <div className="flex items-center gap-1 text-[9px] text-slate-400">
                                                                <MessageCircle className="w-3 h-3" /> 12
                                                            </div>
                                                            <div className="flex items-center gap-1 text-[9px] text-slate-400 ml-auto">
                                                                <Share2 className="w-3 h-3" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Post 2 (preview) */}
                                                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-[9px] font-bold">PC</div>
                                                            <div>
                                                                <div className="text-[10px] font-bold text-slate-800">Profª Carla</div>
                                                                <div className="text-[8px] text-slate-400">Recomendação • 1h</div>
                                                            </div>
                                                        </div>
                                                        <p className="text-[10px] text-slate-600 leading-relaxed">
                                                            "Para quem gostou de O Pequeno Príncipe, recomendo também Cartas a um Jovem Poeta..."
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {idx === 2 && (
                                                /* Chat mockup */
                                                <div className="p-4 space-y-2">
                                                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                                        <div className="flex items-center gap-2">
                                                            <div className="relative">
                                                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-[9px] font-bold">GR</div>
                                                                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
                                                            </div>
                                                            <div>
                                                                <div className="text-[10px] font-bold text-slate-800">Grupo — Literatura</div>
                                                                <div className="text-[8px] text-emerald-500 font-medium">5 online agora</div>
                                                            </div>
                                                        </div>
                                                        <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                                                    </div>

                                                    <div className="space-y-2 py-1">
                                                        <div className="flex justify-start">
                                                            <div className="bg-slate-100 rounded-lg rounded-tl-sm px-2.5 py-1.5 text-[10px] text-slate-700 max-w-[75%]">
                                                                Gente, a biblioteca recebeu livros novos! 🎉
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-end">
                                                            <div className="bg-violet-500 text-white rounded-lg rounded-tr-sm px-2.5 py-1.5 text-[10px] max-w-[75%]">
                                                                Sério?? Vou dar uma olhada no catálogo!
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-start">
                                                            <div className="bg-slate-100 rounded-lg rounded-tl-sm px-2.5 py-1.5 text-[10px] text-slate-700 max-w-[75%]">
                                                                Tem "A Revolução dos Bichos" 🐷
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-end">
                                                            <div className="bg-violet-500 text-white rounded-lg rounded-tr-sm px-2.5 py-1.5 text-[10px] max-w-[75%]">
                                                                Já reservei! Obrigada 😄
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
                                                        <div className="flex-1 px-3 py-1.5 bg-slate-100 rounded-lg">
                                                            <span className="text-[10px] text-slate-400">Digite uma mensagem...</span>
                                                        </div>
                                                        <div className="w-7 h-7 rounded-lg bg-violet-500 flex items-center justify-center">
                                                            <Send className="w-3 h-3 text-white" />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Reveal>
                            </div>
                        </div>
                    </section>
                );
            })}

            {/* ═══════════════════════════════════════
                COMO FUNCIONA
            ═══════════════════════════════════════ */}
            <section id="como-funciona" className="py-20 px-6 relative z-10 bg-white/50">
                <div className="max-w-5xl mx-auto">
                    <Reveal>
                        <div className="text-center mb-14">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium mb-4">
                                <TrendingUp className="w-3.5 h-3.5" /> Passo a Passo
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">Comece em 3 passos</h2>
                            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
                                Da busca ao bate-papo — tudo integrado para a experiência literária ser completa.
                            </p>
                        </div>
                    </Reveal>

                    <div className="grid md:grid-cols-3 gap-6 relative">
                        <div className="hidden md:block absolute top-8 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-emerald-200 via-blue-200 to-violet-200" />

                        {steps.map((step, i) => (
                            <Reveal key={i} delay={i * 120}>
                                <div className="relative text-center">
                                    <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border-2 border-emerald-100 shadow-lg shadow-emerald-100/50 mb-5 z-10">
                                        <span className="text-lg font-extrabold bg-gradient-to-br from-emerald-500 to-blue-600 bg-clip-text text-transparent">{step.num}</span>
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
            <section className="py-20 px-6 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <Reveal>
                        <div className="text-center mb-14">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-medium mb-4">
                                <Star className="w-3.5 h-3.5 fill-amber-400" /> Depoimentos
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">Quem usa, aprova</h2>
                            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
                                Alunos e professores que já fazem parte da comunidade literária.
                            </p>
                        </div>
                    </Reveal>

                    <div className="grid md:grid-cols-3 gap-5">
                        {testimonials.map((t, i) => (
                            <Reveal key={i} delay={i * 100}>
                                <div className="bg-white rounded-2xl p-6 border border-slate-200/70 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 h-full flex flex-col">
                                    <Quote className="w-7 h-7 text-emerald-100 mb-3" />
                                    <p className="text-sm text-slate-600 leading-relaxed mb-5 flex-1">"{t.text}"</p>
                                    <div className="flex items-center gap-1 mb-4">
                                        {Array.from({ length: t.rating }).map((_, j) => (
                                            <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
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
            <section id="faq" className="py-20 px-6 relative z-10 bg-white/50">
                <div className="max-w-2xl mx-auto">
                    <Reveal>
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-600 text-xs font-medium mb-4">
                                <CheckCircle className="w-3.5 h-3.5" /> Dúvidas
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
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-blue-600 to-violet-700 p-10 sm:p-14 text-center shadow-2xl shadow-blue-500/30">
                            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
                            <div className="absolute -bottom-10 -left-10 w-52 h-52 rounded-full bg-emerald-300/10 blur-3xl" />

                            <div className="relative z-10">
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md mb-6">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
                                    Pronto para descobrir sua próxima leitura?
                                </h2>
                                <p className="text-blue-100 max-w-lg mx-auto mb-8 text-sm leading-relaxed">
                                    Junte-se à comunidade literária da sua escola. Catálogo, rede social e chat — tudo gratuito para alunos.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                    <Link href={route('register')} className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm hover:-translate-y-0.5">
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
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-blue-600 flex items-center justify-center text-white">
                                    <BookOpen className="w-4.5 h-4.5" />
                                </div>
                                <span className="text-sm font-bold text-white">BiblioEscola</span>
                            </div>
                            <p className="text-xs leading-relaxed text-slate-500">
                                A plataforma literária que conecta alunos aos livros da biblioteca escolar. Catálogo, rede social e chat em um só lugar.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-white mb-4 uppercase tracking-wider">Plataforma</h4>
                            <ul className="space-y-2.5">
                                <li><a href="#catalogo" className="text-xs hover:text-white transition-colors">Catálogo</a></li>
                                <li><a href="#rede-social" className="text-xs hover:text-white transition-colors">Rede Social</a></li>
                                <li><a href="#chat" className="text-xs hover:text-white transition-colors">Chat</a></li>
                                <li><a href="#como-funciona" className="text-xs hover:text-white transition-colors">Como Funciona</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-white mb-4 uppercase tracking-wider">Conta</h4>
                            <ul className="space-y-2.5">
                                <li><Link href={route('login')} className="text-xs hover:text-white transition-colors">Entrar</Link></li>
                                <li><Link href={route('register')} className="text-xs hover:text-white transition-colors">Criar Conta</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-white mb-4 uppercase tracking-wider">Sobre</h4>
                            <ul className="space-y-2.5">
                                <li><a href="#faq" className="text-xs hover:text-white transition-colors">FAQ</a></li>
                                <li><a href="#depoimentos" className="text-xs hover:text-white transition-colors">Depoimentos</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-slate-500">
                            &copy; {new Date().getFullYear()} BiblioEscola — Projeto TCC. Todos os direitos reservados.
                        </p>
                        <div className="flex items-center gap-4 text-[10px] text-slate-500">
                            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> LGPD</span>
                            <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Tempo Real</span>
                            <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Acesso Escolar</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}