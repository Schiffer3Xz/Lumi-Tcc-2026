@php
    $items = [
        ['route' => 'admin.dashboard', 'pattern' => 'admin.dashboard', 'label' => 'Início', 'icon' => 'fa-house'],
        ['route' => 'admin.catalog.index', 'pattern' => 'admin.books.*,admin.catalog.*', 'label' => 'Acervo', 'icon' => 'fa-book-open'],
        ['route' => 'admin.categories.index', 'pattern' => 'admin.categories.*,admin.genres.*,admin.authors.*,admin.availability.*', 'label' => 'Categorias', 'icon' => 'fa-layer-group'],
        ['route' => 'admin.settings.index', 'pattern' => 'admin.settings.*,admin.admins.*,admin.credentials.*', 'label' => 'Config', 'icon' => 'fa-gear'],
    ];
@endphp
<button type="button" data-admin-overlay hidden aria-label="Fechar navegação" class="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"></button>
<aside id="admin-sidebar" aria-label="Navegação administrativa" class="fixed left-0 top-0 z-50 flex h-screen w-20 shrink-0 -translate-x-full flex-col items-center gap-8 bg-[#1A2332] py-6 transition-transform duration-300 ease-in-out lg:sticky lg:translate-x-0">
    <a href="{{ route('admin.dashboard') }}" aria-label="Sala de Leitura — início" class="text-2xl text-yellow-300"><i class="fa-solid fa-feather-pointed" aria-hidden="true"></i></a>
    <nav class="flex flex-1 flex-col gap-3">
        @foreach ($items as $item)
            @php($active = request()->routeIs(...explode(',', $item['pattern'])))
            <a href="{{ route($item['route']) }}" title="{{ $item['label'] }}" @if ($active) aria-current="page" @endif class="relative flex flex-col items-center gap-1 rounded-xl px-2 py-3 transition-all duration-200 {{ $active ? 'bg-yellow-300/10 text-yellow-300' : 'text-slate-400 hover:bg-white/5 hover:text-white' }}">
                @if ($active)<span aria-hidden="true" class="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-yellow-300"></span>@endif
                <i class="fa-solid {{ $item['icon'] }} text-lg" aria-hidden="true"></i>
                <span class="text-[10px] font-medium">{{ $item['label'] }}</span>
            </a>
        @endforeach
    </nav>
    <form action="{{ route('logout') }}" method="POST">
        @csrf
        <button type="submit" title="Sair da conta" aria-label="Sair da conta" class="rounded-xl p-3 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"><i class="fa-solid fa-right-from-bracket text-lg" aria-hidden="true"></i></button>
    </form>
</aside>
