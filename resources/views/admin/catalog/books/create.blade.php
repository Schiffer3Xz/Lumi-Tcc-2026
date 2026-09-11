<x-admin.layout title="Cadastrar Novo Livro - Painel Administrativo">
<div class="max-w-4xl mx-auto">

        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-slate-200/80">
            <div>
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold tracking-wide uppercase mb-2">
                    <i class="fa-solid fa-plus text-[10px]"></i> Painel Administrativo
                </div>
                <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Cadastrar Novo Livro</h1>
                <p class="text-sm text-slate-500 mt-1">Preencha os dados abaixo para adicionar uma nova obra ao acervo.</p>
            </div>

            <a href="{{ route('admin.dashboard') }}" class="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-medium px-4 py-2.5 rounded-2xl shadow-sm hover:shadow border border-slate-200/80 transition-all text-sm w-fit">
                <i class="fa-solid fa-arrow-left text-xs text-slate-400"></i>
                Voltar ao Catálogo
            </a>
        </div>



          <form action="{{ route('admin.books.store') }}" method="POST" enctype="multipart/form-data"
              class="bg-white/80 backdrop-blur-sm p-6 sm:p-10 rounded-3xl shadow-sm border border-slate-200/80 grid grid-cols-1 md:grid-cols-12 gap-8">
            @csrf

            <div class="md:col-span-5 flex flex-col">
                <label for="cover_upload" class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Capa da Obra</label>
                <input type="file" id="cover_upload" name="cover_image" class="hidden" accept="image/*" onchange="previewImage(event)">

                <label for="cover_upload" class="group w-full aspect-[2/3] border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:bg-blue-50/40 transition-all duration-300 cursor-pointer overflow-hidden relative shadow-inner bg-slate-50/50">
                    <div id="preview_container" class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        <div class="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform mb-3">
                            <i class="fa-solid fa-cloud-arrow-up text-lg"></i>
                        </div>
                        <span class="text-xs font-bold text-slate-700 group-hover:text-blue-700">Adicionar Capa</span>
                        <span class="text-[10px] text-slate-400 mt-1">PNG, JPG até 10MB</span>
                    </div>
                    <img id="image_preview" class="w-full h-full object-cover hidden">
                </label>
            </div>

            <div class="md:col-span-7 space-y-5">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Título do Livro</label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <i class="fa-solid fa-book text-xs"></i>
                        </span>
                        <input type="text" name="title" required maxlength="150" placeholder="Ex: Dom Casmurro"
                               class="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label for="admin-fk_author_id" class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Autor</label>
                        <div class="relative">
                            <select id="admin-fk_author_id" name="fk_author_id" required
                                    class="w-full pl-4 pr-10 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer">
                                <option value="">Selecione...</option>
                                @foreach ($authors as $author)
                                    <option value="{{ $author->id }}">{{ $author->name }}</option>
                                @endforeach
                            </select>
                            <span class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                                <i class="fa-solid fa-chevron-down text-xs"></i>
                            </span>
                        </div>
                    </div>

                    <div>
                        <label for="admin-page_count" class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Páginas</label>
                        <div class="relative">
                            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <i class="fa-solid fa-file-lines text-xs"></i>
                            </span>
                            <input id="admin-page_count" type="number" name="page_count" min="1" placeholder="Ex: 250"
                                   class="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label for="admin-fk_genre_id" class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Gênero</label>
                        <div class="relative">
                            <select id="admin-fk_genre_id" name="fk_genre_id" required
                                    class="w-full pl-4 pr-10 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer">
                                <option value="">Selecione...</option>
                                @foreach ($genres as $genre)
                                    <option value="{{ $genre->id }}">{{ $genre->name }}</option>
                                @endforeach
                            </select>
                            <span class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                                <i class="fa-solid fa-chevron-down text-xs"></i>
                            </span>
                        </div>
                    </div>

                    <div>
                        <label for="admin-fk_availability_id" class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Disponibilidade</label>
                        <div class="relative">
                            <select id="admin-fk_availability_id" name="fk_availability_id" required
                                    class="w-full pl-4 pr-10 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer">
                                <option value="">Selecione...</option>
                                @foreach ($availabilities as $availability)
                                    <option value="{{ $availability->id }}">{{ $availability->availability }}</option>
                                @endforeach
                            </select>
                            <span class="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                                <i class="fa-solid fa-chevron-down text-xs"></i>
                            </span>
                        </div>
                    </div>
                </div>

                <div>
                    <label for="admin-description" class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Descrição / Sinopse</label>
                    <textarea id="admin-description" name="description" rows="3" placeholder="Sinopse ou breves detalhes sobre o livro..."
                              class="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"></textarea>
                </div>

                <div class="pt-2">
                    <button type="submit" class="w-full py-3.5 rounded-2xl font-semibold shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 active:translate-y-0 transition-all duration-200 text-sm flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700">
                        <i class="fa-solid fa-check text-xs"></i>
                        Cadastrar Livro
                    </button>
                </div>
            </div>
        </form>
    </div>

<x-slot:scripts>
<script>
        function previewImage(event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            const preview = document.getElementById('image_preview');
            const container = document.getElementById('preview_container');

            reader.onload = function(e) {
                preview.src = e.target.result;
                preview.classList.remove('hidden');
                container.classList.add('hidden');
            }
            if (file) {
                reader.readAsDataURL(file);
            }
        }
    </script>
</x-slot:scripts>
</x-admin.layout>
