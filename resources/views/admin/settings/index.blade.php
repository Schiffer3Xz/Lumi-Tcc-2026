<!DOCTYPE html>
<html lang="pt-br" class="h-full" style="background-color: #fbf9f6;">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Configurações da Conta</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .bg-custom-main { background-color: #fbf9f6; }
        .bg-custom-card { background-color: #f4ede2; }
        .border-custom-card { border-color: #e6dccf; }
        .text-custom-title { color: #2d221b; }
        .text-custom-body { color: #8c7462; }
        .text-custom-accent { color: #b08968; }
        .hover-card:hover { border-color: #b08968; background-color: #f7f2ea; }
        .sidebar-bg { background-color: #2d221b; }
        .sidebar-border { border-color: #3e3027; }
    </style>
</head>
<body class="h-full font-sans antialiased bg-custom-main text-[#2d221b] m-0 p-0 flex">

    <aside class="w-64 sidebar-bg sidebar-border border-r min-h-screen flex flex-col justify-between shrink-0 hidden md:flex">
        <div class="p-6 border-b sidebar-border">
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

        <nav class="p-4 space-y-1 flex-1">
            <a href="#" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#d6c7b9] bg-[#382b22] border sidebar-border">
                <i class="fa-solid fa-sliders text-[#d4a373]"></i> Geral & Perfil
            </a>
            <a href="#" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#a38875] hover:text-[#d6c7b9] hover:bg-[#382b22]/50 transition-all">
                <i class="fa-solid fa-shield-halved"></i> Segurança
            </a>
            <a href="#" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#a38875] hover:text-[#d6c7b9] hover:bg-[#382b22]/50 transition-all">
                <i class="fa-solid fa-users-gear"></i> Administradores
            </a>
            <a href="#" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#a38875] hover:text-[#d6c7b9] hover:bg-[#382b22]/50 transition-all">
                <i class="fa-solid fa-clipboard-list"></i> Auditoria de Logs
            </a>
        </nav>

        <div class="p-4 border-t sidebar-border bg-[#241b14]">
            <a href="#" class="flex items-center gap-2 text-xs text-[#a38875] hover:text-[#d6c7b9]">
                <i class="fa-solid fa-arrow-left"></i> Voltar ao sistema principal
            </a>
        </div>
    </aside>

    <main class="flex-1 py-10 px-6 sm:px-10 overflow-y-auto">
        <div class="max-w-3xl mx-auto">
            
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-custom-card">
                <div>
                    <span class="text-[11px] font-bold uppercase tracking-widest text-[#b08968] bg-custom-card px-2.5 py-1 rounded-md border border-custom-card inline-block mb-2">Painel de Preferências</span>
                    <h1 class="text-2xl font-black text-custom-title tracking-tight">Configurações Gerais</h1>
                    <p class="text-xs text-custom-body mt-0.5">Central de controle de perfil, acessos e auditoria da conta</p>
                </div>
                <a href="{{route('admin.dashboard')}}" class="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-custom-card border border-custom-card rounded-xl text-xs font-semibold text-[#2d221b] hover:bg-[#ebdccb] transition-all shadow-2xs">
                    <i class="fa-solid fa-arrow-left text-[10px]"></i> Voltar ao Painel
                </a>
            </div>

            <div class="space-y-6">
                
                <div class="bg-custom-card border border-custom-card rounded-2xl p-5 shadow-2xs">
                    <div class="flex items-center justify-between mb-4 pb-3 border-b border-[#e6dccf]/60">
                        <div class="flex items-center gap-2.5">
                            <i class="fa-solid fa-user-circle text-sm text-[#b08968]"></i>
                            <h2 class="text-xs font-bold text-custom-title uppercase tracking-wider">Identidade e Perfil</h2>
                        </div>
                    </div>
                    
                    <a href="{{route('admin.credentials.edit')}}" class="group p-4 bg-white/60 border border-custom-card rounded-xl hover-card transition-all flex items-center justify-between gap-4">
                        <div class="flex items-center gap-3.5 min-w-0">
                            <div class="w-9 h-9 rounded-lg bg-[#b08968]/15 flex items-center justify-center text-[#b08968] shrink-0 group-hover:scale-105 transition-transform">
                                <i class="fa-solid fa-user-pen text-xs"></i>
                            </div>
                            <div class="min-w-0">
                                <h3 class="font-bold text-custom-title text-xs">Perfil, Preferências e Segurança</h3>
                                <p class="text-[11px] text-custom-body mt-0.5 truncate">Gerencie seus dados pessoais, configurações e segurança</p>
                            </div>
                        </div>
                        <i class="fa-solid fa-arrow-right text-xs text-[#8c7462] group-hover:text-[#b08968] group-hover:translate-x-1 transition-all"></i>
                    </a>
                </div>

                <div class="bg-custom-card border border-custom-card rounded-2xl p-5 shadow-2xs">
                    <div class="flex items-center justify-between mb-4 pb-3 border-b border-[#e6dccf]/60">
                        <div class="flex items-center gap-2.5">
                            <i class="fa-solid fa-lock text-sm text-[#b08968]"></i>
                            <h2 class="text-xs font-bold text-custom-title uppercase tracking-wider">Equipe Administrativa</h2>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                       <!-- Card: Cadastrar Novo Admin -->
                        <a href="{{route('admin.admins.create')}}" class="group p-4 bg-white/60 border border-custom-card rounded-xl hover-card transition-all flex items-center justify-between gap-3">
                            <div class="flex items-center gap-3 min-w-0">
                                <div class="w-8 h-8 rounded-lg bg-[#3a5a40]/15 flex items-center justify-center text-[#3a5a40] shrink-0">
                                    <i class="fa-solid fa-user-plus text-xs"></i>
                                </div>
                                <div class="min-w-0">
                                    <h3 class="font-bold text-custom-title text-xs">Cadastrar Novo Admin</h3>
                                    <p class="text-[10px] text-custom-body truncate">Adicionar novo operador</p>
                                </div>
                            </div>
                            <i class="fa-solid fa-arrow-right text-[10px] text-[#8c7462] group-hover:text-[#3a5a40] group-hover:translate-x-1 transition-all"></i>
                        </a>

                        <!-- Card: Listar Administradores -->
                        <a href="{{route('admin.admins.index')}}" class="group p-4 bg-white/60 border border-custom-card rounded-xl hover-card transition-all flex items-center justify-between gap-3">
                            <div class="flex items-center gap-3 min-w-0">
                                <div class="w-8 h-8 rounded-lg bg-[#b08968]/15 flex items-center justify-center text-[#b08968] shrink-0">
                                    <i class="fa-solid fa-users-gear text-xs"></i>
                                </div>
                                <div class="min-w-0">
                                    <h3 class="font-bold text-custom-title text-xs">Listar Administradores</h3>
                                    <p class="text-[10px] text-custom-body truncate">Ver todos os operadores</p>
                                </div>
                            </div>
                            <i class="fa-solid fa-arrow-right text-[10px] text-[#8c7462] group-hover:text-[#b08968] group-hover:translate-x-1 transition-all"></i>
                        </a>
                    </div>
                </div>

                <div class="bg-custom-card border border-custom-card rounded-2xl p-5 shadow-2xs">
                    <div class="flex items-center justify-between mb-4 pb-3 border-b border-[#e6dccf]/60">
                        <div class="flex items-center gap-2.5">
                            <i class="fa-solid fa-shield-screen text-sm text-[#457b9d]"></i>
                            <h2 class="text-xs font-bold text-custom-title uppercase tracking-wider">Sistema e Histórico</h2>
                        </div>
                    </div>
                    
                    <a href="#" class="group p-4 bg-white/60 border border-custom-card rounded-xl hover:border-[#457b9d] hover:bg-[#f0f3f7] transition-all flex items-center justify-between gap-4">
                        <div class="flex items-center gap-3.5 min-w-0">
                            <div class="w-9 h-9 rounded-lg bg-[#457b9d]/15 flex items-center justify-center text-[#457b9d] shrink-0 group-hover:scale-105 transition-transform">
                                <i class="fa-solid fa-list-check text-xs"></i>
                            </div>
                            <div class="min-w-0">
                                <h3 class="font-bold text-custom-title text-xs">Logs de Ação</h3>
                                <p class="text-[11px] text-custom-body mt-0.5 truncate">Visualizar relatórios de auditoria e atividades executadas</p>
                            </div>
                        </div>
                        <i class="fa-solid fa-arrow-right text-xs text-[#8c7462] group-hover:text-[#457b9d] group-hover:translate-x-1 transition-all"></i>
                    </a>
                </div>

                <div class="bg-[#fcf3f2] border border-[#f0d4d2] rounded-2xl p-5 shadow-2xs">
                    <div class="flex items-center justify-between mb-3 pb-2.5 border-b border-[#f0d4d2]/80">
                        <div class="flex items-center gap-2.5">
                            <i class="fa-solid fa-triangle-exclamation text-sm text-[#bc6c25]"></i>
                            <h2 class="text-xs font-bold text-[#9b5118] uppercase tracking-wider">Zona de Perigo</h2>
                        </div>
                    </div>
                    
                    <a href="#" class="group p-4 bg-white/80 border border-[#f0d4d2] rounded-xl hover:border-[#bc6c25] transition-all flex items-center justify-between gap-4">
                        <div class="flex items-center gap-3.5 min-w-0">
                            <div class="w-9 h-9 rounded-lg bg-[#bc6c25]/15 flex items-center justify-center text-[#bc6c25] shrink-0 group-hover:scale-105 transition-transform">
                                <i class="fa-solid fa-user-slash text-xs"></i>
                            </div>
                            <div class="min-w-0">
                                <h3 class="font-bold text-[#bc6c25] text-xs">Excluir Conta</h3>
                                <p class="text-[11px] text-[#bc6c25]/80 mt-0.5 truncate">Remover permanentemente este perfil do sistema de forma irreversível</p>
                            </div>
                        </div>
                        <i class="fa-solid fa-arrow-right text-xs text-[#bc6c25] group-hover:translate-x-1 transition-all"></i>
                    </a>
                </div>

            </div>
        </div>
    </main>

</body>
</html>