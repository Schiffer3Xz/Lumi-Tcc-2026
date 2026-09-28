<x-admin.layout title="Perfil &amp; Segurança">
<div class="max-w-3xl mx-auto">

            <div class="mb-10">
                <span class="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-white px-3 py-1 rounded-full">Editar Perfil</span>
                <h1 class="text-2xl font-bold text-slate-900 mt-3 tracking-tight">Informações Pessoais</h1>
            </div>

            <form class="space-y-8" action="{{route('admin.settings.profile.update')}}" method="POST">
                @csrf
                @method('PUT')

                <div class="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                    <span aria-hidden="true" class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-lumi-navy text-xl font-bold text-yellow-300">{{ mb_strtoupper(mb_substr(auth()->user()->name, 0, 1)) }}</span>
                    <div class="min-w-0">
                        <h2 class="break-words font-bold text-slate-900">{{ auth()->user()->name }}</h2>
                        <p class="mt-1 break-all text-sm text-slate-500">{{ auth()->user()->email }}</p>
                    </div>
                </div>
                <!-- Seção Dados -->
                <div class="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 sm:p-8 space-y-6">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label for="admin-name" class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Nome Completo</label>
                            <input id="admin-name" type="text" name="name"  value="{{ old('name', auth()->user()->name) }}" class="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                        </div>
                        <div>
                            <label for="admin-nickname" class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Nickname</label>
                            <input id="admin-nickname" type="text" name="nickname" value="{{ old('nickname', auth()->user()->nickname) }}" class="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                        </div>
                    </div>
                    <div>
                        <label for="admin-description" class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Biografia</label>
                        <textarea id="admin-description" name="description" class="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs h-24">{{ old('description', auth()->user()->description) }}</textarea>
                    </div>
                </div>

                <!-- Seção Segurança (Botões ao invés de Textbox) -->
                <div class="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 sm:p-8 space-y-6">
                    <h2 class="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <i class="fa-solid fa-lock text-blue-600"></i> Gerenciamento de Acesso
                    </h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <a href="{{ route('admin.settings.email.edit') }}" class="border border-slate-200 bg-slate-50 hover:border-blue-200 hover:bg-blue-50 w-full p-4 rounded-xl text-xs font-bold flex items-center justify-between">
                            <span>Alterar E-mail</span>
                            <i class="fa-solid fa-envelope"></i>
                        </a>
                        <a href="{{ route('admin.settings.password.edit') }}" class="border border-slate-200 bg-slate-50 hover:border-blue-200 hover:bg-blue-50 w-full p-4 rounded-xl text-xs font-bold flex items-center justify-between">
                            <span>Redefinir Senha</span>
                            <i class="fa-solid fa-key"></i>
                        </a>
                    </div>
                </div>

                <div class="flex flex-wrap justify-end gap-3 pt-4">
                   <a href="{{route('admin.settings.index')}}" class="px-6 py-3 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 transition-all text-center">
                        Voltar as Configurações
                    </a>
                    <button type="submit" class="px-8 py-3 rounded-xl text-xs font-bold transition-all shadow-lg shadow-slate-900/20 bg-blue-600 text-white hover:bg-blue-700">Salvar Alterações</button>
                </div>
            </form>
        </div>

</x-admin.layout>
