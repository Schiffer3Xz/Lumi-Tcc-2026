import BookCover from '@/features/books/BookCover';
import BookPagination from '@/features/books/BookPagination';
import useBookFilters from '@/features/books/useBookFilters';
import SearchBar from '@/components/shared/SearchBar';
import { Link } from '@inertiajs/react';
import { useRef } from 'react';

const normalize = (value) =>
    String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('pt-BR');

function AvailabilityBadge({ status }) {
    const colors = {
        disponivel: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        indisponivel: 'border-rose-200 bg-rose-50 text-rose-700',
        emprestado: 'border-amber-200 bg-amber-50 text-amber-700',
        'a confirmar': 'border-sky-200 bg-sky-50 text-sky-700',
    };

    return (
        <span
            className={`inline-flex max-w-full rounded-full border px-3 py-1.5 text-xs font-semibold break-words ${
                colors[normalize(status)] ??
                'border-slate-200 bg-slate-100 text-slate-700'
            }`}
        >
            {status}
        </span>
    );
}

function BookRow({ book }) {
    return (
        <tr className="transition-colors hover:bg-slate-50/80">
            <th
                scope="row"
                className="px-4 py-4 text-left font-normal sm:px-6 sm:py-5 lg:px-8"
            >
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <div className="flex h-16 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 text-slate-400 sm:h-20 sm:w-14">
                        <BookCover book={book} />
                    </div>

                    <div className="min-w-0 flex-1">
                        <Link
                            href={book.edit_url}
                            className="line-clamp-2 font-bold text-slate-900 transition-colors hover:text-blue-600"
                        >
                            {book.title}
                        </Link>

                        <p className="mt-1 truncate text-sm text-slate-500">
                            {book.author}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2 md:hidden">
                            <AvailabilityBadge status={book.status} />
                            <span className="font-mono text-xs font-medium text-slate-500">
                                #{String(book.id).padStart(4, '0')}
                            </span>
                        </div>
                    </div>
                </div>
            </th>

            <td className="hidden px-4 py-5 align-middle md:table-cell">
                <AvailabilityBadge status={book.status} />
            </td>

            <td className="hidden px-4 py-5 align-middle md:table-cell">
                <span className="font-mono text-sm font-medium text-slate-500">
                    #{String(book.id).padStart(4, '0')}
                </span>
            </td>

            <td className="px-4 py-4 text-right align-middle sm:px-6 sm:py-5 lg:px-8">
                <Link
                    href={book.edit_url}
                    aria-label={`Alterar disponibilidade de ${book.title}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition-all hover:border-blue-600 hover:bg-blue-600 hover:text-white sm:px-4 sm:py-2.5"
                >
                    <i
                        className="fa-solid fa-pen-to-square"
                        aria-hidden="true"
                    />
                    <span className="hidden sm:inline">Editar status</span>
                </Link>
            </td>
        </tr>
    );
}

export default function BookAvailabilityManager({
    books = [],
    filters,
    pagination,
    statuses,
    dashboardUrl,
}) {
    const { query, genre: status, changeQuery, changeGenre: changeStatus, changePage, reset } = useBookFilters(
        'admin.books.create', filters, ['books', 'filters', 'pagination'], { filterKey: 'status', all: '' },
    );
    const results = useRef(null);

    function selectPage(page) {
        changePage(page, () => {
            results.current?.scrollIntoView({ block: 'start' });
            results.current?.focus({ preventScroll: true });
        });
    }

    return (
        <div className="w-full min-w-0">
            <header className="mb-8 flex flex-col justify-between gap-6 xl:flex-row xl:items-center">
                <div className="min-w-0">
                    <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold tracking-widest text-blue-600 uppercase">
                        Sistema de Biblioteca
                    </span>

                    <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        Gestão de Acervo
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Gerencie o status e a disponibilidade do seu catálogo.
                    </p>
                </div>

                <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center xl:w-auto">
                    <SearchBar
                        type="search"
                        label="Buscar por título ou autor"
                        placeholder="Buscar título ou autor..."
                        value={query}
                        onChange={(event) => changeQuery(event.target.value)}
                        className="w-full min-w-0 sm:flex-1 xl:w-72 xl:flex-initial"
                    />

                    <Link
                        href={dashboardUrl}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                    >
                        <i
                            className="fa-solid fa-arrow-left"
                            aria-hidden="true"
                        />
                        Voltar
                    </Link>
                </div>
            </header>

            <div ref={results} tabIndex={-1} className="mb-6 flex scroll-mt-6 flex-col justify-between gap-4 outline-none sm:flex-row sm:items-center">
                <div
                    role="group"
                    aria-label="Filtrar por disponibilidade"
                    className="flex min-w-0 flex-wrap gap-2"
                >
                    {['', ...statuses].map((value) => (
                        <button
                            type="button"
                            key={value || 'all'}
                            aria-pressed={status === value}
                            onClick={() => changeStatus(value)}
                            className={`max-w-full rounded-xl border px-3.5 py-2 text-xs font-bold break-words transition-colors sm:px-4 sm:py-2.5 sm:text-sm ${
                                status === value
                                    ? 'border-lumi-navy bg-lumi-navy text-white shadow-sm'
                                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {value || 'Todos'}
                        </button>
                    ))}
                </div>

                <p
                    role="status"
                    className="shrink-0 text-sm text-slate-500"
                >
                    {pagination.total}{' '}
                    {pagination.total === 1
                        ? 'título encontrado'
                        : 'títulos encontrados'}
                </p>
            </div>

            {books.length > 0 ? (
                <div className="w-full min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full table-fixed border-collapse text-left">
                        <colgroup>
                            <col className="w-auto md:w-[48%]" />
                            <col className="hidden md:table-column md:w-[17%]" />
                            <col className="hidden md:table-column md:w-[13%]" />
                            <col className="w-20 sm:w-36 md:w-[22%]" />
                        </colgroup>

                        <thead className="border-b border-slate-100 bg-slate-50 text-xs font-bold tracking-wide text-slate-500 uppercase">
                            <tr>
                                <th className="px-4 py-3.5 sm:px-6 sm:py-4 lg:px-8">
                                    Livro
                                </th>

                                <th className="hidden px-4 py-4 md:table-cell">
                                    Status
                                </th>

                                <th className="hidden px-4 py-4 md:table-cell">
                                    Registro
                                </th>

                                <th className="px-4 py-3.5 text-right sm:px-6 sm:py-4 lg:px-8">
                                    Ações
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {books.map((book) => (
                                <BookRow key={book.id} book={book} />
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
                    <i
                        className="fa-solid fa-book-open mb-4 text-3xl text-slate-300"
                        aria-hidden="true"
                    />

                    <h2 className="font-bold text-slate-800">
                        {filters.q || filters.status
                            ? 'Nenhum livro encontrado'
                            : 'Seu acervo está vazio'}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        {filters.q || filters.status
                            ? 'Tente outro título ou altere os filtros.'
                            : 'Os livros cadastrados aparecerão aqui.'}
                    </p>

                    {(query || status) && (
                        <button
                            type="button"
                            onClick={reset}
                            className="mt-5 rounded-xl bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                        >
                            Limpar filtros
                        </button>
                    )}
                </div>
            )}
            <BookPagination pagination={pagination} onPageChange={selectPage} />
        </div>
    );
}
