import { useEffect, useRef, useState } from "react";
import { Head, Link } from "@inertiajs/react";

export default function Home({ books = [], auth }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [generoAtivo, setGeneroAtivo] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);
  const user = auth?.user ?? { name: "Usuário", email: "" };

  // Fecha o dropdown do perfil ao clicar fora
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
    { label: "Terror", icon: "fa-solid fa-torii-gate" },
    { label: "História", icon: "fa-solid fa-scroll" },
  ];

  const NAV_ITEMS = [
    { id: "home", label: "Home", icon: "fa-solid fa-house", href: route("dashboard") },
    { id: "biblioteca", label: "Catálogo", icon: "fa-solid fa-book-open", href: route("catalogo"), active: true },
    { id: "usuarios", label: "Social", icon: "fa-solid fa-users", href: route("list") },
    { id: "config", label: "Config", icon: "fa-solid fa-gear", href: route("profile") },
  ];

  // Helper para extrair o nome do gênero com suporte a objeto ou string
  const getGenreName = (genre) => {
    if (!genre) return "";
    return typeof genre === "object" ? genre.name || "" : genre;
  };

  // Helper para extrair o nome do autor com suporte a objeto ou string
  const getAuthorName = (author) => {
    if (!author) return "";
    return typeof author === "object" ? author.name || "" : author;
  };

  // Filtra os livros recebidos da Controller do Laravel
  const filteredBooks = books.filter((book) => {
    const genreName = getGenreName(book.genre);
    const authorName = getAuthorName(book.author);

    const matchesGenre =
      generoAtivo === "Todos" ||
      genreName.toLowerCase().includes(generoAtivo.toLowerCase());

    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      authorName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesGenre && matchesSearch;
  });

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
              <Link
                key={item.id}
                href={item.href}
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
              </Link>
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
                    Lumi, Seu catálogo está aqui!
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">
                    Etec João Belarmino
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
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
                    <i
                      className={`fa-solid fa-chevron-down text-[10px] text-gray-400 transition-transform duration-200 ${
                        profileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-400">Logado como</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {user.name}
                        </p>
                      </div>

                      <Link
                        href={route("profile.edit")}
                        className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100 transition-colors font-medium rounded-lg"
                      >
                        <i className="fa-solid fa-gear text-xs text-slate-500" />
                        Configurações
                      </Link>

                      <Link
                        href={route("logout")}
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

            {/* ==================== SEÇÃO PRINCIPAL ==================== */}
            <div className="w-full">
              {/* Contagem de livros */}
              <p className="text-sm text-gray-500 mb-3">
                Olá, <span className="font-semibold text-gray-700">{user.name}</span>! —{" "}
                {books.length} {books.length === 1 ? "livro cadastrado" : "livros cadastrados"} no catálogo
              </p>

              {/* Barra de busca */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                  <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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

              {/* Cabeçalho do Catálogo */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Catálogo Completo</h3>
                <span className="text-xs font-semibold text-gray-400">
                  Exibindo {filteredBooks.length} de {books.length}
                </span>
              </div>

              {/* GRID DE TODOS OS LIVROS */}
              {filteredBooks.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
                  {filteredBooks.map((book) => (
                    <div
                      key={book.id}
                      className="relative aspect-[2/3] w-full bg-[#1A2332] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200 group border border-slate-100"
                    >
                      {/* Exibe a imagem tratada pela Controller via asset() */}
                      {book.cover_url ? (
                        <img
                          src={book.cover_url}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-[#1A2332] to-[#253248]">
                          <i className="fa-solid fa-book text-3xl text-yellow-300/40 mb-2" />
                          <span className="text-xs font-semibold text-white/80 line-clamp-3 px-2">
                            {book.title}
                          </span>
                        </div>
                      )}

                      {/* Badge da Avaliação */}
                      {book.rating !== undefined && book.rating !== null && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#1A2332]/85 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                          <i className="fa-solid fa-star text-yellow-400 text-[10px]" />
                          <span className="text-xs font-bold text-white">
                            {Number(book.rating || 0).toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                    <i className="fa-solid fa-book-open text-lg" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-sm font-bold text-gray-800">
                      Nenhum livro encontrado
                    </h5>
                    <p className="text-xs text-gray-400">
                      Não há registros no banco de dados correspondentes aos filtros.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}