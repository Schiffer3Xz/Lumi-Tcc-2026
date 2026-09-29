import { Link } from '@inertiajs/react';

export default function AdminPagination({ pagination }) {
    return (
        <nav aria-label="Paginação" className="mt-5 flex flex-wrap items-center justify-between gap-4 text-sm text-slate-600">
            <p role="status">
                {pagination.total ? `${pagination.from}–${pagination.to} de ${pagination.total} registros` : 'Nenhum registro encontrado'}
            </p>
            {pagination.last_page > 1 && (
                <div className="flex flex-wrap items-center gap-3">
                    {pagination.prev_page_url ? (
                        <Link href={pagination.prev_page_url} preserveScroll className="admin-button-secondary" rel="prev">
                            Anterior
                        </Link>
                    ) : (
                        <span aria-disabled="true" className="admin-button-secondary opacity-50">
                            Anterior
                        </span>
                    )}
                    <span>
                        Página {pagination.current_page} de {pagination.last_page}
                    </span>
                    {pagination.next_page_url ? (
                        <Link href={pagination.next_page_url} preserveScroll className="admin-button-secondary" rel="next">
                            Próxima
                        </Link>
                    ) : (
                        <span aria-disabled="true" className="admin-button-secondary opacity-50">
                            Próxima
                        </span>
                    )}
                </div>
            )}
        </nav>
    );
}
