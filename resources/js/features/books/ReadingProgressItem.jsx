import '../../../css/reading-progress.css';

export default function ReadingProgressItem({ progress, currentPage, onChange, onRemove, disabled }) {
    const { book } = progress;
    const pageCount = Number(book.page_count || 0);
    const percentage = pageCount ? Math.min(100, Math.round((currentPage / pageCount) * 100)) : 0;
    const complete = pageCount > 0 && currentPage >= pageCount;

    return (
        <article className="reading-card">
            <div className="flex items-start gap-4">
                <div className="reading-card-cover">
                    {book.cover_url ? (
                        <img src={book.cover_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                        <i className="fa-solid fa-book-open" aria-hidden="true" />
                    )}
                </div>
                <div className="min-w-0 flex-1 pt-1">
                    <p className={`reading-card-status ${complete ? 'is-complete' : ''}`}>
                        <span aria-hidden="true" />
                        {complete ? 'Leitura concluída' : currentPage > 0 ? 'Em leitura' : 'Próxima leitura'}
                    </p>
                    <h3 className="text-lumi-navy mt-2 text-sm leading-snug font-bold">{book.title}</h3>
                    <p className="mt-1 truncate text-xs text-slate-500">{book.author || 'Autor não informado'}</p>
                </div>
                <button
                    type="button"
                    disabled={disabled}
                    onClick={onRemove}
                    aria-label={`Remover ${book.title} do progresso`}
                    className="reading-card-remove"
                >
                    <i className="fa-solid fa-trash-can text-xs" aria-hidden="true" />
                </button>
            </div>
            <div className="reading-card-controls">
                <div className="flex items-center justify-between gap-3">
                    <label className="flex min-w-0 flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>Página</span>
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
                            className="reading-page-input"
                        />
                        <span>de {pageCount || '—'}</span>
                    </label>
                </div>
                <input
                    type="range"
                    min="0"
                    max={pageCount || 0}
                    value={Math.min(currentPage, pageCount || 0)}
                    onChange={(event) => onChange(Number(event.target.value))}
                    disabled={disabled || !pageCount}
                    aria-label={`Ajustar progresso de ${book.title}`}
                    aria-valuetext={`${currentPage} de ${pageCount} páginas`}
                    style={{ '--reading-percentage': `${percentage}%` }}
                    className="reading-progress-slider"
                />
                <div className="reading-card-footer">
                    <p className="text-caption-sm text-slate-500">
                        {complete
                            ? 'Mais uma história na sua estante.'
                            : currentPage > 0
                              ? `${Math.max(0, pageCount - currentPage)} páginas para a próxima conquista`
                              : 'Toda história começa na primeira página.'}
                    </p>
                    <div
                        className={`reading-progress-ring ${complete ? 'is-complete' : ''}`}
                        role="meter"
                        aria-label={`Progresso de ${book.title}`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={percentage}
                    >
                        <svg viewBox="0 0 48 48" aria-hidden="true">
                            <circle className="reading-ring-track" cx="24" cy="24" r="20" />
                            <circle
                                className="reading-ring-value"
                                cx="24"
                                cy="24"
                                r="20"
                                pathLength="100"
                                strokeDasharray="100"
                                strokeDashoffset={100 - percentage}
                            />
                        </svg>
                        <span aria-hidden="true">{percentage}%</span>
                    </div>
                </div>
            </div>
        </article>
    );
}
