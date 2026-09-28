export const adminSections = {
    catalog: [
        ['admin.catalog.index', 'Acervo'],
        ['admin.books.list', 'Livros'],
        ['admin.books.index', 'Cadastrar livro'],
        ['admin.books.create', 'Disponibilidade'],
    ],
    categories: [
        ['admin.categories.index', 'Categorias'],
        ['admin.genres.index', 'Gêneros'],
        ['admin.authors.index', 'Autores'],
        ['admin.availability.index', 'Disponibilidades'],
    ],
    settings: [
        ['admin.settings.index', 'Configurações'],
        ['admin.credentials.edit', 'Perfil'],
        ['admin.settings.email.edit', 'E-mail'],
        ['admin.settings.password.edit', 'Senha'],
        ['admin.admins.index', 'Administradores'],
    ],
};

export const adminNavigation = [
    { id: 'dashboard', route: 'admin.dashboard', label: 'Início', icon: 'fa-solid fa-house' },
    { id: 'catalog', route: 'admin.catalog.index', label: 'Acervo', icon: 'fa-solid fa-book-open' },
    { id: 'categories', route: 'admin.categories.index', label: 'Categorias', icon: 'fa-solid fa-layer-group' },
    { id: 'settings', route: 'admin.settings.index', label: 'Config', icon: 'fa-solid fa-gear' },
];
