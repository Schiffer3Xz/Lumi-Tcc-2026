<x-admin.layout title="Perfil &amp; Segurança">
<div class="max-w-3xl mx-auto">

            <div class="mb-10">
                <span class="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-white px-3 py-1 rounded-full">Editar Perfil</span>
                <h1 class="text-2xl font-bold text-slate-900 mt-3 tracking-tight">Informações Pessoais</h1>
            </div>

            <form class="space-y-8" action="{{route('admin.settings.profile.update')}}" method="POST">
                @csrf
                @method('PUT')

            <!-- Seção Avatar (Substitua a parte do avatar no código anterior por esta) -->
                <div class="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 flex items-center justify-between">
                    <div class="flex items-center gap-6">
                        <!-- Foto de Perfil com estilo rústico -->
                        <div class="w-20 h-20 rounded-full bg-slate-50 border-2 border-slate-200 flex items-center justify-center text-blue-600 shadow-inner relative overflow-hidden">
                            <i class="fa-solid fa-user text-2xl"></i>
                            <!-- Opcional: Se tiver uma imagem, você colocaria um <img> aqui -->
                        </div>
                        <div>
                            <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Foto de Perfil</h3>
                            <p class="text-[10px] text-slate-500 mt-1 max-w-[200px]">Formatos aceitos: JPG, PNG. Tamanho máximo: 2MB.</p>
                        </div>
                    </div>
                    <button type="button" class="px-5 py-2.5 rounded-xl text-[10px] font-bold border border-slate-200 text-slate-500 hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest">
                        Alterar Imagem
                    </button>
                </div>
                <!-- Seção Dados -->
                <div class="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 space-y-6">
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
                <div class="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 space-y-6">
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

                <div class="flex justify-end gap-3 pt-4">
                   <a href="{{route('admin.settings.index')}}" class="px-6 py-3 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 transition-all text-center">
                        Voltar as Configurações
                    </a>
                    <button type="submit" class="px-8 py-3 rounded-xl text-xs font-bold transition-all shadow-lg shadow-slate-900/20 bg-blue-600 text-white hover:bg-blue-700">Salvar Alterações</button>
                </div>
            </form>
        </div>

</x-admin.layout>
