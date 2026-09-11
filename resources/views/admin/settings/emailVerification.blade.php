<x-admin.layout title="Verifique seu E-mail" :first-access="true" :step="2">
<div class="bg-white/90 p-6 sm:p-10 rounded-3xl shadow-sm w-full max-w-2xl text-center border border-slate-100">
        <!-- Ícone -->
        <div class="mx-auto bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
            <svg class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
        </div>

        <!-- Título e Texto -->
        <h1 class="text-2xl font-bold text-slate-800 mb-3">Verifique seu e-mail</h1>
        <p class="text-slate-600 mb-8">
            Confirme o endereço <strong>{{ auth()->user()->email }}</strong> pelo link de verificação para continuar o acesso ao sistema.
        </p>
        @if (session('status') === 'verification-link-sent')
            <p role="status" class="mb-6 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">Link de verificação enviado. Confira sua caixa de entrada e a pasta de spam.</p>
        @endif

        <!-- Botões -->
        <div class="space-y-3">
            <a href="{{ route('admin.dashboard') }}" class="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200">
                Já confirmei meu e-mail. Continuar
            </a>
            <form method="post" action="{{ route('verification.send') }}">
                @csrf
                <button type="submit" class="w-full text-slate-500 hover:text-slate-700 font-medium py-2 transition duration-200">Não recebeu o e-mail? Reenviar</button>
            </form>
            <form method="post" action="{{ route('logout') }}">
                @csrf
                <button type="submit" class="text-sm text-slate-500 underline">Sair</button>
            </form>
        </div>
    </div>

</x-admin.layout>
