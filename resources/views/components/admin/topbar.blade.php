<header class="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md sm:px-6">
    <div class="flex min-w-0 items-center gap-3">
        <button type="button" data-admin-menu aria-controls="admin-sidebar" aria-expanded="false" aria-label="Abrir navegação" class="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"><i class="fa-solid fa-bars text-xl" aria-hidden="true"></i></button>
        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs"><i class="fa-solid fa-book-open" aria-hidden="true"></i></div>
        <div><p class="text-sm font-bold leading-tight text-slate-800">Sala de Leitura</p><p class="hidden text-[11px] font-medium text-slate-400 sm:block">Plataforma Escolar Web</p></div>
    </div>
    <div class="flex items-center gap-3 sm:gap-4">
        <span class="hidden rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-bold tracking-wide text-blue-600 sm:inline-flex">ADMINISTRADOR</span>
        <details data-admin-account class="relative">
            <summary class="flex cursor-pointer list-none items-center gap-2.5 rounded-full border border-slate-200/60 p-1 pr-3 text-slate-700 transition-colors hover:bg-slate-50">
                <span class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white">{{ mb_strtoupper(mb_substr(auth()->user()->name ?? 'A', 0, 1)) }}</span>
                <span class="hidden max-w-36 truncate text-xs font-semibold sm:block">{{ auth()->user()->name ?? 'Administrador' }}</span>
                <span class="sr-only">Menu da conta</span><i class="fa-solid fa-chevron-down text-[10px] text-slate-400" aria-hidden="true"></i>
            </summary>
            <div class="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-100 bg-white py-1.5 shadow-xl">
                <div class="border-b border-slate-100 px-4 py-2.5"><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Conta</p><p class="truncate text-xs font-bold text-slate-800">{{ auth()->user()->name ?? 'Administrador' }}</p></div>
                <a href="{{ route('admin.settings.index') }}" class="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"><i class="fa-solid fa-gear text-slate-400" aria-hidden="true"></i>Configurações</a>
                <form action="{{ route('logout') }}" method="POST">@csrf<button type="submit" class="flex w-full items-center gap-2.5 px-4 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50"><i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i>Sair da Conta</button></form>
            </div>
        </details>
    </div>
</header>
