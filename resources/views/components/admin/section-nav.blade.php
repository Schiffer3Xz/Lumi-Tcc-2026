@php
    $links = [];
    if (request()->routeIs('admin.categories.*', 'admin.genres.*', 'admin.authors.*', 'admin.availability.*')) {
        $links = ['admin.categories.index' => 'Categorias', 'admin.genres.index' => 'Gêneros', 'admin.authors.index' => 'Autores', 'admin.availability.index' => 'Disponibilidades'];
    } elseif (request()->routeIs('admin.catalog.*', 'admin.books.*')) {
        $links = ['admin.catalog.index' => 'Acervo', 'admin.books.list' => 'Livros', 'admin.books.index' => 'Cadastrar livro', 'admin.books.create' => 'Disponibilidade'];
    } elseif (request()->routeIs('admin.settings.*', 'admin.admins.*', 'admin.credentials.*')) {
        $links = ['admin.settings.index' => 'Configurações', 'admin.credentials.edit' => 'Perfil', 'admin.settings.email.edit' => 'E-mail', 'admin.settings.password.edit' => 'Senha', 'admin.admins.index' => 'Administradores'];
    }
@endphp
@if ($links)
    <nav aria-label="Navegação da seção" class="mb-6 flex flex-wrap gap-2">
        @foreach ($links as $routeName => $label)
            <a href="{{ route($routeName) }}" @if (request()->routeIs($routeName)) aria-current="page" @endif class="rounded-full border px-4 py-2 text-xs font-medium transition-colors {{ request()->routeIs($routeName) ? 'border-[#1A2332] bg-[#1A2332] text-yellow-300' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50' }}">{{ $label }}</a>
        @endforeach
    </nav>
@endif
