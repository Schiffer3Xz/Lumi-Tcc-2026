<x-admin.layout title="Total de Administradores">
<div class="mb-6"><h1 class="text-2xl font-bold text-slate-900">Administradores</h1><p class="mt-1 text-sm text-slate-500">Gerenciamento da equipe administrativa.</p></div>

            <!-- Total de administradores -->
            <div class="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm relative overflow-hidden text-slate-800 mb-8">
                <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-600/5 rounded-full blur-2xl pointer-events-none"></div>

                <div class="flex items-center justify-between mb-6">
                    <div>
                        <span class="inline-block text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-600/10 px-3 py-1 rounded-full border border-blue-600/20 mb-2">
                            Métrica do Sistema
                        </span>
                        <h2 class="text-xl font-bold text-slate-800">
                            Total de Administradores Cadastrados
                        </h2>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-600 flex items-center justify-center border border-blue-600/30">
                        <i class="fa-solid fa-users text-lg"></i>
                    </div>
                </div>

                <div class="flex items-baseline gap-3 bg-white p-6 rounded-xl border border-slate-200">
                    <span class="text-5xl font-bold text-blue-600">
                        {{ $totalAdmins }}
                    </span>
                    <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {{ $totalAdmins === 1 ? 'Administrador ativo' : 'Administradores ativos' }}
                    </span>
                </div>
            </div>

            <!-- Lista de Todos os Administradores com Nome e Foto -->
            <div class="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 class="text-sm font-bold uppercase tracking-wider text-slate-600 mb-4 flex items-center gap-2">
                    <i class="fa-solid fa-id-badge text-blue-600"></i> Lista de Administradores
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    @foreach($admins as $admin)
                        <div class="flex items-center gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:border-blue-600/50 transition-all">
                            <img src="{{ $admin->profile_photo_url ?? 'https://ui-avatars.com/api/?name=' . urlencode($admin->name) . '&background=b08968&color=1c140f' }}"
                                 alt="Foto de {{ $admin->name }}"
                                 class="w-12 h-12 rounded-xl object-cover border border-blue-600/30 shadow-inner">
                            <div class="flex flex-col overflow-hidden">
                                <span class="text-sm font-bold text-slate-800 truncate">{{ $admin->name }}</span>
                                <span class="text-xs text-slate-500 truncate">{{ $admin->email }}</span>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>

</x-admin.layout>
