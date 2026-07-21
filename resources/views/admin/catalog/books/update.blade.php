<!DOCTYPE html>
<html lang="pt-br" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Painel de Acervo - Gestão Profissional</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-slate-50 min-h-screen text-slate-900">

    <main class="max-w-6xl mx-auto px-6 py-12">
        
        <!-- Header Refinado -->
        <header class="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
                <span class="text-indigo-600 font-bold text-xs uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">Sistema de Biblioteca</span>
                <h1 class="text-4xl font-extrabold text-slate-900 tracking-tight mt-3">Gestão de Acervo</h1>
                <p class="text-slate-500 mt-1">Gerencie o status e a disponibilidade do seu catálogo.</p>
            </div>
            
            <div class="flex items-center gap-3">
                <div class="relative group">
                    <i class="fa-solid fa-magnifying-glass absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"></i>
                    <input type="text" placeholder="Buscar título..." class="pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-white shadow-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none w-full lg:w-72 transition-all">
                </div>
                <a href="{{ route('adminPanel') }}" class="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all">
                    <i class="fa-solid fa-arrow-left"></i> Voltar
                </a>
            </div>
        </header>

        <!-- Filtros e Stats -->
        <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div class="flex gap-2">
                @foreach(['Todos', 'Disponíveis', 'Emprestados'] as $filter)
                    <button class="px-5 py-2 rounded-xl text-sm font-bold transition-all {{ $loop->first ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50' }}">
                        {{ $filter }}
                    </button>
                @endforeach
            </div>
            <span class="text-sm font-medium text-slate-400">{{ $books->count() }} títulos encontrados</span>
        </div>

        <!-- Tabela com Layout de Cartões -->
        <div class="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <table class="w-full text-left">
                <thead class="bg-slate-50 border-b border-slate-100">
                    <tr>
                        <th class="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">Livro</th>
                        <th class="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                        <th class="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">Registro</th>
                        <th class="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @forelse($books as $book)
                        @php
                            $isAvailable = $book->fk_availability_id;
                            $config = [
                                1 => ['label' => 'Disponível', 'bg' => 'bg-emerald-50', 'text' => 'text-emerald-700', 'border' => 'border-emerald-200'],
                                2 => ['label' => 'Indisponível', 'bg' => 'bg-rose-50', 'text' => 'text-rose-700', 'border' => 'border-rose-200'],
                                3 => ['label' => 'Emprestado', 'bg' => 'bg-amber-50', 'text' => 'text-amber-700', 'border' => 'border-amber-200']
                            ][$isAvailable] ?? ['label' => 'Erro', 'bg' => 'bg-slate-100', 'text' => 'text-slate-700', 'border' => 'border-slate-200'];
                        @endphp
                        <tr class="group hover:bg-slate-50/80 transition-colors">
                            <td class="px-8 py-6">
                                <div class="flex items-center gap-5">
                                    <div class="w-14 h-20 rounded-xl overflow-hidden shadow-sm border border-slate-200">
                                        @if($book->cover_url)
                                            <img src="{{ asset('storage/' . $book->cover_url) }}" class="w-full h-full object-cover">
                                        @else
                                            <div class="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                                                <i class="fa-solid fa-book"></i>
                                            </div>
                                        @endif
                                    </div>
                                    <div>
                                        <h3 class="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{{ $book->title }}</h3>
                                        <p class="text-sm text-slate-500">{{ $book->author->name ?? 'Desconhecido' }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-6">
                                <span class="px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border {{ $config['bg'] }} {{ $config['text'] }} {{ $config['border'] }}">
                                    {{ $config['label'] }}
                                </span>
                            </td>
                            <td class="px-6 py-6 font-mono text-sm text-slate-400">#{{ str_pad($book->id, 4, '0', STR_PAD_LEFT) }}</td>
                            <td class="px-8 py-6 text-right">
                                <form action="#" method="POST">
                                    @csrf @method('PUT')
                                    <button class="bg-indigo-50 text-indigo-600 px-5 py-2.5 rounded-xl font-bold text-xs uppercase hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                                        Alterar Status
                                    </button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" class="py-24 text-center">
                                <div class="text-slate-300 text-5xl mb-4"><i class="fa-solid fa-inbox"></i></div>
                                <p class="text-slate-500 font-medium">Nenhum livro cadastrado no momento.</p>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </main>
</body>
</html>