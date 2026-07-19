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
        <!-- Sidebar rústica em tons de marrom e madeira -->
        <aside class="w-72 bg-[#2d221b] text-[#d6c7b9] flex flex-col border-r border-[#3e3027] shadow-xl z-20">
            <!-- Logo / Header -->
            <div class="flex items-center gap-3.5 px-6 h-20 border-b border-[#3e3027] bg-[#241b14]">
                <div class="w-10 h-10 rounded-lg bg-[#6b4c35] flex items-center justify-center font-extrabold text-[#fbf9f6] shadow-md border border-[#856147]">A</div>
                <div>
                    <h1 class="font-bold text-[#fbf9f6] tracking-tight text-base">Admin Panel</h1>
                    <p class="text-[10px] font-semibold uppercase tracking-wider text-[#b08968]">Painel de Controle</p>
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
                                <a href="{{route('genres.store')}}" class="flex items-center gap-2.5 px-3.5 py-3 text-sm font-medium rounded-md text-[#c4ab99] hover:text-[#fbf9f6] hover:bg-[#382b22] transition-colors">
                                    <span class="w-2 h-2 rounded-full bg-[#b08968]"></span> Cadastrar gênero
                                </a>
                                <a href="{{route('author.store')}}" class="flex items-center gap-2.5 px-3.5 py-3 text-sm font-medium rounded-md text-[#c4ab99] hover:text-[#fbf9f6] hover:bg-[#382b22] transition-colors">
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
                                <a href="{{route('book')}}" class="flex items-center gap-2.5 px-3.5 py-3 text-sm font-medium rounded-md text-[#c4ab99] hover:text-[#fbf9f6] hover:bg-[#382b22] transition-colors">
                                    <span class="w-2 h-2 rounded-full bg-[#b08968]"></span> Cadastrar livro
                                </a>
                                <a href="{{route('books.list')}}" class="flex items-center gap-2.5 px-3.5 py-3 text-sm font-medium rounded-md text-[#c4ab99] hover:text-[#fbf9f6] hover:bg-[#382b22] transition-colors">
                                    <span class="w-2 h-2 rounded-full bg-[#b08968]"></span> Listar Livros
                                </a>
                                <a href="{{route('update.view')}}" class="flex items-center gap-2.5 px-3.5 py-3 text-sm font-medium rounded-md text-[#c4ab99] hover:text-[#fbf9f6] hover:bg-[#382b22] transition-colors">
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
                    <a href="{{ route('settings') }}" class="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#d6c7b9] hover:bg-[#382b22] hover:text-white transition-colors"><i class="fa-solid fa-gear w-4 text-[#a38875]"></i> Configurações</a>
                    <form action="{{ route('logout') }}" method="POST">
                        @csrf
                        <button type="submit" class="w-full flex items-center gap-2.5 text-left px-4 py-2 text-xs font-medium text-[#bc6c25] hover:bg-[#382b22] hover:text-[#dda15e] transition-colors"><i class="fa-solid fa-right-from-bracket w-4"></i> Sair</button>
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
                        <input type="text" placeholder="Pesquisar no sistema..." class="w-full pl-10 pr-4 py-2 bg-[#ebdccb]/60 border border-[#d8c7b5] rounded-lg text-sm text-[#3b2f26] placeholder-[#8c7462] focus:outline-none focus:ring-1 focus:ring-[#b08968] focus:border-[#b08968] transition-all">
                    </div>
                </div>

                <div class="flex items-center gap-6">
                    <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-[#588157] bg-[#e9f5ed] px-3.5 py-1.5 rounded-full border border-[#c8e1cf]">
                        <span class="w-2 h-2 rounded-full bg-[#588157]"></span> Sistema Online
                    </span>
                </div>
            </header>

            <!-- Main Content Container -->
            <main class="flex-1 overflow-y-auto p-10">
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">

                    <div class="bg-[#f4ede2] rounded-xl border border-[#e6dccf] p-4 shadow-xs flex flex-col justify-between">
                        <div class="flex items-center justify-between text-[#8c7462] mb-3">
                            <span class="text-[11px] font-bold uppercase tracking-wider text-[#6b5848]">Livros</span>
                            <div class="w-7 h-7 rounded-md bg-[#e6dccf]/60 flex items-center justify-center text-sm">📚</div>
                        </div>
                        <span class="text-2xl font-black text-[#3b2f26] tracking-tight">{{ $totalBooks }}</span>
                    </div>

                    <div class="bg-[#f4ede2] rounded-xl border border-[#e6dccf] p-4 shadow-xs flex flex-col justify-between">
                        <div class="flex items-center justify-between text-[#8c7462] mb-3">
                            <span class="text-[11px] font-bold uppercase tracking-wider text-[#6b5848]">Autores</span>
                            <div class="w-7 h-7 rounded-md bg-[#e6dccf]/60 flex items-center justify-center text-sm">👤</div>
                        </div>
                        <span class="text-2xl font-black text-[#3b2f26] tracking-tight">{{ $totalAuthors }}</span>
                    </div>

                    <div class="bg-[#f4ede2] rounded-xl border border-[#e6dccf] p-4 shadow-xs flex flex-col justify-between">
                        <div class="flex items-center justify-between text-[#8c7462] mb-3">
                            <span class="text-[11px] font-bold uppercase tracking-wider text-[#6b5848]">Gêneros</span>
                            <div class="w-7 h-7 rounded-md bg-[#e6dccf]/60 flex items-center justify-center text-sm">🏷️</div>
                        </div>
                        <span class="text-2xl font-black text-[#3b2f26] tracking-tight">{{ $totalGenres }}</span>
                    </div>

                    <div class="bg-[#f0f4f1] rounded-xl border border-[#d2e0d5] p-4 shadow-xs flex flex-col justify-between">
                        <div class="flex items-center justify-between text-[#3a5a40] mb-3">
                            <span class="text-[11px] font-bold uppercase tracking-wider text-[#3a5a40]">Disponíveis</span>
                            <div class="w-7 h-7 rounded-md bg-[#d2e0d5]/60 flex items-center justify-center text-sm">✅</div>
                        </div>
                        <span class="text-2xl font-black text-[#2f4f35] tracking-tight">{{ $totalBooksAvailable }}</span>
                    </div>

                    <div class="bg-[#fcf3f2] rounded-xl border border-[#f0d4d2] p-4 shadow-xs flex flex-col justify-between">
                        <div class="flex items-center justify-between text-[#bc6c25] mb-3">
                            <span class="text-[11px] font-bold uppercase tracking-wider text-[#bc6c25]">Indisponíveis</span>
                            <div class="w-7 h-7 rounded-md bg-[#f7d6d3]/60 flex items-center justify-center text-sm">❌</div>
                        </div>
                        <span class="text-2xl font-black text-[#9b5118] tracking-tight">{{ $totalBooksUnavailable }}</span>
                    </div>

                    <div class="bg-[#f0f3f7] rounded-xl border border-[#d3d9e0] p-4 shadow-xs flex flex-col justify-between">
                        <div class="flex items-center justify-between text-[#457b9d] mb-3">
                            <span class="text-[11px] font-bold uppercase tracking-wider text-[#457b9d]">Emprestados</span>
                            <div class="w-7 h-7 rounded-md bg-[#d3d9e0]/60 flex items-center justify-center text-sm">📖</div>
                        </div>
                        <span class="text-2xl font-black text-[#1d3557] tracking-tight">{{ $totalBooksBorrowed }}</span>
                    </div>

                </div>
            </main>
        </div>
    </div>
</body>
</html>