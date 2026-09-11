<x-admin.layout title="Gestão de Disponibilidades">
<div class="max-w-4xl mx-auto">

        <div class="flex items-center justify-between mb-8">
            <div>
                <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Gestão de Disponibilidades</h1>
                <p class="text-slate-500 mt-1">Cadastre e gerencie as disponibilidades do seu acervo.</p>
            </div>
            <a href="{{ route('admin.categories.index') }}" class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-all shadow-sm">
                <i class="fa-solid fa-arrow-left"></i> Voltar
            </a>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
            <form action="{{ route('admin.availability.store') }}" method="POST" class="flex flex-col sm:flex-row gap-4">
                @csrf
                <div class="flex-1">
                    <label for="admin-availability" class="block text-sm font-bold text-slate-700 mb-2">Nome da Disponibilidade</label>
                    <input id="admin-availability"
                        type="text"
                        name="availability"
                        placeholder="Ex: Disponível"
                        class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all"
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
                <h2 class="text-lg font-bold text-slate-800">Disponibilidades cadastradas</h2>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead class="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-widest font-bold">
                        <tr>
                            <th class="px-6 py-4">Nome da Disponibilidade</th>
                            <th class="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        @foreach ($availabilities as $availability)
                            <tr class="hover:bg-slate-50/50 transition-colors">
                                <td class="px-6 py-4 font-medium text-slate-800">{{ $availability->availability }}</td>
                                <td class="px-6 py-4 text-right flex justify-end gap-3">
                                    <a href="{{ route('admin.availability.edit', $availability->id) }}" class="text-amber-600 hover:text-amber-900 font-semibold text-sm">Editar</a>

                                    <form action="{{ route('admin.availability.destroy', $availability->id) }}" method="POST" onsubmit="return confirm('Tem certeza que deseja excluir?');">
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
