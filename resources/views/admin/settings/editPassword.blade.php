<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alterar Senha</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 flex items-center justify-center min-h-screen">

    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 mx-4 border border-gray-100">
        <!-- Header -->
        <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-4">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                </svg>
            </div>
            <h1 class="text-2xl font-bold text-gray-900">Alterar senha</h1>
            <p class="text-sm text-gray-500 mt-1">Sua nova senha deve ser diferente da senha anterior.</p>
        </div>

        <!-- Form -->
        <form class="space-y-5" action="{{route('password.update')}}" method="POST">
            @csrf
            @method('PUT')
            <!-- Current Password -->
            <div>
                <label for="current-password" class="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Senha atual</label>
                <input type="password" name="current_password" id="current-password" required placeholder="••••••••" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm text-gray-900">
            </div>

            <!-- New Password -->
            <div>
                <label for="new-password" class="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Nova senha</label>
                <input type="password" name="password" id="new-password" required placeholder="••••••••" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm text-gray-900">
            </div>

            <!-- Confirm New Password -->
            <div>
                <label for="confirm-password" class="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Confirmar nova senha</label>
                <input type="password" name="password_confirmation" id="confirm-password" required placeholder="••••••••" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm text-gray-900">
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center space-x-3 pt-2">
                <button type="button" class="w-1/2 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition text-sm">
                    Cancelar
                </button>
                <button type="submit" class="w-1/2 px-4 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition text-sm shadow-sm">
                    Atualizar senha
                </button>
            </div>
        </form>
    </div>

</body>
</html>