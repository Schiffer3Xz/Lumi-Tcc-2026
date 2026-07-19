<!DOCTYPE html>
<html lang="pt-br" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Controle de Disponibilidade - Sistema de Acervo</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                    },
                }
            }
        }
    </script>
</head>
<body class="bg-slate-50 min-h-full text-slate-800 antialiased font-sans">

    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <!-- Cabeçalho Principal -->
        <header class="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
                <div class="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
                    <i class="fa-solid fa-toggle-on"></i> Painel de Atualização Rápida
                </div>
                <h1 class="text-3xl font-black text-slate-900 tracking-tight">Disponibilidade do Acervo</h1>
                <p class="text-slate-500 text-sm mt-1">Altere instantaneamente o status de empréstimo e exibição dos livros cadastrados.</p>
            </div>
            
            <div>
                <a href="{{ route('adminPanel') }}" class="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold px-4 py-2.5 rounded-xl shadow-sm border border-slate-200 transition text-sm">
                    <i class="fa-solid fa-arrow-left text-slate-400"></i>
                    Voltar ao Painel
                </a>
            </div>
        </header>

        <!-- Alertas de Feedback de Sessão -->
        @if(session('success'))
            <div class="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 shadow-sm animate-fade-in">
                <i class="fa-solid fa-circle-check text-emerald-500 text-lg"></i>
                <span class="text-sm font-medium">{{ session('success') }}</span>
            </div>
        @endif

        <!-- Card Container Principal -->
        <div class="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            
            <!-- Cabeçalho da Tabela/Lista -->
            <div class="bg-slate-50/70 px-6 py-4 border-b border-slate-200 grid grid-cols-12 text-xs font-bold uppercase tracking-wider text-slate-500 gap-4 hidden md:grid">
                <div class="col-span-6">Informações do Livro</div>
                <div class="col-span-3 text-center">Status Atual</div>
                <div class="col-span-3 text-right">Ação</div>
            </div>

            <!-- Loop dos Livros -->
            <div class="divide-y divide-slate-100">
                @forelse($books as $book)
                    <div class="p-6 grid grid-cols-12 items-center gap-4 hover:bg-slate-50/50 transition-colors duration-150">
                        
                        <!-- Coluna 1: Dados do Livro (Capa, Título, Autor, Gênero) -->
                        <div class="col-span-12 md:col-span-6 flex items-center gap-4">
                            <!-- Mini Capa -->
                            <div class="w-12 h-16 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 shadow-sm flex items-center justify-center">
                                @if($book->cover_url)
                                    <img src="{{ asset('storage/' . $book->cover_url) }}" alt="{{ $book->title }}" class="w-full h-full object-cover">
                                @else
                                    <i class="fa-solid fa-book text-slate-400 text-sm"></i>
                                @endif
                            </div>
                            <!-- Informações Textuais -->
                            <div class="space-y-0.5">
                                <h2 class="font-semibold text-slate-900 text-base line-clamp-1" title="{{ $book->title }}">
                                    {{ $book->title }}
                                </h2>
                                <p class="text-xs text-slate-500 font-medium">
                                    <span class="text-slate-700 font-semibold">{{ $book->author->name ?? 'Autor Desconhecido' }}</span> 
                                    <span class="mx-1.5 text-slate-300">•</span> 
                                    {{ $book->page_count }} páginas
                                </p>
                            </div>
                        </div>

                        <!-- Coluna 2: Status de Disponibilidade -->
                        <div class="col-span-6 md:col-span-3 flex md:justify-center items-center">
                            @php
                                $isAvailable = $book->fk_availability_id;

                                if($isAvailable == 1){
                                    $status = "Disponível";
                                }
                                if($isAvailable == 2){
                                    $status = "Indisponível";
                                }
                                if($isAvailable == 3){
                                    $status = "Emprestado";
                                }
                            @endphp
                            
                            <span class="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide {{ $isAvailable ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200' }}">
                                <span class="w-2 h-2 rounded-full {{ $isAvailable ? 'bg-emerald-500 shadow-sm shadow-emerald-400' : 'bg-rose-500 shadow-sm shadow-rose-400' }}"></span>
                                {{ $status }}
                            </span>
                        </div>

                        <!-- Coluna 3: Botão de Atualização -->
                        <div class="col-span-6 md:col-span-3 flex justify-end">
                            <form action="#" method="POST" class="w-full sm:w-auto">
                                @csrf
                                @method('PUT')
                                
                                <button type="submit" name="" 
                                        class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-200 shadow-sm active:scale-[0.98]
                                        {{ $isAvailable
                                            ? 'bg-white hover:bg-rose-50 text-rose-600 border-rose-200 hover:border-rose-300'
                                            : ($isAvailable == 3
                                                ? 'bg-gray-500 hover:bg-gray-600 text-white border-transparent'
                                                : 'bg-indigo-600 hover:bg-indigo-700 text-white border-transparent shadow-indigo-200')
                                        }}">
                                    <i class="fa-solid {{ $isAvailable ? 'fa-ban' : 'fa-check' }}"></i>

                                    <span>
                                        {{ $isAvailable ? 'Marcar Indisponível' : 'Marcar Disponível' }}
                                    </span>
                                </button>
                            </form>
                        </div>

                    </div>
                @empty
                    <!-- Estado Vazio -->
                    <div class="py-20 text-center px-4">
                        <div class="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mx-auto mb-4">
                            <i class="fa-solid fa-inbox text-2xl"></i>
                        </div>
                        <h3 class="text-base font-bold text-slate-800">Nenhum livro encontrado</h3>
                        <p class="text-sm text-slate-500 max-w-sm mx-auto mt-1">Não há registros de títulos no banco de dados para gerenciar a disponibilidade no momento.</p>
                    </div>
                @endforelse
            </div>

        </div>
    </main>

</body>
</html>