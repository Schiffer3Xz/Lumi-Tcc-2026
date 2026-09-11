<x-admin.layout title="Gestão de Acervo | Painel">
<div class="max-w-5xl mx-auto">

        <!-- Cabeçalho -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 border-b border-slate-200/80 pb-6">
            <div>
                <span class="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-2">Administração</span>
                <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Gestão de Acervo</h1>
                <p class="text-slate-500 mt-1 text-base">Selecione uma operação para o gerenciamento de livros</p>
            </div>
            <a href="{{ route('admin.dashboard') }}" class="inline-flex self-start sm:self-auto items-center gap-2 px-5 py-2.5 bg-white border border-slate-200/80 rounded-2xl font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm">
                <i class="fa-solid fa-arrow-left text-sm"></i> Voltar
            </a>
        </div>

        <!-- Grade de Ações -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            <!-- Cadastrar Livro -->
            <a href="{{ route('admin.books.create') }}" class="group p-8 bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-500 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden">
                <div class="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-6 -mt-6 group-hover:scale-125 transition-transform duration-300 opacity-60"></div>
                <div class="w-16 h-16 mb-5 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm relative z-10">
                    <i class="fa-solid fa-plus"></i>
                </div>
                <h3 class="font-bold text-slate-900 text-lg relative z-10">Cadastrar Livro</h3>
                <p class="text-xs text-slate-400 mt-1 relative z-10">Adicionar nova obra ao catálogo</p>
            </a>

            <!-- Editar Credenciais -->
            <a href="{{ route('admin.books.list') }}" class="group p-8 bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-500 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden">
                <div class="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-6 -mt-6 group-hover:scale-125 transition-transform duration-300 opacity-60"></div>
                <div class="w-16 h-16 mb-5 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm relative z-10">
                    <i class="fa-solid fa-pen-to-square"></i>
                </div>
                <h3 class="font-bold text-slate-900 text-lg relative z-10">Editar Credenciais</h3>
                <p class="text-xs text-slate-400 mt-1 relative z-10">Modificar informações de registros</p>
            </a>

            <!-- Atualizar Disponibilidade -->
            <a href="#" class="group p-8 bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-amber-500/10 hover:border-amber-500 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden sm:col-span-2 lg:col-span-1">
                <div class="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -mr-6 -mt-6 group-hover:scale-125 transition-transform duration-300 opacity-60"></div>
                <div class="w-16 h-16 mb-5 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl group-hover:bg-amber-600 group-hover:text-white transition-all shadow-sm relative z-10">
                    <i class="fa-solid fa-rotate"></i>
                </div>
                <h3 class="font-bold text-slate-900 text-lg relative z-10">Atualizar Disponibilidade</h3>
                <p class="text-xs text-slate-400 mt-1 relative z-10">Controlar status dos exemplares</p>
            </a>

        </div>
    </div>

</x-admin.layout>
