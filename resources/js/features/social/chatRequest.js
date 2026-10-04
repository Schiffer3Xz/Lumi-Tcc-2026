export default async function chatRequest(url, options = {}) {
    // Inertia keeps the document head after login, while Laravel rotates the
    // session token. Read the current cookie for each request, like Inertia.
    const cookie = document.cookie
        .split(';')
        .map((entry) => entry.trim())
        .find((entry) => entry.startsWith('XSRF-TOKEN='));
    const csrfHeaders = cookie
        ? { 'X-XSRF-TOKEN': decodeURIComponent(cookie.slice('XSRF-TOKEN='.length)) }
        : { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '' };
    const response = await fetch(url, {
        ...options,
        credentials: 'same-origin',
        headers: { Accept: 'application/json', ...options.headers, ...csrfHeaders },
    });
    if (response.ok) {
        if (response.redirected) {
            throw new Error('Entre com uma conta de leitor e abra novamente a conversa.');
        }
        return response;
    }

    const errors = {
        401: 'Sua sessão terminou. Entre novamente para continuar.',
        419: 'Sua sessão expirou. Atualize a página e tente novamente.',
        403: 'Você não tem mais acesso a esta conversa.',
        404: 'Esta conversa ou este leitor não está mais disponível.',
        422: 'Confira a mensagem. Ela deve ter entre 1 e 5.000 caracteres.',
    };
    throw new Error(errors[response.status] ?? 'Não foi possível concluir a ação no chat. Tente novamente em instantes.');
}
