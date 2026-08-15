<!DOCTYPE html>
<html lang="pt-br" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Livro - Painel Administrativo</title>
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
<body class="bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/30 min-h-full text-slate-800 antialiased selection:bg-indigo-500 selection:text-white py-12 px-4 sm:px-6 lg:px-8">

    <div class="max-w-3xl mx-auto">

        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-slate-200/80">
            <div>
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold tracking-wide uppercase mb-2">
                    <i class="fa-solid fa-pen-to-square text-[10px]"></i> Painel Administrativo
                </div>
                <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Editar Livro</h1>
                <p class="text-sm text-slate-500 mt-1">Atualize as informações do título "{{ $book->title }}" no acervo.</p>
            </div>

            <a href="{{ route('admin.books.list') }}" 
               class="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-medium px-4 py-2.5 rounded-2xl shadow-sm hover:shadow border border-slate-200/80 transition-all text-sm w-fit">
                <i class="fa-solid fa-arrow-left text-xs text-slate-400"></i>
                Voltar à Lista
            </a>
        </div>

        @if($errors->any())
            <div class="bg-rose-50 border border-rose-200 text-rose-800 p-5 mb-8 rounded-3xl shadow-sm flex items-start gap-3">
                <div class="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0 mt-0.5">
                    <i class="fa-solid fa-triangle-exclamation text-sm"></i>
                </div>
                <div>
                    <h3 class="font-bold text-sm">Atenção! Verifique os campos abaixo:</h3>
                    <ul class="list-disc pl-4 mt-2 space-y-1 text-xs sm:text-sm">
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            </div>
        @endif

        <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
            <form action="{{ route('admin.books.update', $book->id) }}" method="POST" enctype="multipart/form-data" class="space-y-6">
                @csrf
                @method('PUT')

                <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Título do Livro</label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <i class="fa-solid fa-book text-xs"></i>
                        </span>
                        <input type="text" 
                               name="title" 
                               value="{{ old('title', $book->title) }}" 
                               maxlength="150" 
                               required
                               class="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all">
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Número de Páginas</label>
                        <div class="relative">
                            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <i class="fa-solid fa-file-lines text-xs"></i>
                            </span>
                            <input type="number" 
                                   name="page_count" 
                                   value="{{ old('page_count', $book->page_count) }}" 
                                   min="1" 
                                   required
                                   class="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Autor</label>
                        <div class="relative">
                            <select name="fk_author_id" 
                                    required
                                    class="w-full pl-4 pr-10 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none">
                                <option value="">Selecione o autor</option>
                                @foreach($authors as $author)
                                    <option value="{{ $author->id }}" {{ old('fk_author_id', $book->fk_author_id) == $author->id ? 'selected' : '' }}>
                                        {{ $author->name }}
                                    </option>
                                @endforeach
                            </select>
                            <span class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                                <i class="fa-solid fa-chevron-down text-xs"></i>
                            </span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Gênero</label>
                        <div class="relative">
                            <select name="fk_genre_id" 
                                    required
                                    class="w-full pl-4 pr-10 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none">
                                <option value="">Selecione o gênero</option>
                                @foreach($genres as $genre)
                                    <option value="{{ $genre->id }}" {{ old('fk_genre_id', $book->fk_genre_id) == $genre->id ? 'selected' : '' }}>
                                        {{ $genre->name }}
                                    </option>
                                @endforeach
                            </select>
                            <span class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                                <i class="fa-solid fa-chevron-down text-xs"></i>
                            </span>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Disponibilidade</label>
                        <div class="relative">
                            <select name="fk_availability_id" 
                                    required
                                    class="w-full pl-4 pr-10 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none">
                                <option value="">Selecione o status</option>
                                @foreach($availabilities as $availability)
                                    <option value="{{ $availability->id }}" {{ old('fk_availability_id', $book->fk_availability_id) == $availability->id ? 'selected' : '' }}>
                                        {{ $availability->availability }}
                                    </option>
                                @endforeach
                            </select>
                            <span class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                                <i class="fa-solid fa-chevron-down text-xs"></i>
                            </span>
                        </div>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Descrição / Sinopse</label>
                    <textarea name="description" 
                              rows="4" 
                              class="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none">{{ old('description', $book->description) }}</textarea>
                </div>

                <div class="pt-4 border-t border-slate-100">
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Capa do Livro</label>
                    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/60">
                        @if($book->cover_url)
                            <div class="relative group">
                                <img src="{{ asset('storage/' . $book->cover_url) }}" class="w-20 h-28 object-cover rounded-xl shadow-md border border-slate-200">
                                <span class="absolute bottom-1 right-1 bg-slate-900/70 text-white text-[9px] px-1.5 py-0.5 rounded font-medium backdrop-blur-xs">Atual</span>
                            </div>
                        @else
                            <div class="w-20 h-28 rounded-xl bg-slate-200 flex flex-col items-center justify-center text-slate-400 text-center p-2">
                                <i class="fa-solid fa-image text-lg mb-1"></i>
                                <span class="text-[9px] font-medium leading-tight">Sem capa</span>
                            </div>
                        @endif

                        <div class="flex-1 w-full">
                            <label class="block text-xs font-medium text-slate-500 mb-2">Deseja alterar a capa atual? Envie um novo arquivo:</label>
                            <input type="file" 
                                   name="cover_image" 
                                   class="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer">
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                    <a href="{{ route('admin.books.list') }}" 
                       class="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-sm transition-all">
                        Cancelar
                    </a>
                    <button type="submit" 
                            class="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all">
                        Atualizar Livro
                    </button>
                </div>
            </form>
        </div>

        <div class="mt-8 bg-rose-50/50 backdrop-blur-sm rounded-3xl border border-rose-200/60 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
                <h4 class="font-bold text-slate-900 text-sm">Zona de Exclusão</h4>
                <p class="text-xs text-slate-500 mt-0.5">Esta ação é irreversível e removerá permanentemente o livro do acervo.</p>
            </div>
            <form action="{{ route('admin.books.destroy', $book->id) }}" method="POST" class="w-full sm:w-auto flex justify-end">
                @csrf
                @method('DELETE')
                <button type="submit" 
                        onclick="return confirm('Tem certeza absoluta que deseja excluir este livro?')"
                        class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all">
                    <i class="fa-solid fa-trash-can text-[10px]"></i>
                    Excluir Livro
                </button>
            </form>
        </div>

    </div>

</body>
</html>