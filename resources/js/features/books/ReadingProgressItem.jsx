export default function ReadingProgressItem({ progress, currentPage, onChange, onRemove, disabled }) {
    const { book } = progress;
    const pageCount = Number(book.page_count || 0);
    const percentage = pageCount ? Math.min(100, Math.round((currentPage / pageCount) * 100)) : 0;

    return (
        <article className="rounded-xl border border-slate-200 p-3">
            <div className="flex gap-3">
                <div className="flex h-20 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 text-slate-400">
                    {book.cover_url ? (
                        <img src={book.cover_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                        <i className="fa-solid fa-book" aria-hidden="true" />
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex gap-2">
                        <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-bold text-slate-800">{book.title}</h3>
                            <p className="truncate text-xs text-slate-500">{book.author || 'Autor não informado'}</p>
                        </div>
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={onRemove}
                            aria-label={`Remover ${book.title} do progresso`}
                            className="h-9 w-9 shrink-0 rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        >
                            <i className="fa-solid fa-trash-can text-xs" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-1 text-xs font-semibold text-slate-600">
                        <span>
                            Página {currentPage} de {pageCount || '-'}
                        </span>
                        <span>{percentage}%</span>
                    </div>
                    <label className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
                        <span>Página atual</span>
                        <input
                            type="number"
                            inputMode="numeric"
                            min="0"
                            max={pageCount || 0}
                            step="1"
                            value={currentPage}
                            onChange={(event) => {
                                const page = event.target.valueAsNumber;
                                if (Number.isFinite(page)) onChange(Math.max(0, Math.min(pageCount, Math.trunc(page))));
                                else if (event.target.value === '') onChange(0);
                            }}
                            disabled={disabled || !pageCount}
                            aria-label={`Página atual de ${book.title}`}
                            className="focus:border-lumi-progress focus:ring-lumi-progress/20 w-20 rounded-lg border border-slate-200 px-2 py-2 text-sm text-slate-800 outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <span>de {pageCount || '-'}</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max={pageCount || 0}
                        value={Math.min(currentPage, pageCount || 0)}
                        onChange={(event) => onChange(Number(event.target.value))}
                        disabled={disabled || !pageCount}
                        aria-label={`Página atual de ${book.title}`}
                        aria-valuetext={`${currentPage} de ${pageCount} páginas`}
                        className="accent-lumi-progress-strong mt-1 h-6 w-full cursor-pointer disabled:cursor-not-allowed"
                    />
                </div>
            </div>
        </article>
    );
}
