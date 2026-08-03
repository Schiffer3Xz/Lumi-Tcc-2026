<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Admin - @yield('title', 'Dashboard')</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="h-full bg-[#fbf9f6] font-sans text-[#4a3f35] antialiased">

   <div class="flex h-screen overflow-hidden">
        <!-- Sidebar em tons de azul escuro -->
        <aside class="w-72 bg-[#1b2436] text-[#c3d0e0] flex flex-col border-r border-[#2e3b52] shadow-xl z-20">
            <!-- Logo / Header -->
            <div class="flex items-center gap-3.5 px-6 h-20 border-b border-[#2e3b52] bg-[#131a29]">
                <div class="w-10 h-10 rounded-lg bg-[#2f4d73] flex items-center justify-center font-extrabold text-[#f6f9fc] shadow-md border border-[#3f6690]">A</div>
                <div>
                    <h1 class="font-bold text-[#f6f9fc] tracking-tight text-base">Administrador</h1>
                    <p class="text-[10px] font-semibold uppercase tracking-wider text-[#7fa8cc]">Painel de Controle</p>
                </div>
            </div>

            <!-- Navegação com Dropdowns (Alpine.js) -->
            <nav class="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
                <div>
                    <div class="px-3 mb-3 text-[10px] font-bold text-[#8c7462] uppercase tracking-widest">Menu Principal</div>
                    <div class="space-y-2">
                        
                        <!-- Dropdown: Gestão de Categorias -->
                        <div x-data="{ open: false }" class="space-y-1">
                            <button @click="open = !open" class="w-full flex items-center justify-between px-3.5 py-3 text-sm font-medium rounded-lg text-[#d6c7b9] hover:bg-[#382b22] hover:text-[#fbf9f6] transition-all group border border-transparent">
                                <div class="flex items-center gap-3">
                                    <div class="w-7 h-7 rounded-md bg-[#241b14] border border-[#3e3027] flex items-center justify-center text-[#a38875] group-hover:text-[#d4a373] transition-colors">
                                        <i class="fa-solid fa-folder-tree text-[11px]"></i>
                                    </div>
                                    <span>Gestão de Categorias</span>
                                </div>
                                <i class="fa-solid fa-chevron-down text-[10px] text-[#8c7462] transition-transform duration-200" :class="open ? 'rotate-180 text-[#d4a373]' : ''"></i>
                            </button>
                            <div x-show="open" class="pl-10 pr-2 space-y-1.5 py-1.5">
                                <a href="{{ route('genres.store') }}" class="flex items-center gap-2.5 px-3.5 py-3 text-sm font-medium rounded-md text-[#c4ab99] hover:text-[#fbf9f6] hover:bg-[#382b22] transition-colors">
                                    <span class="w-2 h-2 rounded-full bg-[#b08968]"></span> Cadastrar gênero
                                </a>
                                <a href="{{ route('author.store') }}" class="flex items-center gap-2.5 px-3.5 py-3 text-sm font-medium rounded-md text-[#c4ab99] hover:text-[#fbf9f6] hover:bg-[#382b22] transition-colors">
                                    <span class="w-2 h-2 rounded-full bg-[#b08968]"></span> Cadastrar autor
                                </a>
                            </div>
                        </div>

                        <!-- Dropdown: Acervo -->
                        <div x-data="{ open: false }" class="space-y-1">
                            <button @click="open = !open" class="w-full flex items-center justify-between px-3.5 py-3 text-sm font-medium rounded-lg text-[#d6c7b9] hover:bg-[#382b22] hover:text-[#fbf9f6] transition-all group border border-transparent">
                                <div class="flex items-center gap-3">
                                    <div class="w-7 h-7 rounded-md bg-[#241b14] border border-[#3e3027] flex items-center justify-center text-[#a38875] group-hover:text-[#d4a373] transition-colors">
                                        <i class="fa-solid fa-box-archive text-[11px]"></i>
                                    </div>
                                    <span>Acervo</span>
                                </div>
                                <i class="fa-solid fa-chevron-down text-[10px] text-[#8c7462] transition-transform duration-200" :class="open ? 'rotate-180 text-[#d4a373]' : ''"></i>
                            </button>
                            <div x-show="open" class="pl-10 pr-2 space-y-1.5 py-1.5">
                                <a href="{{ route('book') }}" class="flex items-center gap-2.5 px-3.5 py-3 text-sm font-medium rounded-md text-[#c4ab99] hover:text-[#fbf9f6] hover:bg-[#382b22] transition-colors">
                                    <span class="w-2 h-2 rounded-full bg-[#b08968]"></span> Cadastrar livro
                                </a>
                                <a href="{{ route('books.list') }}" class="flex items-center gap-2.5 px-3.5 py-3 text-sm font-medium rounded-md text-[#c4ab99] hover:text-[#fbf9f6] hover:bg-[#382b22] transition-colors">
                                    <span class="w-2 h-2 rounded-full bg-[#b08968]"></span> Listar Livros
                                </a>
                                <a href="{{ route('update.view') }}" class="flex items-center gap-2.5 px-3.5 py-3 text-sm font-medium rounded-md text-[#c4ab99] hover:text-[#fbf9f6] hover:bg-[#382b22] transition-colors">
                                    <span class="w-2 h-2 rounded-full bg-[#b08968]"></span> Atualizar disponibilidade
                                </a>
                            </div>
                        </div>

                        <!-- Segurança -->
                        <a href="#" class="flex items-center gap-3 px-3.5 py-3 text-sm font-medium rounded-lg text-[#d6c7b9] hover:bg-[#382b22] hover:text-[#fbf9f6] transition-all group border border-transparent">
                            <div class="w-7 h-7 rounded-md bg-[#241b14] border border-[#3e3027] flex items-center justify-center text-[#a38875] group-hover:text-[#d4a373] transition-colors">
                                <i class="fa-solid fa-shield-halved text-[11px]"></i>
                            </div>
                            <span>Segurança</span>
                        </a>

                        <!-- Regras da Sala -->
                        <a href="#" class="flex items-center gap-3 px-3.5 py-3 text-sm font-medium rounded-lg text-[#d6c7b9] hover:bg-[#382b22] hover:text-[#fbf9f6] transition-all group border border-transparent">
                            <div class="w-7 h-7 rounded-md bg-[#241b14] border border-[#3e3027] flex items-center justify-center text-[#a38875] group-hover:text-[#d4a373] transition-colors">
                                <i class="fa-solid fa-book-open text-[11px]"></i>
                            </div>
                            <span>Regras da Sala</span>
                        </a>

                    </div>
                </div>
            </nav>

            <!-- User Menu -->
            <div class="p-4 border-t border-[#3e3027] bg-[#241b14]" x-data="{ open: false }">
                <button @click="open = !open" class="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#382b22] transition-colors border border-transparent">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-md bg-[#4a382c] border border-[#5c4535] flex items-center justify-center text-xs text-[#d4a373] font-bold">
                            {{ substr(auth()->user()->nickname ?? 'A', 0, 1) }}
                        </div>
                        <span class="text-sm font-medium text-[#d6c7b9]">{{ auth()->user()->nickname ?? 'Administrador' }}</span>
                    </div>
                    <i class="fa-solid fa-chevron-up text-[10px] text-[#8c7462] transition-transform duration-200" :class="open ? '' : 'rotate-180'"></i>
                </button>

                <div x-show="open" @click.away="open = false" class="mt-2 bg-[#241b14] border border-[#3e3027] rounded-lg shadow-xl py-1 overflow-hidden">
                    <a href="{{ route('settings') }}" class="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#d6c7b9] hover:bg-[#382b22] hover:text-white transition-colors">
                        <i class="fa-solid fa-gear w-4 text-[#a38875]"></i> Configurações
                    </a>
                    <form action="{{ route('logout') }}" method="POST">
                        @csrf
                        <button type="submit" class="w-full flex items-center gap-2.5 text-left px-4 py-2 text-xs font-medium text-[#bc6c25] hover:bg-[#382b22] hover:text-[#dda15e] transition-colors">
                            <i class="fa-solid fa-right-from-bracket w-4"></i> Sair
                        </button>
                    </form>
                </div>
            </div>
        </aside>

        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col overflow-hidden bg-[#fbf9f6]">
            <!-- Header Superior com Barra de Pesquisa -->
            <header class="h-20 bg-[#f4ede2] border-b border-[#e6dccf] flex items-center justify-between px-10 z-10 gap-6">
                <div class="flex items-center gap-6">
                    <h2 class="text-xl font-bold tracking-tight text-[#3b2f26]">@yield('header-title', 'Dashboard')</h2>
                </div>

                <!-- Barra de Pesquisa rústica -->
                <div class="flex-1 max-w-md">
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#8c7462]">
                            <i class="fa-solid fa-magnifying-glass text-xs"></i>
                        </span>
                        <input type="text" name="search" placeholder="Pesquisar no sistema..." class="w-full pl-10 pr-4 py-2 bg-[#ebdccb]/60 border border-[#d8c7b5] rounded-lg text-sm text-[#3b2f26] placeholder-[#8c7462] focus:outline-none focus:ring-1 focus:ring-[#b08968] focus:border-[#b08968] transition-all">
                    </div>
                </div>

                <div class="flex items-center gap-6">
                    <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-[#588157] bg-[#e9f5ed] px-3.5 py-1.5 rounded-full border border-[#c8e1cf]">
                        <span class="w-2 h-2 rounded-full bg-[#588157]"></span> Sistema Online
                    </span>
                </div>
            </header>

            <!-- Main Content Container -->
            <main class="flex-1 overflow-y-auto p-10 space-y-6">
                <!-- Cards Grid -->
                <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                    <!-- Card 1: Livros -->
                    <div class="bg-white rounded-xl border border-slate-200/80 px-3.5 py-3 shadow-2xs hover:border-amber-300 transition flex flex-col justify-between group">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-amber-600 transition">Livros</span>
                            <div class="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs shadow-2xs">📚</div>
                        </div>
                        <span class="text-lg font-black text-slate-900 tracking-tight">{{ $totalBooks }}</span>
                    </div>

                    <!-- Card 2: Autores -->
                    <div class="bg-white rounded-xl border border-slate-200/80 px-3.5 py-3 shadow-2xs hover:border-amber-300 transition flex flex-col justify-between group">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-amber-600 transition">Autores</span>
                            <div class="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs shadow-2xs">👤</div>
                        </div>
                        <span class="text-lg font-black text-slate-900 tracking-tight">{{ $totalAuthors }}</span>
                    </div>

                    <!-- Card 3: Gêneros -->
                    <div class="bg-white rounded-xl border border-slate-200/80 px-3.5 py-3 shadow-2xs hover:border-amber-300 transition flex flex-col justify-between group">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-amber-600 transition">Gêneros</span>
                            <div class="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs shadow-2xs">🏷️</div>
                        </div>
                        <span class="text-lg font-black text-slate-900 tracking-tight">{{ $totalGenres }}</span>
                    </div>

                    <!-- Card 4: Disponíveis -->
                    <div class="bg-white rounded-xl border border-slate-200/80 px-3.5 py-3 shadow-2xs hover:border-emerald-300 transition flex flex-col justify-between group">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-emerald-600 transition">Disponíveis</span>
                            <div class="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs shadow-2xs">✅</div>
                        </div>
                        <span class="text-lg font-black text-slate-900 tracking-tight">{{ $totalBooksAvailable }}</span>
                    </div>

                    <!-- Card 5: Indisponíveis -->
                    <div class="bg-white rounded-xl border border-slate-200/80 px-3.5 py-3 shadow-2xs hover:border-rose-300 transition flex flex-col justify-between group">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-rose-600 transition">Indisponíveis</span>
                            <div class="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs shadow-2xs">❌</div>
                        </div>
                        <span class="text-lg font-black text-slate-900 tracking-tight">{{ $totalBooksUnavailable }}</span>
                    </div>

                    <!-- Card 6: Emprestados -->
                    <div class="bg-white rounded-xl border border-slate-200/80 px-3.5 py-3 shadow-2xs hover:border-sky-300 transition flex flex-col justify-between group">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-sky-600 transition">Emprestados</span>
                            <div class="w-6 h-6 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center text-xs shadow-2xs">📖</div>
                        </div>
                        <span class="text-lg font-black text-slate-900 tracking-tight">{{ $totalBooksBorrowed }}</span>
                    </div>

                    <!-- Card 7: Cadastrados no Mês -->
                    <div class="bg-white rounded-xl border border-slate-200/80 px-3.5 py-3 shadow-2xs hover:border-indigo-300 transition flex flex-col justify-between group col-span-2 sm:col-span-1">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-indigo-600 transition truncate pr-1">Cadastrados (Mês)</span>
                            <div class="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs shadow-2xs shrink-0">✨</div>
                        </div>
                        <span class="text-lg font-black text-slate-900 tracking-tight">{{ $totalBooksPerMonth }}</span>
                    </div>
                </div>

                <!-- Chart Container -->
                <div class="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
                    <h2 class="font-bold text-slate-800 mb-4 text-base">
                        Livros por Gênero
                    </h2>
                    <div class="relative h-80 w-full">
                        <canvas id="booksGenreChart"></canvas>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <!-- Scripts -->
    <script>
        // Dados injetados pelo Laravel
        const booksByGenre = @json($totalBooksByGenre);

        // Inicialização do Gráfico
        document.addEventListener('DOMContentLoaded', function () {
            const ctx = document.getElementById('booksGenreChart').getContext('2d');

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: booksByGenre.map(item => item.name),
                    datasets: [{
                        label: 'Quantidade de livros',
                        data: booksByGenre.map(item => item.books_count),
                        backgroundColor: '#b08968',
                        borderColor: '#856147',
                        borderWidth: 1,
                        borderRadius: 6,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: '#f1f5f9'
                            },
                            ticks: {
                                precision: 0
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        });
    </script>
</body>
</html>