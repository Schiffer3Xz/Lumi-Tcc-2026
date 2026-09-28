import SearchBar from '@/components/shared/SearchBar';
import { Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const normalize = (value) =>
    value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('pt-BR');

function AvailabilityBadge({ status }) {
    const colors = {
        disponivel: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        indisponivel: 'border-rose-200 bg-rose-50 text-rose-700',
        emprestado: 'border-amber-200 bg-amber-50 text-amber-700',
    };
    return (
        <span
            className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${colors[normalize(status)] ?? 'border-slate-200 bg-slate-100 text-slate-700'}`}
        >
            {status}
        </span>
    );
}

function BookRow({ book }) {
    return (
        <tr className="transition-colors hover:bg-slate-50/80">
            <th scope="row" className="px-5 py-5 text-left font-normal sm:px-8">
                <div className="flex items-center gap-4">
                    <div className="flex h-20 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 text-slate-400">
                        {book.cover_url ? (
                            <img src={book.cover_url} alt="" loading="lazy" className="h-full w-full object-cover" />
                        ) : (
                            <i className="fa-solid fa-book" aria-hidden="true" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <Link href={book.edit_url} className="font-bold text-slate-900 hover:text-blue-600">
                            {book.title}
                        </Link>
                        <p className="mt-1 text-sm text-slate-500">{book.author}</p>
                    </div>
                </div>
            </th>
            <td className="px-5 py-5">
                <AvailabilityBadge status={book.status} />
            </td>
            <td className="px-5 py-5 font-mono text-sm text-slate-500">#{String(book.id).padStart(4, '0')}</td>
            <td className="px-5 py-5 text-right sm:px-8">
                <Link
                    href={`${book.edit_url}#admin-fk_availability_id`}
                    aria-label={`Alterar disponibilidade de ${book.title}`}
                    className="inline-flex rounded-xl bg-blue-50 px-4 py-3 text-xs font-bold text-blue-700 transition-colors hover:bg-blue-600 hover:text-white"
                >
                    Alterar status
                </Link>
            </td>
        </tr>
    );
}

export default function BookAvailabilityManager({ books = [], dashboardUrl }) {
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('');
    const statuses = useMemo(() => [...new Set(books.map((book) => book.status))].sort((a, b) => a.localeCompare(b, 'pt-BR')), [books]);
    const filteredBooks = useMemo(
        () =>
            books.filter(
                (book) => (!status || book.status === status) && normalize(`${book.title} ${book.author}`).includes(normalize(query.trim())),
            ),
        [books, query, status],
    );

    return (
        <>
            <header className="mb-8 flex flex-col justify-between gap-6 xl:flex-row xl:items-center">
                <div>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold tracking-widest text-blue-600 uppercase">
                        Sistema de Biblioteca
                    </span>
                    <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Gestão de Acervo</h1>
                    <p className="mt-2 text-sm text-slate-500">Gerencie o status e a disponibilidade do seu catálogo.</p>
                </div>
                <div className="flex w-full flex-wrap items-center gap-3 xl:w-auto">
                    <SearchBar
                        type="search"
                        label="Buscar por título ou autor"
                        placeholder="Buscar título ou autor..."
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        className="min-w-48 xl:w-72"
                    />
                    <Link
                        href={dashboardUrl}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                    >
                        <i className="fa-solid fa-arrow-left" aria-hidden="true" />
                        Voltar
                    </Link>
                </div>
            </header>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div role="group" aria-label="Filtrar por disponibilidade" className="flex max-w-full min-w-0 flex-wrap gap-2">
                    {['', ...statuses].map((value) => (
                        <button
                            type="button"
                            key={value}
                            aria-pressed={status === value}
                            onClick={() => setStatus(value)}
                            className={`max-w-full rounded-xl border px-4 py-2.5 text-sm font-bold [overflow-wrap:anywhere] whitespace-normal transition-colors ${status === value ? 'border-lumi-navy bg-lumi-navy text-white shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                        >
                            {value || 'Todos'}
                        </button>
                    ))}
                </div>
                <p role="status" className="text-sm text-slate-500">
                    {filteredBooks.length} {filteredBooks.length === 1 ? 'título encontrado' : 'títulos encontrados'}
                </p>
            </div>
            {filteredBooks.length ? (
                <>
                    <p className="mb-2 text-xs text-slate-500 md:hidden">Deslize a tabela para acessar todas as informações.</p>
                    <div
                        role="region"
                        aria-label="Livros e disponibilidade"
                        tabIndex={0}
                        className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm"
                    >
                        <table className="w-full min-w-[680px] text-left">
                            <caption className="sr-only">Livros do acervo, disponibilidade e ações de edição</caption>
                            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-bold tracking-wide text-slate-500 uppercase">
                                <tr>
                                    <th scope="col" className="px-5 py-4 sm:px-8">
                                        Livro
                                    </th>
                                    <th scope="col" className="px-5 py-4">
                                        Status
                                    </th>
                                    <th scope="col" className="px-5 py-4">
                                        Registro
                                    </th>
                                    <th scope="col" className="px-5 py-4 text-right sm:px-8">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredBooks.map((book) => (
                                    <BookRow key={book.id} book={book} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
                    <i className="fa-solid fa-book-open mb-4 text-3xl text-slate-300" aria-hidden="true" />
                    <h2 className="font-bold text-slate-800">{books.length ? 'Nenhum livro encontrado' : 'Seu acervo está vazio'}</h2>
                    <p className="mt-2 text-sm text-slate-500">
                        {books.length ? 'Tente outro título ou altere os filtros.' : 'Os livros cadastrados aparecerão aqui.'}
                    </p>
                    {(query || status) && (
                        <button
                            type="button"
                            onClick={() => {
                                setQuery('');
                                setStatus('');
                            }}
                            className="mt-5 rounded-xl bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                        >
                            Limpar filtros
                        </button>
                    )}
                </div>
            )}
        </>
    );
}
