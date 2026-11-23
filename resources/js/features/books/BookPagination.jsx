export default function BookPagination({ pagination, onPageChange }) {
    const { currentPage, totalPages } = pagination;
    if (totalPages <= 1) return null;

    const pageNumbers = [...new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages])].filter(
        (value) => value >= 1 && value <= totalPages,
    );

    return (
        <nav aria-label="Páginas do catálogo" className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-5">
            <p className="text-sm text-slate-500">
                Página {currentPage} de {totalPages}
            </p>
            <div className="flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Anterior
                </button>
                {pageNumbers.map((value, index) => (
                    <span key={value} className="flex items-center gap-2">
                        {index > 0 && value - pageNumbers[index - 1] > 1 && (
                            <span className="text-slate-400" aria-hidden="true">
                                …
                            </span>
                        )}
                        <button
                            type="button"
                            aria-label={`Página ${value}`}
                            aria-current={value === currentPage ? 'page' : undefined}
                            onClick={() => onPageChange(value)}
                            className={`min-w-10 rounded-xl border px-3 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${value === currentPage ? 'border-lumi-navy bg-lumi-navy text-yellow-300' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                        >
                            {value}
                        </button>
                    </span>
                ))}
                <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Próxima
                </button>
            </div>
        </nav>
    );
}
