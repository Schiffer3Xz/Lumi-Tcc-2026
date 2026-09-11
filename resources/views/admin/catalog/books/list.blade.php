<x-admin.layout title="Catálogo de Livros - Painel Administrativo">
<!-- Cabeçalho da Página com Ações -->
        <header class="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 pb-6 border-b border-slate-200/80">
            <div class="space-y-1">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold tracking-wide uppercase mb-2">
                    <i class="fa-solid fa-layer-group text-[10px]"></i> Gestão de Acervo
                </div>
                <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Catálogo de Livros</h1>
                <p class="text-sm sm:text-base text-slate-500 max-w-xl">Gerencie, edite e visualize todos os títulos cadastrados de forma centralizada e intuitiva.</p>
            </div>

            <!-- Ações do Topo -->
            <div class="flex flex-wrap items-center gap-3">
                <a href="{{ route('admin.books.create') }}" class="group inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-3 rounded-2xl shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-sm">
                    <span class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs group-hover:rotate-90 transition-transform duration-300">
                        <i class="fa-solid fa-plus text-[10px]"></i>
                    </span>
                    Cadastrar Novo Livro
                </a>
                <a href="{{ route('admin.dashboard') }}" class="inline-flex items-center gap-2.5 bg-white hover:bg-slate-50 text-slate-700 font-medium px-5 py-3 rounded-2xl shadow-sm hover:shadow border border-slate-200/80 hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-sm">
                    <i class="fa-solid fa-gauge-high text-slate-400 group-hover:text-blue-600 transition-colors"></i>
                    <span>Voltar ao Painel</span>
                </a>
            </div>
        </header>

        <!-- Grid do Catálogo -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">

            @forelse($books as $book)
                <a href="{{ route('admin.books.edit', $book->id) }}"
                   class="group relative bg-white/80 backdrop-blur-sm p-4 rounded-3xl shadow-sm border border-slate-200/70 hover:shadow-lg hover:border-blue-400/50 hover:bg-white hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">

                    <div>
                        <!-- Capa do Livro -->
                        <div class="aspect-[2/3] bg-slate-100 rounded-2xl mb-4 overflow-hidden shadow-md relative group-hover:shadow-lg transition-shadow">
                            @if($book->cover_url)
                                <img src="{{ asset('storage/' . $book->cover_url) }}"
                                     alt="{{ $book->title }}"
                                     class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out">
                            @else
                                <div class="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-gradient-to-br from-slate-100 to-slate-200/60">
                                    <div class="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-500 mb-2 group-hover:scale-110 transition-transform">
                                        <i class="fa-solid fa-book-open text-lg"></i>
                                    </div>
                                    <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Sem Capa</span>
                                </div>
                            @endif

                            <!-- Overlay de Edição Rápida ao passar o mouse -->
                            <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                <span class="bg-white/90 text-slate-900 font-semibold text-xs px-3.5 py-2 rounded-xl shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1.5">
                                    <i class="fa-solid fa-pen text-[10px] text-blue-600"></i> Editar
                                </span>
                            </div>
                        </div>

                        <!-- Informações do Livro -->
                        <div class="px-0.5 space-y-1">
                            <h3 class="font-bold text-slate-900 text-sm sm:text-base line-clamp-1 group-hover:text-blue-600 transition-colors" title="{{ $book->title }}">
                                {{ $book->title }}
                            </h3>
                            <p class="text-xs text-slate-500 font-medium line-clamp-1">
                                {{ $book->author->name ?? 'Autor desconhecido' }}
                            </p>
                        </div>
                    </div>

                    <!-- Status de Disponibilidade -->
                    <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        @php
                            $statusName = $book->availability->availability ?? 'Desconhecido';
                            $classes = match ($statusName) {
                                'Disponível' => [
                                    'badge' => 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
                                    'dot' => 'bg-emerald-500 shadow-sm shadow-emerald-500',
                                ],
                                'Indisponível' => [
                                    'badge' => 'bg-rose-50 text-rose-700 border border-rose-200/60',
                                    'dot' => 'bg-rose-500 shadow-sm shadow-rose-500',
                                ],
                                default => [
                                    'badge' => 'bg-slate-100 text-slate-700 border border-slate-200/60',
                                    'dot' => 'bg-slate-400',
                                ],
                            };
                        @endphp

                        <span class="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider {{ $classes['badge'] }}">
                            <span class="w-1.5 h-1.5 rounded-full {{ $classes['dot'] }}"></span>
                            {{ $statusName }}
                        </span>

                        <span class="w-7 h-7 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                            <i class="fa-solid fa-chevron-right text-[10px]"></i>
                        </span>
                    </div>
                </a>
            @empty
                <div class="col-span-full py-28 px-6 bg-white/80 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300 text-center shadow-sm">
                    <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mx-auto mb-4 shadow-inner">
                        <i class="fa-solid fa-book-bookmark text-2xl"></i>
                    </div>
                    <h3 class="text-lg font-bold text-slate-800">Nenhum livro cadastrado</h3>
                    <p class="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">Seu acervo está vazio no momento. Comece adicionando o primeiro título para gerenciá-lo por aqui.</p>
                    <a href="{{ route('admin.books.create') }}" class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition-all text-sm">
                        <i class="fa-solid fa-plus text-xs"></i> Cadastrar Livro Agora
                    </a>
                </div>
            @endforelse

        </div>

</x-admin.layout>
