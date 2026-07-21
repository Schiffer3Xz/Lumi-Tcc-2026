<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifique seu E-mail</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 flex items-center justify-center min-h-screen p-4">

    <div class="bg-white p-8 md:p-12 rounded-2xl shadow-xl w-full max-w-md text-center border border-gray-100">
        <!-- Ícone -->
        <div class="mx-auto bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
            <svg class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
        </div>

        <!-- Título e Texto -->
        <h1 class="text-2xl font-bold text-gray-800 mb-3">Verifique seu e-mail</h1>
        <p class="text-gray-600 mb-8">
            Enviamos um link de confirmação para o seu e-mail. Por favor, acesse sua caixa de entrada para continuar o acesso ao sistema.
        </p>

        <!-- Botões -->
        <div class="space-y-3">
            <a href="#" class="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200">
                Abrir meu e-mail
            </a>
            <button class="w-full text-gray-500 hover:text-gray-700 font-medium py-2 transition duration-200">
                Não recebeu o e-mail? Reenviar
            </button>
        </div>
    </div>

</body>
</html>