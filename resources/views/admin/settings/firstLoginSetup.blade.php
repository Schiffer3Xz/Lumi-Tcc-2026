<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Configuração Inicial - Primeiro Acesso</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 font-sans antialiased">

    <div class="min-h-screen flex items-center justify-center p-6">
        <div class="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
            
            <div class="border-b pb-4 mb-6">
                    <h1 class="text-2xl font-bold text-gray-800">Bem-vindo, Administrador</h1>
                    <p class="text-sm text-gray-500">
                        Por motivos de segurança, é obrigatório alterar sua senha e configurar seu perfil no primeiro acesso.
                    </p>
            </div>

            <div class="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
                <div class="flex items-center">
                    <svg class="w-5 h-5 text-amber-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    <span class="text-sm font-medium text-amber-800">Você deve preencher os dados do perfil e definir uma nova senha para continuar.</span>
                </div>
            </div>

            <form action="{{route('update.settings')}}" method="post">
                @csrf
                
                <div>
                    <h2 class="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.656 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Informações Pessoais
                    </h2>

                    <div class="mb-4 flex items-center gap-4">
                        <div class="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                            <img id="preview-foto" src="" alt="Preview" class="w-full h-full object-cover hidden">
                            <svg id="default-avatar" class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.18a8.25 8.25 0 0115.0 0"></path></svg>
                        </div>
                        <div class="flex-1">
                            <label class="block text-sm font-medium text-gray-600 mb-1">Foto de Perfil <span class="text-gray-400 font-normal">(opcional)</span></label>
                            <input type="file" id="profile-picture" accept="image/*" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-600 mb-1">Nome Completo <span class="text-red-500">*</span></label>
                            <input type="text" id="full-name" name="name" placeholder="Nome do Administrador" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-600 mb-1">Nickname / Usuário <span class="text-red-500">*</span></label>
                            <input type="text" id="nickname"  name="nickname" placeholder="admin_nick" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        </div>
                    </div>
                </div>

                <hr class="border-gray-200">

                <div>
                    <h2 class="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        E-mail de Administrador
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-600 mb-1">E-mail Atual</label>
                            <input type="email" value="{{auth()->user()->email}}" disabled class="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-600 mb-1">Novo E-mail <span class="text-gray-400 font-normal">(opcional)</span></label>
                            <input type="email" id="new-email" value="{{ old('email') ?? auth()->user()->email }}" name="email" placeholder="novo_admin@sistema.com" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        </div>
                    </div>
                </div>

                <hr class="border-gray-200">

                <div>
                    <h2 class="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        Nova Senha <span class="text-red-500">*</span>
                    </h2>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-600 mb-1">Senha Temporária / Atual</label>
                            <input type="password" id="current-password"  name="current_password" placeholder="••••••••" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-600 mb-1">Nova Senha <span class="text-red-500">*</span></label>
                                <input type="password" id="new-password"  name="password" placeholder="••••••••" required minlength="8" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-600 mb-1">Confirmar Nova Senha <span class="text-red-500">*</span></label>
                                <input type="password" id="confirm-password" name="password_confirmation" placeholder="••••••••" required minlength="8" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end pt-4">
                        <button type="submit" class="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-md">Salvar e Acessar o Painel</button>
                </div>
            </form>

        </div>
    </div>
</body>
</html>