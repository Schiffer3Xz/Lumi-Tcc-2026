<!DOCTYPE html>
<html lang="pt-BR" class="h-full bg-slate-50">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sala de Leitura</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- FontAwesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="h-full font-sans antialiased text-slate-800 flex overflow-hidden">

    <!-- Sidebar -->
    <aside class="w-20 bg-[#1e2530] flex flex-col items-center py-6 justify-between shrink-0 select-none">
        <div class="flex flex-col items-center gap-8">
            <!-- Logo / Brand Icon -->
            <div class="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center text-slate-900 text-xl shadow-lg cursor-pointer hover:bg-amber-300 transition">
                <i class="fa-solid fa-book-skull"></i>
            </div>
            
            <!-- Nav Links -->
            <nav class="flex flex-col gap-4">
                <a href="#" class="w-12 h-12 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center text-lg shadow-md transition" title="Início">
                    <i class="fa-solid fa-house"></i>
                </a>
                <a href="#" class="w-12 h-12 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center text-lg transition" title="Acervo">
                    <i class="fa-solid fa-book-open"></i>
                </a>
                <a href="#" class="w-12 h-12 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center text-lg transition" title="Usuários">
                    <i class="fa-solid fa-users"></i>
                </a>
            </nav>
        </div>

        <!-- Bottom Settings & Logout -->
        <div class="flex flex-col gap-3">
            <a href="#" class="w-12 h-12 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center text-lg transition" title="Configurações">
                <i class="fa-solid fa-gear"></i>
            </a>
            <!-- Logout Button (Sidebar Bottom) -->
            <form method="POST" action="{{ route('logout') }}">
                @csrf
                <button type="submit" class="w-12 h-12 rounded-xl text-rose-400 hover:text-white hover:bg-rose-600/20 flex items-center justify-center text-lg transition" title="Sair">
                    <i class="fa-solid fa-right-from-bracket"></i>
                </button>
            </form>
        </div>
    </aside>

    <!-- Main Content Wrapper -->
    <div class="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        <!-- Top Navbar -->
        <header class="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between shrink-0">
            <!-- Title Area -->
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
                    <i class="fa-solid fa-book-bookmark"></i>
                </div>
                <div>
                    <h1 class="text-lg font-bold text-slate-900 leading-tight">Sala de Leitura</h1>
                    <span class="text-xs text-slate-400 font-medium">Plataforma Escolar Web</span>
                </div>
            </div>

            <!-- Right Actions / User Profile -->
            <div class="flex items-center gap-4">
                <div class="hidden md:flex items-center gap-2 bg-emerald-50 border border-emerald-200/60 px-3 py-1.5 rounded-full text-emerald-700 text-xs font-medium">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Estado: Usuário Logado (Dropdown visível)
                </div>

                <!-- Notifications -->
                <div class="relative">
                    <button class="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition relative">
                        <i class="fa-regular fa-bell"></i>
                        <span class="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">3</span>
                    </button>
                </div>

                <!-- User Dropdown / Header Logout Option -->
                <div class="flex items-center gap-3 pl-2 border-l border-slate-200">
                    <div class="w-9 h-9 rounded-full bg-amber-200 text-amber-800 font-bold flex items-center justify-center text-sm shadow-inner">
                        a
                    </div>
                    <span class="text-sm font-semibold text-slate-700">{{auth()->user()->name}}</span>
                    
                    <!-- Top Bar Logout Button Form -->
                    <form method="POST" action="{{ route('logout') }}" class="inline">
                        @csrf
                        <button type="submit" class="ml-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold transition flex items-center gap-1.5 shadow-xs" title="Encerrar Sessão">
                            <i class="fa-solid fa-right-from-bracket text-[10px]"></i>
                            <span class="hidden sm:inline">Sair</span>
                        </button>
                    </form>
                </div>
            </div>
        </header>

        <!-- Scrollable Dashboard Area -->
        <main class="flex-1 p-8 max-w-7xl w-full mx-auto flex flex-col gap-8">
            
            <!-- Hero Greeting & Search Header -->
            <div class="flex flex-col gap-6">
                <div>
                    <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">Sala de Leitura</h2>
                    <p class="text-sm text-slate-500 mt-0.5">Olá, {{auth()->user()->name}}! — <span class="font-medium text-slate-700">3 livros aguardam você</span></p>
                </div>

                <!-- Search and Filters Bar -->
                <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    <!-- Search Input -->
                    <div class="relative flex-1 max-w-xl">
                        <span class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                            <i class="fa-solid fa-magnifying-glass text-sm"></i>
                        </span>
                        <input type="text" placeholder="Pesquise por livros, autores, gêneros..." class="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm text-slate-700 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition">
                    </div>
                    
                    <!-- Search Button -->
                    <button type="button" class="bg-amber-300 hover:bg-amber-400 text-slate-900 font-semibold px-6 py-3 rounded-2xl shadow-sm hover:shadow transition flex items-center justify-center gap-2 text-sm">
                        Buscar
                    </button>
                </div>

                <!-- Filter Pills -->
                <div class="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                    <button class="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-medium shadow-sm transition shrink-0">
                        <i class="fa-solid fa-sparkles text-amber-400"></i> Todos
                    </button>
                    <button class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-600 text-xs font-medium transition shrink-0 shadow-xs">
                        <span>📘</span> Ficção
                    </button>
                    <button class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-600 text-xs font-medium transition shrink-0 shadow-xs">
                        <span>💖</span> Romance
                    </button>
                    <button class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-600 text-xs font-medium transition shrink-0 shadow-xs">
                        <span>🏰</span> Fantasia
                    </button>
                    <button class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-600 text-xs font-medium transition shrink-0 shadow-xs">
                        <span>⛩️</span> Mangá
                    </button>
                    <button class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-600 text-xs font-medium transition shrink-0 shadow-xs">
                        <span>📜</span> História
                    </button>
                </div>
            </div>

            <!-- Content Grid Section -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <!-- Left 2 Columns: Reading Progress & Popular Books (Laravel Forelse) -->
                <div class="lg:col-span-2 flex flex-col gap-6">
                    
                    <!-- Section Title Row -->
                    <div class="flex items-center justify-between">
                        <h3 class="text-base font-bold text-slate-900">Populares</h3>
                        <div class="flex items-center gap-2">
                            <button class="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition shadow-xs">Ver todos</button>
                            <div class="flex items-center gap-1 ml-2">
                                <button class="w-7 h-7 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-600 flex items-center justify-center transition shadow-xs">
                                    <i class="fa-solid fa-chevron-left text-[10px]"></i>
                                </button>
                                <button class="w-7 h-7 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-800 flex items-center justify-center transition shadow-xs">
                                    <i class="fa-solid fa-chevron-right text-[10px]"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Reading Progress Card -->
                    <div class="bg-gradient-to-r from-sky-400 to-sky-500 rounded-3xl p-6 text-white shadow-lg shadow-sky-500/10 flex flex-col gap-6 relative overflow-hidden">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div class="flex items-center gap-4">
                                <!-- Book Thumbnail Placeholder -->
                                <div class="w-14 h-16 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-inner shrink-0 p-2">
                                    <div class="w-full h-full bg-white/40 rounded flex flex-col justify-between p-1">
                                        <div class="w-3 h-0.5 bg-white/80 rounded"></div>
                                        <div class="w-2 h-0.5 bg-white/80 rounded"></div>
                                    </div>
                                </div>
                                <div>
                                    <span class="text-[10px] font-bold uppercase tracking-wider text-white/80">Progresso Atual</span>
                                    <h4 class="text-lg font-bold text-white leading-tight">Seu Progresso de Leitura</h4>
                                    <p class="text-xs text-white/80 mt-0.5">Sem leitura ativa</p>
                                </div>
                            </div>

                            <!-- Add Progress Button -->
                            <button class="bg-white/20 hover:bg-white/30 border border-white/30 text-white text-xs font-semibold px-4 py-2.5 rounded-xl backdrop-blur-sm transition flex items-center justify-center gap-2 self-start sm:self-center shadow-xs">
                                <i class="fa-solid fa-plus text-[10px]"></i> Adicionar Progresso
                            </button>
                        </div>

                        <!-- Progress Bar Track -->
                        <div class="flex flex-col gap-1.5">
                            <div class="w-full bg-black/10 h-2 rounded-full overflow-hidden">
                                <div class="bg-white h-full rounded-full w-[0%]"></div>
                            </div>
                            <div class="flex justify-end">
                                <span class="text-xs font-bold text-white">0%</span>
                            </div>
                        </div>
                    </div>

                    <!-- Laravel Forelse Implementation for Books -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        @forelse($books as $book)
                            <!-- Single Book Card -->
                            <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition flex gap-4 items-center">
                                <div class="w-16 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center border border-slate-200">
                                    @if(isset($book->cover_image))
                                        <img src="{{ asset('storage/' . $book->cover_image) }}" alt="{{ $book->title }}" class="w-full h-full object-cover">
                                    @else
                                        <i class="fa-solid fa-book text-slate-300 text-xl"></i>
                                    @endif
                                </div>
                                <div class="flex flex-col gap-1 min-w-0 flex-1">
                                    <span class="text-[10px] font-bold text-amber-600 uppercase tracking-wide">{{ $book->genre ?? 'Geral' }}</span>
                                    <h5 class="text-sm font-bold text-slate-900 truncate">{{ $book->title }}</h5>
                                    <p class="text-xs text-slate-400 truncate">{{ $book->author }}</p>
                                    <a href="#" class="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition inline-flex items-center gap-1">
                                        Ler agora <i class="fa-solid fa-arrow-right text-[10px]"></i>
                                    </a>
                                </div>
                            </div>
                        @empty
                            <!-- Empty State inside Forelse -->
                            <div class="col-span-full bg-white border border-dashed border-slate-200 rounded-3xl p-8 text-center flex flex-col items-center justify-center gap-3">
                                <div class="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
                                    <i class="fa-solid fa-books"></i>
                                </div>
                                <div class="space-y-1">
                                    <h5 class="text-sm font-bold text-slate-800">Nenhum livro encontrado</h5>
                                    <p class="text-xs text-slate-400">Não há livros cadastrados no momento.</p>
                                </div>
                            </div>
                        @endforelse
                    </div>

                </div>

                <!-- Right Column: Quick Access Menu -->
                <div class="flex flex-col gap-6">
                    <h3 class="text-base font-bold text-slate-900">Acesso Rápido</h3>
                    
                    <div class="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm flex flex-col gap-3">
                        <!-- Quick Link 1 -->
                        <a href="#" class="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100 group">
                            <div class="flex items-center gap-3.5">
                                <div class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 group-hover:bg-amber-50 group-hover:text-amber-600 group-hover:border-amber-100 flex items-center justify-center transition">
                                    <i class="fa-solid fa-clock-rotate-left text-sm"></i>
                                </div>
                                <span class="text-sm font-semibold text-slate-700 group-hover:text-slate-900">Consultar Histórico</span>
                            </div>
                            <i class="fa-solid fa-chevron-right text-xs text-slate-300 group-hover:text-slate-500 transition"></i>
                        </a>

                        <!-- Quick Link 2 -->
                        <a href="#" class="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100 group">
                            <div class="flex items-center gap-3.5">
                                <div class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 group-hover:bg-amber-50 group-hover:text-amber-600 group-hover:border-amber-100 flex items-center justify-center transition">
                                    <i class="fa-solid fa-book-open-reader text-sm"></i>
                                </div>
                                <span class="text-sm font-semibold text-slate-700 group-hover:text-slate-900">Regras da Sala de Leitura</span>
                            </div>
                            <i class="fa-solid fa-chevron-right text-xs text-slate-300 group-hover:text-slate-500 transition"></i>
                        </a>

                        <!-- Quick Link 3 -->
                        <a href="#" class="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100 group">
                            <div class="flex items-center gap-3.5">
                                <div class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 group-hover:bg-amber-50 group-hover:text-amber-600 group-hover:border-amber-100 flex items-center justify-center transition">
                                    <i class="fa-solid fa-shield-halved text-sm"></i>
                                </div>
                                <span class="text-sm font-semibold text-slate-700 group-hover:text-slate-900">Configurações de Privacidade</span>
                            </div>
                            <i class="fa-solid fa-chevron-right text-xs text-slate-300 group-hover:text-slate-500 transition"></i>
                        </a>
                    </div>
                </div>

            </div>

        </main>
    </div>

</body>
</html>