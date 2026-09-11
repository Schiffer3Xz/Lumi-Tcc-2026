<x-admin.layout title="Alterar E-mail">
<div class="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
        <!-- Header -->
        <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 mb-4">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round5" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                </svg>
            </div>
            <h1 class="text-2xl font-bold text-slate-900">Alterar e-mail</h1>
            <p class="text-sm text-slate-500 mt-1">Atualize o endereço de e-mail associado à sua conta.</p>
        </div>

        <!-- Form -->
        <form class="space-y-5" action="{{route('admin.settings.email.update')}}" method="POST">
            @csrf
            @method('PUT')
            <!-- Current Email (Read-only) -->
            <div>
                <label for="admin-field-1" class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">E-mail atual</label>
                <input id="admin-field-1" type="email" value="{{auth()->user()->email}}" disabled class="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-100 text-slate-500 text-sm cursor-not-allowed">
            </div>

            <!-- New Email -->
            <div>
                <label for="new-email" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">Novo e-mail</label>
                <input type="email" name="email" id="new-email" required placeholder="seu.novo@email.com" class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm text-slate-900">
            </div>

            <!-- Confirm Password for Security -->
            <div>
                <label for="password" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">Senha atual (para confirmar)</label>
                <input type="password" name="current_password" id="password" required placeholder="••••••••" class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm text-slate-900">
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center space-x-3 pt-2">
                <a href="{{ route('admin.dashboard') }}"
                class="w-1/2 px-4 py-3 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition text-sm text-center">
                    Cancelar
                </a>
                <button type="submit" class="w-1/2 px-4 py-3 rounded-lg font-medium transition text-sm shadow-sm bg-blue-600 text-white hover:bg-blue-700">
                    Salvar alteração
                </button>
            </div>
        </form>
    </div>

</x-admin.layout>
