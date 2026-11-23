import BookCover from '@/features/books/BookCover';
import { useEffect, useState } from 'react';

const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');

export default function PostBookPicker({ id, books = [], endpoint, onSelect, disabled, selectedIds = [] }) {
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(false);
    const search = query.trim();

    useEffect(() => {
        if (!endpoint) return;
        const controller = new AbortController();
        const timeout = setTimeout(async () => {
            try {
                const url = new URL(endpoint);
                url.search = new URLSearchParams({ q: search, page }).toString();
                const response = await fetch(url, { headers: { Accept: 'application/json' }, signal: controller.signal });
                if (!response.ok) throw new Error();
                setResults(await response.json());
            } catch {
                if (!controller.signal.aborted) setError(true);
            }
        }, search ? 250 : 0);

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [endpoint, search, page]);

    const visibleBooks = endpoint
        ? results?.books ?? []
        : books.filter((book) => normalize(`${book.title} ${book.author || ''}`).includes(normalize(search)));

    function selectPage(value) {
        setResults(null);
        setError(false);
        setPage(value);
    }

    return (
        <section id={id} aria-label="Selecionar livro de referência" className="space-y-3 rounded-xl border border-blue-100 bg-blue-50/40 p-3">
            <label htmlFor={`${id}-search`} className="block text-xs font-semibold text-slate-700">Buscar livro no acervo</label>
            <input
                id={`${id}-search`}
                type="search"
                autoFocus
                value={query}
                onChange={(event) => {
                    if (event.target.value.trim() !== search || page !== 1) selectPage(1);
                    setQuery(event.target.value);
                }}
                placeholder="Buscar por título ou autor..."
                disabled={disabled}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <ul className="max-h-64 space-y-1 overflow-y-auto" aria-label="Livros do acervo">
                {visibleBooks.map((book) => (
                    <li key={book.id}>
                        <button
                            type="button"
                            disabled={disabled || selectedIds.includes(book.id)}
                            onClick={() => onSelect(book)}
                            className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-white focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"
                        >
                            <span className="flex h-12 w-9 shrink-0 overflow-hidden rounded">
                                <BookCover book={book} />
                            </span>
                            <span className="min-w-0">
                                <span className="block truncate text-xs font-semibold text-slate-800">{book.title}</span>
                                <span className="block text-xs text-slate-500">{book.author || 'Autor não informado'}</span>
                            </span>
                        </button>
                    </li>
                ))}
            </ul>
            {error && <p role="alert" className="text-xs text-red-700">Não foi possível buscar os livros.</p>}
            {endpoint && !results && !error && <p role="status" className="text-xs text-slate-500">Buscando livros…</p>}
            {(!endpoint || results) && !visibleBooks.length && <p role="status" className="text-xs text-slate-500">Nenhum livro encontrado.</p>}
            {endpoint && (page > 1 || results?.hasMore) && (
                <nav aria-label="Páginas de livros" className="flex justify-between text-xs font-semibold text-blue-700">
                    <button type="button" disabled={page === 1} onClick={() => selectPage(page - 1)} className="disabled:opacity-40">Anterior</button>
                    <button type="button" disabled={!results?.hasMore} onClick={() => selectPage(page + 1)} className="disabled:opacity-40">Próxima</button>
                </nav>
            )}
        </section>
    );
}
