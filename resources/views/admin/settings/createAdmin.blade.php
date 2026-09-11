<x-admin.layout title="Criar Administrador">
<div class="w-full max-w-xl mx-auto space-y-8 rounded-xl bg-white p-8 shadow-sm border border-slate-200">
        <div>
            <h2 class="text-center text-2xl font-bold tracking-tight text-slate-800">
                Novo Administrador
            </h2>
            <p class="mt-2 text-center text-sm text-slate-400">
                Cadastre as credenciais de acesso para o novo painel
            </p>
        </div>

        <form class="mt-8 space-y-6" action="{{route('admin.admins.store')}}" method="POST">
            @csrf
            <div class="space-y-4 rounded-md shadow-sm">
                <div>
                    <label for="admin-name" class="block text-sm font-medium text-slate-600">Nome Completo</label>
                    <input id="admin-name"
                        type="text"
                        name="name"
                        required
                        placeholder="Ex: João da Silva"
                        class="mt-1 block w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label for="admin-nickname" class="block text-sm font-medium text-slate-600">Nickname</label>
                    <input id="admin-nickname"
                        type="text"
                        name="nickname"
                        required
                        placeholder="Ex: joaosilva"
                        class="mt-1 block w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label for="admin-email" class="block text-sm font-medium text-slate-600">E-mail Inicial</label>
                    <input id="admin-email"
                        type="email"
                        name="email"
                        required
                        placeholder="admin@exemplo.com"
                        class="mt-1 block w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label for="admin-password" class="block text-sm font-medium text-slate-600">Senha Provisória</label>
                    <input id="admin-password"
                        type="password"
                        name="password"
                        required
                        placeholder="••••••••"
                        class="mt-1 block w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                    />
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    class="group relative flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white bg-blue-600 text-white hover:bg-blue-700"
                >
                    Criar Administrador
                </button>
            </div>
        </form>
    </div>

</x-admin.layout>
