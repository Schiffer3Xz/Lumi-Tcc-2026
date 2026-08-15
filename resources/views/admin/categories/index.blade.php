<!DOCTYPE html>
<html lang="pt-br" class="h-full bg-slate-50">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Gestão de Categorias</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .glass-card {
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.8);
        }
    </style>
</head>
<body class="h-full font-sans antialiased text-slate-900">

    <div class="max-w-5xl mx-auto py-16 px-6">
        
        <div class="flex items-center justify-between mb-12">
            <div>
                <h1 class="text-4xl font-extrabold text-slate-900 tracking-tight">Gestão de Categorias</h1>
                <p class="text-slate-500 mt-2 text-lg">Escolha uma ação para gerenciar seus dados</p>
            </div>
            <a href="{{ route('admin.dashboard') }}" class="group flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-all shadow-sm">
                <i class="fa-solid fa-arrow-left text-sm group-hover:-translate-x-1 transition-transform"></i>
                Voltar
            </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
            
            <a href="{{route('admin.genres.index')}}" class="group relative overflow-hidden p-8 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-200 transition-all duration-500">
                <div class="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="relative z-10">
                    <div class="w-14 h-14 mb-6 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
                        <i class="fa-solid fa-folder-plus"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-2">Cadastrar Gênero</h3>
                    <p class="text-slate-500 text-sm leading-relaxed">Gerencie e adicione novas categorias de gêneros literários ao seu sistema.</p>
                </div>
            </a>

            <a href="{{route('admin.authors.index')}}" class="group relative overflow-hidden p-8 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-200 transition-all duration-500">
                <div class="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="relative z-10">
                    <div class="w-14 h-14 mb-6 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
                        <i class="fa-solid fa-user-plus"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-2">Cadastrar Autor</h3>
                    <p class="text-slate-500 text-sm leading-relaxed">Cadastre novos escritores e mantenha a base de autores atualizada.</p>
                </div>
            </a>

        </div>
    </div>

</body>
</html>