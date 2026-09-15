export const READER_NAVIGATION = [
    { id: 'home', label: 'Home', icon: 'fa-solid fa-house', routeName: 'dashboard' },
    { id: 'biblioteca', label: 'Catálogo', icon: 'fa-solid fa-book-open', routeName: 'catalogo' },
    { id: 'estante', label: 'Estante', icon: 'fa-solid fa-book-bookmark', routeName: 'shelf' },
    { id: 'usuarios', label: 'Social', icon: 'fa-solid fa-users', routeName: 'list' },
    { id: 'config', label: 'Perfil', icon: 'fa-solid fa-user', routeName: 'profile' },
];

export const ACCOUNT_NAVIGATION = [
    { id: 'privacy', label: 'Privacidade', icon: 'fa-solid fa-shield-halved', routeName: 'privacy' },
    { id: 'settings', label: 'Configurações', icon: 'fa-solid fa-gear', routeName: 'profile.edit' },
    { id: 'logout', label: 'Sair da Conta', icon: 'fa-solid fa-right-from-bracket', routeName: 'logout', method: 'post', as: 'button' },
];
