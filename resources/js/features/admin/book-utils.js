export function coverUrl(path) {
    if (!path) return null;
    return /^(https?:\/\/|\/)/.test(path) ? path : `/storage/${path}`;
}
