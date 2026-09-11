<x-admin.layout title="Configurações da Conta">
<div class="max-w-3xl mx-auto">

            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
                <div>
                    <span class="text-[11px] font-bold uppercase tracking-widest text-blue-600 bg-white px-2.5 py-1 rounded-md border border-slate-200 inline-block mb-2">Painel de Preferências</span>
                    <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Configurações Gerais</h1>
                    <p class="text-xs text-slate-500 mt-0.5">Central de controle de perfil, acessos e auditoria da conta</p>
                </div>
                <a href="{{route('admin.dashboard')}}" class="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 hover:bg-slate-100 transition-all shadow-2xs">
                    <i class="fa-solid fa-arrow-left text-[10px]"></i> Voltar ao Painel
                </a>
            </div>

            <div class="space-y-6">

                <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                    <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/60">
                        <div class="flex items-center gap-2.5">
                            <i class="fa-solid fa-user-circle text-sm text-blue-600"></i>
                            <h2 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Identidade e Perfil</h2>
                        </div>
                    </div>

                    <a href="{{route('admin.credentials.edit')}}" class="group p-4 bg-white/60 border border-slate-200 rounded-xl hover:border-blue-200 hover:bg-blue-50/40 transition-all flex items-center justify-between gap-4">
                        <div class="flex items-center gap-3.5 min-w-0">
                            <div class="w-9 h-9 rounded-lg bg-blue-600/15 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-105 transition-transform">
                                <i class="fa-solid fa-user-pen text-xs"></i>
                            </div>
                            <div class="min-w-0">
                                <h3 class="font-bold text-slate-900 text-xs">Perfil, Preferências e Segurança</h3>
                                <p class="text-[11px] text-slate-500 mt-0.5 truncate">Gerencie seus dados pessoais, configurações e segurança</p>
                            </div>
                        </div>
                        <i class="fa-solid fa-arrow-right text-xs text-slate-500 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"></i>
                    </a>
                </div>

                <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                    <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/60">
                        <div class="flex items-center gap-2.5">
                            <i class="fa-solid fa-lock text-sm text-blue-600"></i>
                            <h2 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Equipe Administrativa</h2>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                       <!-- Card: Cadastrar Novo Admin -->
                        <a href="{{route('admin.admins.create')}}" class="group p-4 bg-white/60 border border-slate-200 rounded-xl hover:border-blue-200 hover:bg-blue-50/40 transition-all flex items-center justify-between gap-3">
                            <div class="flex items-center gap-3 min-w-0">
                                <div class="w-8 h-8 rounded-lg bg-emerald-600/15 flex items-center justify-center text-emerald-600 shrink-0">
                                    <i class="fa-solid fa-user-plus text-xs"></i>
                                </div>
                                <div class="min-w-0">
                                    <h3 class="font-bold text-slate-900 text-xs">Cadastrar Novo Admin</h3>
                                    <p class="text-[10px] text-slate-500 truncate">Adicionar novo operador</p>
                                </div>
                            </div>
                            <i class="fa-solid fa-arrow-right text-[10px] text-slate-500 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all"></i>
                        </a>

                        <!-- Card: Listar Administradores -->
                        <a href="{{route('admin.admins.index')}}" class="group p-4 bg-white/60 border border-slate-200 rounded-xl hover:border-blue-200 hover:bg-blue-50/40 transition-all flex items-center justify-between gap-3">
                            <div class="flex items-center gap-3 min-w-0">
                                <div class="w-8 h-8 rounded-lg bg-blue-600/15 flex items-center justify-center text-blue-600 shrink-0">
                                    <i class="fa-solid fa-users-gear text-xs"></i>
                                </div>
                                <div class="min-w-0">
                                    <h3 class="font-bold text-slate-900 text-xs">Listar Administradores</h3>
                                    <p class="text-[10px] text-slate-500 truncate">Ver todos os operadores</p>
                                </div>
                            </div>
                            <i class="fa-solid fa-arrow-right text-[10px] text-slate-500 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"></i>
                        </a>
                    </div>
                </div>

                <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                    <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/60">
                        <div class="flex items-center gap-2.5">
                            <i class="fa-solid fa-shield-screen text-sm text-blue-600"></i>
                            <h2 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Sistema e Histórico</h2>
                        </div>
                    </div>

                    <a href="#" class="group p-4 bg-white/60 border border-slate-200 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all flex items-center justify-between gap-4">
                        <div class="flex items-center gap-3.5 min-w-0">
                            <div class="w-9 h-9 rounded-lg bg-blue-600/15 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-105 transition-transform">
                                <i class="fa-solid fa-list-check text-xs"></i>
                            </div>
                            <div class="min-w-0">
                                <h3 class="font-bold text-slate-900 text-xs">Logs de Ação</h3>
                                <p class="text-[11px] text-slate-500 mt-0.5 truncate">Visualizar relatórios de auditoria e atividades executadas</p>
                            </div>
                        </div>
                        <i class="fa-solid fa-arrow-right text-xs text-slate-500 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"></i>
                    </a>
                </div>

                <div class="bg-red-50 border border-red-200 rounded-2xl p-5 shadow-2xs">
                    <div class="flex items-center justify-between mb-3 pb-2.5 border-b border-red-200/80">
                        <div class="flex items-center gap-2.5">
                            <i class="fa-solid fa-triangle-exclamation text-sm text-red-600"></i>
                            <h2 class="text-xs font-bold text-red-700 uppercase tracking-wider">Zona de Perigo</h2>
                        </div>
                    </div>

                    <a href="#" class="group p-4 bg-white/80 border border-red-200 rounded-xl hover:border-red-600 transition-all flex items-center justify-between gap-4">
                        <div class="flex items-center gap-3.5 min-w-0">
                            <div class="w-9 h-9 rounded-lg bg-red-600/15 flex items-center justify-center text-red-600 shrink-0 group-hover:scale-105 transition-transform">
                                <i class="fa-solid fa-user-slash text-xs"></i>
                            </div>
                            <div class="min-w-0">
                                <h3 class="font-bold text-red-600 text-xs">Excluir Conta</h3>
                                <p class="text-[11px] text-red-600/80 mt-0.5 truncate">Remover permanentemente este perfil do sistema de forma irreversível</p>
                            </div>
                        </div>
                        <i class="fa-solid fa-arrow-right text-xs text-red-600 group-hover:translate-x-1 transition-all"></i>
                    </a>
                </div>

            </div>
        </div>

</x-admin.layout>
