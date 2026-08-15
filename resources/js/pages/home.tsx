import React, { useState, useRef, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";

export default function Home({ books = [], auth }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [generoAtivo, setGeneroAtivo] = useState("Todos");
  const [profileOpen, setProfileOpen] = useState(false);
  
  const profileRef = useRef(null);
  const user = auth?.user || { name: "Usuário", email: "" };

  // Fecha o dropdown ao clicar fora dele
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const GENEROS = [
    { label: "Todos", icon: "fa-solid fa-wand-magic-sparkles" },
    { label: "Ficção", icon: "fa-solid fa-khanda" },
    { label: "Romance", icon: "fa-solid fa-heart" },
    { label: "Fantasia", icon: "fa-solid fa-chess-rook" },
    { label: "Mangá", icon: "fa-solid fa-torii-gate" },
    { label: "História", icon: "fa-solid fa-scroll" },
  ];

  const NAV_ITEMS = [
    { id: "home", label: "Home", icon: "fa-solid fa-house", active: true },
    { id: "biblioteca", label: "Biblioteca", icon: "fa-solid fa-book-open" },
    { id: "usuarios", label: "Usuários", icon: "fa-solid fa-users" },
    { id: "config", label: "Config", icon: "fa-solid fa-gear" },
  ];

  const QUICK_ACCESS = [
    { label: "Consultar Histórico", icon: "fa-solid fa-clock-rotate-left" },
    { label: "Regras da Sala de Leitura", icon: "fa-solid fa-gavel" },
    { label: "Configurações de Privacidade", icon: "fa-solid fa-shield-halved" },
  ];

  // 4 livros melhores avaliados — ordena por rating decrescente
  const topRatedBooks = [...books]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 4);

  return (
    <>
      <Head title="Sala de Leitura" />
      
      {/* Font Awesome CDN */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      />

      <div className="min-h-screen bg-[#F9F9F9] flex">
        {/* ==================== SIDEBAR ESQUERDA ==================== */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
        <aside
          className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-20 flex-shrink-0 bg-[#1A2332] flex flex-col items-center py-6 gap-8 transition-transform duration-300 ease-in-out ${
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Logo */}
          <div className="text-yellow-300">
            <i className="fa-solid fa-feather-pointed text-2xl" />
          </div>
          {/* Navegação */}
          <nav className="flex flex-col gap-3 flex-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`relative flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 ${
                  item.active
                    ? "bg-yellow-300/10 text-yellow-300"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                title={item.label}
              >
                {item.active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-yellow-300" />
                )}
                <i className={`${item.icon} text-lg`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
          {/* Config no rodapé */}
          <button className="p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
            <i className="fa-solid fa-gear text-lg" />
          </button>
        </aside>

        {/* ==================== CONTEÚDO PRINCIPAL ==================== */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
            {/* ==================== HEADER ==================== */}
            <header className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                >
                  <i className="fa-solid fa-bars text-xl" />
                </button>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Sala de Leitura
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">
                    Plataforma Escolar Web
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Status */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                  <i className="fa-solid fa-trophy text-yellow-500 text-xs" />
                  <span className="text-xs font-medium text-gray-700">
                    Estado: Usuário Logado
                  </span>
                  <i className="fa-solid fa-chevron-down text-[10px] text-gray-400" />
                </div>
                
                {/* Notificações */}
                <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
                  <i className="fa-solid fa-bell text-lg" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                </button>
                
                {/* Perfil com Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-100 transition-colors focus:outline-none"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#1A2332] flex items-center justify-center text-yellow-300 text-sm font-bold">
                      <i className="fa-solid fa-user text-xs" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">
                      {user.name}
                    </span>
                    <i className={`fa-solid fa-chevron-down text-[10px] text-gray-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-400">Logado como</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                      </div>
                      
                      <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                      >
                        <i className="fa-solid fa-right-from-bracket text-xs" />
                        Sair da Conta
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* ==================== GRID PRINCIPAL ==================== */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
              {/* ==================== COLUNA PRINCIPAL ==================== */}
              <div className="min-w-0">
                {/* Saudação */}
                <p className="text-sm text-gray-500 mb-3">
                  Olá, <span className="font-semibold text-gray-700">{user.name}</span>! —{" "}
                  {books.length} {books.length === 1 ? "livro aguarda" : "livros aguardam"} você
                </p>
                {/* Barra de busca */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="relative flex-1">
                    <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      type="text"
                      placeholder="Pesquise por livros, autores, gêneros..."
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all"
                    />
                  </div>
                  <button className="px-6 py-3 bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-bold text-sm rounded-xl shadow-sm transition-all hover:shadow-md flex items-center justify-center gap-2 whitespace-nowrap tracking-wide">
                    <i className="fa-solid fa-magnifying-glass text-xs" />
                    BUSCAR
                  </button>
                </div>
                {/* Pills de categoria */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {GENEROS.map((g) => (
                    <button
                      key={g.label}
                      onClick={() => setGeneroAtivo(g.label)}
                      className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${
                        generoAtivo === g.label
                          ? "bg-[#1A2332] text-yellow-300 shadow-md"
                          : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <i className={`${g.icon} text-[10px]`} />
                      {g.label}
                    </button>
                  ))}
                </div>
                {/* ==================== POPULARES + CARD DE PROGRESSO ==================== */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Populares</h3>
                  <a href="#" className="text-sm font-medium text-[#81A9D4] hover:text-[#6B9AC4] transition-colors">
                    Ver todos
                  </a>
                </div>
                {/* Card de Progresso Atual */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#81A9D4] to-[#6B9AC4] p-6 sm:p-8 shadow-lg mb-8">
                  <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
                  <div className="absolute -right-4 -bottom-12 w-24 h-24 rounded-full bg-white/5" />
                  <div className="relative flex justify-between items-center">
                    <div className="flex flex-col gap-2">
                      <span className="inline-block text-xs font-bold tracking-wider text-white/70">
                        PROGRESSO ATUAL
                      </span>
                      <h2 className="text-lg sm:text-xl font-bold text-white">
                        Seu Progresso de Leitura
                      </h2>
                      <p className="text-sm text-white/80">Sem leitura ativa</p>
                      <button className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white font-medium text-sm rounded-lg backdrop-blur-sm transition-all border border-white/20 w-fit">
                        <i className="fa-solid fa-plus text-xs" />
                        Adicionar Progresso
                      </button>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full border-[6px] border-white/30 border-t-white flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">0%</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* ==================== 4 LIVROS MELHORES AVALIADOS ==================== */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Melhores Avaliados</h3>
                  <a href="#" className="text-sm font-medium text-[#81A9D4] hover:text-[#6B9AC4] transition-colors">
                    Ver todos
                  </a>
                </div>
                {topRatedBooks.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                    {topRatedBooks.map((book) => (
                      <div
                        key={book.id}
                        className="relative aspect-[2/3] w-full bg-[#1A2332] rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 group border border-slate-100"
                      >
                        {book.cover_url ? (
                          <img
                            src={book.cover_url}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          /* Placeholder elegante caso o livro não possua capa cadastrada */
                          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-[#1A2332] to-[#253248]">
                            <i className="fa-solid fa-book text-3xl text-yellow-300/40 mb-2" />
                            <span className="text-xs font-semibold text-white/80 line-clamp-3 px-2">
                              {book.title}
                            </span>
                          </div>
                        )}
                        
                        {/* Badge de avaliação sutil sobreposta no canto superior direito */}
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#1A2332]/85 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                          <i className="fa-solid fa-star text-yellow-400 text-[10px]" />
                          <span className="text-xs font-bold text-white">
                            {Number(book.rating || 0).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="col-span-full bg-white border border-dashed border-slate-200 rounded-3xl p-8 text-center flex flex-col items-center justify-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                      <i className="fa-solid fa-books text-lg" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-sm font-bold text-gray-800">
                        Nenhum livro encontrado
                      </h5>
                      <p className="text-xs text-gray-400">
                        Não há livros cadastrados no momento.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {/* ==================== SIDEBAR DIREITA ==================== */}
              <div className="hidden lg:block">
                <div className="sticky top-6">
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                    <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="w-1 h-5 bg-yellow-300 rounded-full" />
                      Acesso Rápido
                    </h3>
                    <div className="flex flex-col gap-2">
                      {QUICK_ACCESS.map((item) => (
                        <button
                          key={item.label}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-left transition-all group"
                        >
                          <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#1A2332]/5 group-hover:bg-yellow-300/10 flex items-center justify-center transition-colors">
                            <i className={`${item.icon} text-sm text-gray-500 group-hover:text-yellow-600 transition-colors`} />
                          </span>
                          <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                            {item.label}
                          </span>
                          <i className="fa-solid fa-chevron-right text-[10px] text-gray-300 ml-auto group-hover:text-gray-400 group-hover:translate-x-1 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}