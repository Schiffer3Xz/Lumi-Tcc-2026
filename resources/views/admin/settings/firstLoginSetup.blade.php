<x-admin.layout title="Configuração Inicial - Primeiro Acesso" :first-access="true" :step="1">
<section class="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:p-8">
    <div class="mb-6 border-b border-slate-100 pb-5"><span class="mb-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600">Primeiro acesso</span><h1 class="text-2xl font-bold tracking-tight text-slate-900">Bem-vindo, Administrador</h1><p class="mt-2 text-sm leading-relaxed text-slate-500">Configure seu perfil e defina uma nova senha para acessar o painel.</p></div>
    <div class="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-800"><i class="fa-solid fa-shield-halved mt-0.5" aria-hidden="true"></i><p>Por segurança, preencha seus dados e substitua a senha temporária antes de continuar.</p></div>
    <form class="space-y-6" action="{{route('admin.credentials.update')}}" method="post">
                @csrf

                <div>
                    <h2 class="text-md font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.656 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Informações Pessoais
                    </h2>

                    <div class="mb-4 flex items-center gap-4">
                        <div class="relative w-16 h-16 rounded-full overflow-hidden bg-slate-200 border-2 border-slate-300 flex items-center justify-center flex-shrink-0">
                            <img id="preview-foto" src="" alt="Preview" class="w-full h-full object-cover hidden">
                            <svg id="default-avatar" class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.18a8.25 8.25 0 0115.0 0"></path></svg>
                        </div>
                        <div class="flex-1">
                            <label for="profile-picture" class="block text-sm font-medium text-slate-600 mb-1">Foto de Perfil <span class="text-slate-400 font-normal">(opcional)</span></label>
                            <input type="file" id="profile-picture" accept="image/*" class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="full-name" class="block text-sm font-medium text-slate-600 mb-1">Nome Completo <span class="text-red-500">*</span></label>
                            <input type="text" id="full-name" name="name" value="{{ old('name', auth()->user()->name) }}" placeholder="Nome do Administrador" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        </div>
                        <div>
                            <label for="nickname" class="block text-sm font-medium text-slate-600 mb-1">Nickname / Usuário <span class="text-red-500">*</span></label>
                            <input type="text" id="nickname" name="nickname" value="{{ old('nickname', auth()->user()->nickname) }}" placeholder="admin_nick" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        </div>
                    </div>
                </div>

                <hr class="border-slate-200">

                <div>
                    <h2 class="text-md font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        E-mail de Administrador
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="admin-field-1" class="block text-sm font-medium text-slate-600 mb-1">E-mail Atual</label>
                            <input id="admin-field-1" type="email" value="{{auth()->user()->email}}" disabled class="w-full px-4 py-2 border rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed">
                        </div>
                        <div>
                            <label for="new-email" class="block text-sm font-medium text-slate-600 mb-1">Novo E-mail <span class="text-slate-400 font-normal">(opcional)</span></label>
                            <input type="email" id="new-email" value="{{ old('email') ?? auth()->user()->email }}" name="email" placeholder="novo_admin@sistema.com" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        </div>
                    </div>
                </div>

                <hr class="border-slate-200">

                <div>
                    <h2 class="text-md font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        Nova Senha <span class="text-red-500">*</span>
                    </h2>
                    <div class="space-y-4">
                        <p class="text-sm text-slate-500">A nova senha deve ter pelo menos 8 caracteres e ser repetida no campo de confirmação.</p>
                        <div>
                            <label for="current-password" class="block text-sm font-medium text-slate-600 mb-1">Senha Temporária / Atual</label>
                            <input type="password" id="current-password"  name="current_password" placeholder="••••••••" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label for="new-password" class="block text-sm font-medium text-slate-600 mb-1">Nova Senha <span class="text-red-500">*</span></label>
                                <input type="password" id="new-password"  name="password" placeholder="••••••••" required minlength="8" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                            </div>
                            <div>
                                <label for="confirm-password" class="block text-sm font-medium text-slate-600 mb-1">Confirmar Nova Senha <span class="text-red-500">*</span></label>
                                <input type="password" id="confirm-password" name="password_confirmation" placeholder="••••••••" required minlength="8" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end pt-4">
                        <button type="submit" class="px-6 py-2.5 font-medium rounded-lg transition shadow-md bg-blue-600 text-white hover:bg-blue-700">Salvar e verificar e-mail</button>
                </div>
            </form>
</section>

</x-admin.layout>
