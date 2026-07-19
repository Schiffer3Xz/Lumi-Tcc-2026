<!DOCTYPE html>
<html lang="pt-br" class="h-full bg-slate-50">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestão de Autores</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>

<body class="py-12 px-6">

    <div class="max-w-4xl mx-auto">
        
        <div class="flex items-center justify-between mb-8">
            <div>
                <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Gestão de Autores</h1>
                <p class="text-slate-500 mt-1">Cadastre e gerencie os autores do seu acervo.</p>
            </div>
            <a href="{{ route('adminPanel') }}" class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-all shadow-sm">
                <i class="fa-solid fa-arrow-left"></i> Voltar
            </a>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
            <form action="{{ route('author.store') }}" method="POST" class="flex flex-col sm:flex-row gap-4">
                @csrf
                <div class="flex-1">
                    <label class="block text-sm font-bold text-slate-700 mb-2">Nome do Autor</label>
                    <input 
                        type="text"
                        name="name"
                        placeholder="Ex: Machado de Assis"
                        class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                        required
                    >
                </div>
                <div class="flex items-end">
                    <button type="submit" class="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3 rounded-xl transition-all active:scale-95">
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
                                    <a href="{{ route('edit.author', $author->id) }}" class="text-indigo-600 hover:text-indigo-900 font-semibold text-sm">Editar</a>
                                    
                                    <form action="{{ route('destroy.author', $author->id) }}" method="POST" onsubmit="return confirm('Tem certeza que deseja excluir?');">
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

</body>
</html>