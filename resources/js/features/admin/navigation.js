export const adminSections = {
    catalog: [
        ['admin.books.list', 'Editar livros'],
        ['admin.books.index', 'Cadastrar livro'],
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
    { id: 'catalog', route: 'admin.books.list', label: 'Acervo', icon: 'fa-solid fa-book-open' },
    { id: 'availability', route: 'admin.books.create', label: 'Status', icon: 'fa-solid fa-rotate' },
    { id: 'categories', route: 'admin.categories.index', label: 'Cadastros', icon: 'fa-solid fa-layer-group' },
    { id: 'reports', route: 'admin.reports.index', label: 'Denúncias', icon: 'fa-solid fa-flag' },
    { id: 'settings', route: 'admin.settings.index', label: 'Config', icon: 'fa-solid fa-gear' },
];
