import BookCover from '@/features/books/BookCover';
import BookPagination from '@/features/books/BookPagination';
import useBookFilters from '@/features/books/useBookFilters';
import SearchBar from '@/components/shared/SearchBar';
import AdminPageHeader from '@/features/admin/AdminPageHeader';
import AdminTable from '@/features/admin/AdminTable';
import DeleteConfirmation from '@/features/admin/DeleteConfirmation';
import AdminLayout from '@/layouts/admin-layout';
import { Link } from '@inertiajs/react';
import { useRef, useState } from 'react';

const normalize = (value) =>
    String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('pt-BR');

function AvailabilityBadge({ status }) {
    const label = status || 'Sem status';
    const colors = {
        disponivel: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        indisponivel: 'border-rose-200 bg-rose-50 text-rose-700',
        emprestado: 'border-amber-200 bg-amber-50 text-amber-700',
        'a confirmar': 'border-sky-200 bg-sky-50 text-sky-700',
    };

    return (
        <span
            className={`inline-flex max-w-full rounded-full border px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${
                colors[normalize(label)] ??
                'border-slate-200 bg-slate-100 text-slate-700'
            }`}
        >
            {label}
        </span>
    );
}

export default function Books({ books = [], filters, pagination, statuses }) {
    const { query, genre: status, changeQuery, changeGenre: changeStatus, changePage } = useBookFilters(
        'admin.books.list', filters, ['books', 'filters', 'pagination'], { filterKey: 'status', all: '' },
    );
    const [target, setTarget] = useState(null);
    const results = useRef(null);
    const listQuery = { q: filters.q || undefined, status: filters.status || undefined, page: pagination.currentPage > 1 ? pagination.currentPage : undefined };

    function selectPage(page) {
        changePage(page, () => {
            results.current?.scrollIntoView({ block: 'start' });
            results.current?.focus({ preventScroll: true });
        });
    }

    return (
        <AdminLayout title="Editar livros" section="catalog">
            <AdminPageHeader
                title="Editar livros"
                description="Consulte e atualize as informações dos livros cadastrados."
            >
                <Link
                    href={route('admin.books.index')}
                    className="admin-button-primary w-full justify-center text-center sm:w-auto"
                >
                    Cadastrar livro
                </Link>
            </AdminPageHeader>

            <div className="mb-5 flex w-full min-w-0 flex-wrap items-center gap-3">
                <SearchBar
                    type="search"
                    label="Buscar título ou autor"
                    placeholder="Buscar título ou autor..."
                    value={query}
                    onChange={(event) => changeQuery(event.target.value)}
                    className="w-full min-w-0 sm:max-w-md"
                />
                <select aria-label="Filtrar por disponibilidade" value={status} onChange={(event) => changeStatus(event.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                    <option value="">Todos os status</option>
                    {statuses.map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
            </div>

            <div ref={results} tabIndex={-1} className="w-full min-w-0 scroll-mt-6 outline-none">
                <AdminTable
                    caption="Livros do acervo"
                    columns={['Livro', 'Gênero', 'Status', 'Ações']}
                    empty={!books.length}
                >
                    {books.map((book) => (
                        <tr
                            key={book.id}
                            className="transition-colors hover:bg-slate-50/80"
                        >
                            <th
                                scope="row"
                                className="min-w-[220px] px-4 py-3.5 text-left font-normal sm:px-5 sm:py-4"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-14 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 sm:h-16 sm:w-12">
                                        <BookCover book={book} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <Link
                                            href={route('admin.books.edit', { id: book.id, _query: listQuery })}
                                            className="line-clamp-2 font-semibold text-slate-900 hover:text-blue-600"
                                        >
                                            {book.title}
                                        </Link>

                                        <p className="mt-1 truncate text-xs text-slate-500">
                                            {book.author?.name ?? 'Sem autor'}
                                        </p>
                                    </div>
                                </div>
                            </th>

                            <td className="px-4 py-3.5 whitespace-nowrap sm:px-5 sm:py-4">
                                {book.genre?.name ?? 'Sem gênero'}
                            </td>

                            <td className="px-4 py-3.5 whitespace-nowrap sm:px-5 sm:py-4">
                                <AvailabilityBadge
                                    status={book.availability?.availability}
                                />
                            </td>

                            <td className="px-4 py-3.5 whitespace-nowrap sm:px-5 sm:py-4">
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={route('admin.books.edit', { id: book.id, _query: listQuery })}
                                        aria-label={`Editar ${book.title}`}
                                        className="admin-button-secondary whitespace-nowrap"
                                    >
                                        Editar
                                    </Link>

                                    <button
                                        type="button"
                                        aria-label={`Excluir ${book.title}`}
                                        className="rounded-xl px-3 py-2 font-semibold whitespace-nowrap text-red-600 transition-colors hover:bg-red-50"
                                        onClick={() =>
                                            setTarget({
                                                label: book.title,
                                                href: route('admin.books.destroy', { id: book.id, _query: listQuery }),
                                            })
                                        }
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </AdminTable>
            </div>

            <p role="status" className="mt-4 text-xs text-slate-500">
                {pagination.total}{' '}
                {pagination.total === 1
                    ? 'livro encontrado'
                    : 'livros encontrados'}
            </p>
            <BookPagination pagination={pagination} onPageChange={selectPage} />

            <DeleteConfirmation
                target={target}
                onClose={() => setTarget(null)}
            />
        </AdminLayout>
    );
}
