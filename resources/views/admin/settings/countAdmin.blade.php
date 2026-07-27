<!DOCTYPE html>
<html lang="pt-BR" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Total de Administradores</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- FontAwesome para os ícones -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="h-full bg-white font-sans antialiased text-[#241b14] flex">

    <!-- Sidebar com Cores Rústicas -->
    <aside class="w-64 bg-[#241b14] border-r border-[#382b22] min-h-screen flex flex-col justify-between shrink-0 hidden md:flex text-[#d6c7b9]">
        <!-- Topo da Sidebar -->
        <div>
            <div class="p-6 border-b border-[#382b22]">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-[#b08968]/20 flex items-center justify-center text-[#d4a373]">
                        <i class="fa-solid fa-gear"></i>
                    </div>
                    <div>
                        <span class="text-[10px] font-bold uppercase tracking-wider text-[#a38875] block">Painel</span>
                        <span class="text-sm font-black text-[#d6c7b9]">Configurações</span>
                    </div>
                </div>
            </div>

            <!-- Navegação -->
            <nav class="p-4 space-y-1">
                <a href="#" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#d6c7b9] bg-[#382b22] border border-[#48372d]">
                    <i class="fa-solid fa-sliders text-[#d4a373]"></i> Geral & Perfil
                </a>
                <a href="#" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#a38875] hover:text-[#d6c7b9] hover:bg-[#382b22]/50 transition-all">
                    <i class="fa-solid fa-shield-halved"></i> Segurança
                </a>
                <a href="#" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#d6c7b9] bg-[#382b22]/50 border border-[#382b22]">
                    <i class="fa-solid fa-users-gear text-[#d4a373]"></i> Administradores
                </a>
                <a href="#" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#a38875] hover:text-[#d6c7b9] hover:bg-[#382b22]/50 transition-all">
                    <i class="fa-solid fa-clipboard-list"></i> Auditoria de Logs
                </a>
            </nav>
        </div>

        <!-- Rodapé da Sidebar com Botão Voltar -->
        <div class="p-4 border-t border-[#382b22] bg-[#1c140f]">
            <a href="{{ route('adminPanel') }}" class="flex items-center gap-2 text-xs text-[#a38875] hover:text-[#d6c7b9] transition-colors">
                <i class="fa-solid fa-arrow-left"></i> Voltar ao painel
            </a>
        </div>
    </aside>

    <!-- Conteúdo Principal -->
    <div class="flex-1 flex flex-col min-w-0 overflow-y-auto bg-white">
        
        <!-- Header Superior -->
        <header class="h-20 bg-white border-b border-stone-200 px-8 flex items-center justify-between">
            <h1 class="text-lg font-bold text-stone-800">Gerenciamento de Administradores</h1>
        </header>

        <!-- Corpo Principal da Página -->
        <main class="p-8 max-w-5xl">
            <!-- Card Rústico com o Total de Administradores -->
            <div class="bg-[#241b14] border border-[#382b22] rounded-2xl p-8 shadow-xl relative overflow-hidden text-[#d6c7b9] mb-8">
                <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-[#b08968]/5 rounded-full blur-2xl pointer-events-none"></div>

                <div class="flex items-center justify-between mb-6">
                    <div>
                        <span class="inline-block text-[10px] font-bold uppercase tracking-wider text-[#d4a373] bg-[#b08968]/10 px-3 py-1 rounded-full border border-[#b08968]/20 mb-2">
                            Métrica do Sistema
                        </span>
                        <h2 class="text-xl font-extrabold text-[#d6c7b9]">
                            Total de Administradores Cadastrados
                        </h2>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-[#b08968]/20 text-[#d4a373] flex items-center justify-center border border-[#b08968]/30">
                        <i class="fa-solid fa-users text-lg"></i>
                    </div>
                </div>

                <div class="flex items-baseline gap-3 bg-[#1c140f] p-6 rounded-xl border border-[#382b22]">
                    <span class="text-5xl font-black text-[#d4a373]">
                        {{ $totalAdmins }}
                    </span>
                    <span class="text-xs font-semibold text-[#a38875] uppercase tracking-wider">
                        {{ $totalAdmins === 1 ? 'Administrador ativo' : 'Administradores ativos' }}
                    </span>
                </div>
            </div>

            <!-- Lista de Todos os Administradores com Nome e Foto -->
            <div class="bg-stone-50 border border-stone-200 rounded-2xl p-6 shadow-sm">
                <h3 class="text-sm font-bold uppercase tracking-wider text-stone-600 mb-4 flex items-center gap-2">
                    <i class="fa-solid fa-id-badge text-[#b08968]"></i> Lista de Administradores
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    @foreach($admins as $admin)
                        <div class="flex items-center gap-4 bg-white border border-stone-200 p-4 rounded-xl shadow-sm hover:border-[#b08968]/50 transition-all">
                            <img src="{{ $admin->profile_photo_url ?? 'https://ui-avatars.com/api/?name=' . urlencode($admin->name) . '&background=b08968&color=1c140f' }}" 
                                 alt="Foto de {{ $admin->name }}" 
                                 class="w-12 h-12 rounded-xl object-cover border border-[#b08968]/30 shadow-inner">
                            <div class="flex flex-col overflow-hidden">
                                <span class="text-sm font-bold text-stone-800 truncate">{{ $admin->name }}</span>
                                <span class="text-xs text-stone-500 truncate">{{ $admin->email }}</span>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </main>
    </div>

</body>
</html>