import SearchBar from '@/components/shared/SearchBar';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { reportStatuses } from './report-utils';

export default function ReportFilters({ filters, counts }) {
    const [query, setQuery] = useState(filters.q);
    const total = Object.values(counts).reduce((sum, value) => sum + value, 0);
    return (
        <div className="mb-6 space-y-4">
            <nav aria-label="Filtrar denúncias por situação" className="flex flex-wrap gap-2">
                {[{ value: 'all', label: 'Todas' }, ...reportStatuses].map((option) => (
                    <Link
                        key={option.value}
                        href={route('admin.reports.index', { status: option.value, q: filters.q || undefined })}
                        preserveScroll
                        aria-current={filters.status === option.value ? 'page' : undefined}
                        className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${filters.status === option.value ? 'border-lumi-navy bg-lumi-navy text-yellow-300' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                    >
                        {option.label}
                        <span className="text-xs opacity-80">{option.value === 'all' ? total : counts[option.value]}</span>
                    </Link>
                ))}
            </nav>
            <form
                role="search"
                className="flex max-w-2xl flex-wrap gap-3"
                onSubmit={(event) => {
                    event.preventDefault();
                    router.get(
                        route('admin.reports.index'),
                        { status: filters.status, q: query.trim() },
                        { preserveState: true, preserveScroll: true },
                    );
                }}
            >
                <SearchBar
                    label="Buscar por motivo ou denunciante"
                    placeholder="Motivo ou denunciante..."
                    type="search"
                    maxLength={120}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="min-w-48 flex-1"
                />
                <button type="submit" className="admin-button-primary">
                    Buscar
                </button>
                {filters.q && (
                    <Link href={route('admin.reports.index', { status: filters.status })} className="admin-button-secondary">
                        Limpar busca
                    </Link>
                )}
            </form>
        </div>
    );
}
