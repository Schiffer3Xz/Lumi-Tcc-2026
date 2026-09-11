<x-admin.layout title="Gestão de Autores">
<div class="max-w-4xl mx-auto">

        <div class="flex items-center justify-between mb-8">
            <div>
                <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Gestão de Autores</h1>
                <p class="text-slate-500 mt-1">Cadastre e gerencie os autores do seu acervo.</p>
            </div>
            <a href="{{ route('admin.dashboard') }}" class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-all shadow-sm">
                <i class="fa-solid fa-arrow-left"></i> Voltar
            </a>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
            <form action="{{ route('admin.authors.store') }}" method="POST" class="flex flex-col sm:flex-row gap-4">
                @csrf
                <div class="flex-1">
                    <label for="admin-name" class="block text-sm font-bold text-slate-700 mb-2">Nome do Autor</label>
                    <input id="admin-name"
                        type="text"
                        name="name"
                        placeholder="Ex: Machado de Assis"
                        class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                        required
                    >
                </div>
                <div class="flex items-end">
                    <button type="submit" class="w-full sm:w-auto font-bold px-8 py-3 rounded-xl transition-all active:scale-95 bg-blue-600 text-white hover:bg-blue-700">
                        Adicionar
                    </button>
                </div>
            </form>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="px-6 py-5 border-b border-slate-100">
                <h2 class="text-lg font-bold text-slate-800">Autores cadastrados</h2>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead class="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-widest font-bold">
                        <tr>
                            <th class="px-6 py-4">Nome do Autor</th>
                            <th class="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        @foreach ($authors as $author)
                            <tr class="hover:bg-slate-50/50 transition-colors">
                                <td class="px-6 py-4 font-medium text-slate-800">{{ $author->name }}</td>
                                <td class="px-6 py-4 text-right flex justify-end gap-3">
                                    <a href="{{ route('admin.authors.edit', $author->id) }}" class="text-blue-600 hover:text-blue-900 font-semibold text-sm">Editar</a>

                                    <form action="{{ route('admin.authors.destroy', $author->id) }}" method="POST" onsubmit="return confirm('Tem certeza que deseja excluir?');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="text-red-600 hover:text-red-800 font-semibold text-sm">Excluir</button>
                                    </form>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>

</x-admin.layout>
