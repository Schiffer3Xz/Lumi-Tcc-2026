import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Sparkles, ArrowRight, BookOpen, MessageSquare, HelpCircle, Plus, Check } from 'lucide-react';

export default function LandingPage() {
  // Estado para dinamizar o card de leituras do usuário
  const [readings, setReadings] = useState([
    { id: 1, title: 'Dom Casmurro', author: 'Machado de Assis', progress: 72, color: 'bg-sky-400' },
    { id: 2, title: 'O Alquimista', author: 'Paulo Coelho', progress: 45, color: 'bg-amber-300' },
    { id: 3, title: 'Vidas Secas', author: 'Graciliano Ramos', progress: 20, color: 'bg-sky-300' },
  ]);

  // Função simples para interagir dinamicamente com o progresso
  const handleIncreaseProgress = (id) => {
    setReadings(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, progress: Math.min(100, item.progress + 10) }
          : item
      )
    );
  };

  return (
    <>
      <Head title="Lumi - Sala de Leitura Digital" />

      <div className="relative min-h-screen bg-[#1b2234] text-white font-sans overflow-hidden flex flex-col justify-between selection:bg-amber-300 selection:text-slate-900">
        
        {/* ==================== VAGALUMES DINÂMICOS (FUNDO) ==================== */}
        <div className="absolute top-12 left-1/4 w-1.5 h-1.5 bg-amber-200/80 rounded-full blur-[1px] animate-pulse duration-1000" />
        <div className="absolute top-1/3 left-10 w-2 h-2 bg-amber-300/60 rounded-full blur-[2px] animate-ping duration-1000" />
        <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-sky-200/70 rounded-full animate-pulse duration-700" />
        <div className="absolute bottom-1/4 left-16 w-2.5 h-2.5 bg-sky-300/40 rounded-full blur-sm animate-pulse duration-1000" />
        <div className="absolute top-20 right-1/3 w-1.5 h-1.5 bg-amber-200/60 rounded-full blur-[1px] animate-pulse duration-700" />
        <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-amber-300/50 rounded-full blur-[1px] animate-ping duration-1000" />

        {/* ==================== NAVBAR ==================== */}
        <header className="relative z-10 flex items-center justify-between px-8 md:px-16 py-6 max-w-7xl mx-auto w-full">
          {/* Logo */}
          <Link href={route('dashboard')} className="flex items-center gap-2 font-black text-2xl tracking-wide group">
            <Sparkles className="w-6 h-6 text-amber-300 fill-amber-300 group-hover:rotate-12 transition-transform duration-300" />
            <span>Lumi</span>
          </Link>

          {/* Links de Navegação */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300 font-semibold">
            <a href="#funcionalidades" className="hover:text-amber-300 transition-colors">Funcionalidades</a>
            <Link href={route('catalogo')} className="hover:text-amber-300 transition-colors">Catálogo</Link>
            <a href="#escolas" className="hover:text-amber-300 transition-colors">Para Escolas</a>
          </nav>

          {/* Botão Entrar */}
          <Link
            href={route('login')}
            className="bg-amber-300 hover:bg-amber-400 text-[#1b2234] font-bold text-sm px-6 py-2.5 rounded-full transition-all duration-200 hover:scale-105 shadow-md shadow-amber-300/10"
          >
            Entrar
          </Link>
        </header>

        {/* ==================== CONTEÚDO PRINCIPAL (HERO) ==================== */}
        <main className="relative z-10 flex-1 flex items-center max-w-7xl mx-auto px-8 md:px-16 py-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
            
            {/* Lado Esquerdo: Textos e CTAs */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Tag Badge */}
              <div className="inline-flex items-center gap-2 bg-slate-800/90 border border-slate-700 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider text-amber-300 uppercase shadow-inner">
                <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Sala de Leitura Digital</span>
              </div>

              {/* Título Principal - Mais Encorpado (font-black) */}
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] text-white">
                Onde a leitura <br />
                <span className="text-amber-300 drop-shadow-[0_0_15px_rgba(252,211,77,0.3)]">brilha</span> como <br />
                vagalume
              </h1>

              {/* Subtítulo */}
              <p className="text-slate-300 text-base sm:text-lg max-w-lg leading-relaxed font-normal">
                Uma plataforma escolar completa para descobrir livros, acompanhar leituras, participar de debates e crescer junto com a comunidade leitora.
              </p>

              {/* Botões de Ação com Links */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href={route('register')}
                  className="bg-amber-300 hover:bg-amber-400 text-[#1b2234] font-extrabold text-sm px-7 py-3.5 rounded-full transition-all duration-200 hover:scale-105 flex items-center gap-2 shadow-xl shadow-amber-300/20 group"
                >
                  <span>Começar agora</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href={route('catalogo')}
                  className="border border-slate-700 hover:border-slate-500 bg-slate-900/30 hover:bg-slate-800/60 text-slate-200 font-bold text-sm px-7 py-3.5 rounded-full transition-all duration-200"
                >
                  Ver catálogo
                </Link>
              </div>
            </div>

            {/* Lado Direito: Card Flutuante de Leitura Interativo */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="w-full max-w-sm bg-[#232c42]/90 border border-slate-700/60 rounded-3xl p-6 shadow-2xl backdrop-blur-md space-y-6 hover:border-slate-600 transition-colors duration-300">
                
                {/* Cabeçalho do Card */}
                <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase">Minhas Leituras</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{readings.length} em andamento</p>
                  </div>
                  <div className="p-2.5 bg-slate-800/90 rounded-xl text-amber-300 shadow-inner">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>

                {/* Lista de Leituras Interativa */}
                <div className="space-y-4">
                  {readings.map((item) => (
                    <div key={item.id} className="space-y-2 group">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full ${item.color} flex-shrink-0 shadow-sm`} />
                          <div>
                            <p className="font-bold text-white group-hover:text-amber-300 transition-colors">{item.title}</p>
                            <p className="text-[11px] text-slate-400">{item.author}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sky-400">{item.progress}%</span>
                          {item.progress < 100 && (
                            <button
                              onClick={() => handleIncreaseProgress(item.id)}
                              title="Avançar leitura"
                              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Barra de Progresso Animada */}
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5">
                        <div 
                          className={`h-full ${item.color} rounded-full transition-all duration-500 ease-out`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Notificação / Atividade Recente */}
                <div className="bg-slate-800/70 border border-slate-700/50 rounded-2xl p-3.5 flex items-start gap-3 text-xs text-slate-300 shadow-sm">
                  <MessageSquare className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                  <p className="leading-snug">
                    <span className="font-semibold text-white">Ana Costa</span> comentou em <span className="italic">“Dom Casmurro”</span>
                  </p>
                </div>

              </div>
            </div>

          </div>
        </main>

        {/* ==================== RODAPÉ E ELEMENTOS FIXOS ==================== */}
        <footer className="relative z-10 pb-6 flex flex-col items-center justify-center text-xs text-slate-500 gap-2">
          <div className="w-px h-6 bg-slate-700/80 animate-bounce" />
          <span className="tracking-widest font-bold text-[10px] text-slate-400">SCROLL</span>
        </footer>

        {/* Botão de Suporte Flutuante */}
        <button 
          title="Ajuda e Suporte"
          className="fixed bottom-5 right-5 z-20 w-10 h-10 rounded-full bg-slate-800/90 border border-slate-700 text-slate-300 flex items-center justify-center hover:bg-amber-300 hover:text-slate-900 transition-all duration-200 shadow-lg hover:scale-110"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

      </div>
    </>
  );
}