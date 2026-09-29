export const reportStatuses = [
    { value: 'pending', label: 'Pendentes', singular: 'Pendente', color: 'border-amber-200 bg-amber-50 text-amber-800' },
    { value: 'reviewed', label: 'Analisadas', singular: 'Analisada', color: 'border-emerald-200 bg-emerald-50 text-emerald-800' },
    { value: 'dismissed', label: 'Arquivadas', singular: 'Arquivada', color: 'border-slate-200 bg-slate-100 text-slate-700' },
];

export function reportDate(value) {
    return value
        ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' }).format(new Date(value))
        : '—';
}
