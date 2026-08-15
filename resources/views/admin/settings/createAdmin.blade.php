<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Criar Administrador</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="flex min-h-screen items-center justify-center bg-gray-900 px-4 py-12">
    <div class="w-full max-w-md space-y-8 rounded-xl bg-gray-800 p-8 shadow-2xl border border-gray-700">
        <div>
            <h2 class="text-center text-3xl font-extrabold tracking-tight text-white">
                Novo Administrador
            </h2>
            <p class="mt-2 text-center text-sm text-gray-400">
                Cadastre as credenciais de acesso para o novo painel
            </p>
        </div>

        <form class="mt-8 space-y-6" action="{{route('admin.admins.store')}}" method="POST">
            @csrf
            <div class="space-y-4 rounded-md shadow-sm">
                <div>
                    <label class="block text-sm font-medium text-gray-300">Nome Completo</label>
                    <input
                        type="text"
                        name="name"
                        required
                        placeholder="Ex: João da Silva"
                        class="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-300">Nickname</label>
                    <input
                        type="text"
                        name="nickname"
                        required
                        placeholder="Ex: joaosilva"
                        class="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-300">E-mail Inicial</label>
                    <input
                        type="email"
                        name="email"
                        required
                        placeholder="admin@exemplo.com"
                        class="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-300">Senha Provisória</label>
                    <input
                        type="password"
                        name="password"
                        required
                        placeholder="••••••••"
                        class="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                    Criar Administrador
                </button>
            </div>
        </form>
    </div>
</body>
</html>