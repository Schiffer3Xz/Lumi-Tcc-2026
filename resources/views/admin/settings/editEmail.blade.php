<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alterar E-mail</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 flex items-center justify-center min-h-screen">

    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 mx-4 border border-gray-100">
        <!-- Header -->
        <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-4">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round5" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                </svg>
            </div>
            <h1 class="text-2xl font-bold text-gray-900">Alterar e-mail</h1>
            <p class="text-sm text-gray-500 mt-1">Atualize o endereço de e-mail associado à sua conta.</p>
        </div>

        <!-- Form -->
        <form class="space-y-5" action="{{route('email.update')}}" method="POST">
            @csrf
            @method('PUT')
            <!-- Current Email (Read-only) -->
            <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">E-mail atual</label>
                <input type="email" value="{{auth()->user()->email}}" disabled class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 text-sm cursor-not-allowed">
            </div>

            <!-- New Email -->
            <div>
                <label for="new-email" class="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Novo e-mail</label>
                <input type="email" name="email" id="new-email" required placeholder="seu.novo@email.com" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm text-gray-900">
            </div>

            <!-- Confirm Password for Security -->
            <div>
                <label for="password" class="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Senha atual (para confirmar)</label>
                <input type="password" name="current_password" id="password" required placeholder="••••••••" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm text-gray-900">
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center space-x-3 pt-2">
                <a href="{{ route('adminPanel') }}"
                class="w-1/2 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition text-sm text-center">
                    Cancelar
                </a>
                <button type="submit" class="w-1/2 px-4 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition text-sm shadow-sm">
                    Salvar alteração
                </button>
            </div>
        </form>
    </div>

</body>
</html>