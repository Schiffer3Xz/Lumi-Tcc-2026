import SearchBar from '@/components/shared/SearchBar';
import AdminPageHeader from '@/features/admin/AdminPageHeader';
import AdminTable from '@/features/admin/AdminTable';
import DeleteConfirmation from '@/features/admin/DeleteConfirmation';
import { coverUrl } from '@/features/admin/book-utils';
import AdminLayout from '@/layouts/admin-layout';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Books({ books }) {
    const [query, setQuery] = useState('');
    const [target, setTarget] = useState(null);
    const filtered = books.filter((book) =>
        `${book.title} ${book.author?.name ?? ''}`.toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR')),
    );
    return (
        <AdminLayout title="Livros do acervo" section="catalog">
            <AdminPageHeader title="Livros do acervo" description="Consulte, edite e organize as obras cadastradas.">
                <Link href={route('admin.books.index')} className="admin-button-primary">
                    Cadastrar livro
                </Link>
            </AdminPageHeader>
            <div className="mb-5 max-w-md">
                <SearchBar
                    label="Buscar título ou autor"
                    placeholder="Buscar título ou autor..."
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                />
            </div>
            <AdminTable caption="Livros do acervo" columns={['Livro', 'Gênero', 'Disponibilidade', 'Ações']} empty={!filtered.length}>
                {filtered.map((book) => (
                    <tr key={book.id}>
                        <th scope="row" className="px-5 py-4 text-left font-normal">
                            <div className="flex items-center gap-3">
                                <div className="flex h-16 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                                    {book.cover_url ? (
                                        <img src={coverUrl(book.cover_url)} alt="" className="h-full w-full object-cover" loading="lazy" />
                                    ) : (
                                        <i className="fa-solid fa-book text-slate-400" aria-hidden="true" />
                                    )}
                                </div>
                                <div>
                                    <Link href={route('admin.books.edit', book.id)} className="font-semibold text-slate-900 hover:text-blue-600">
                                        {book.title}
                                    </Link>
                                    <p className="mt-1 text-xs text-slate-500">{book.author?.name ?? 'Sem autor'}</p>
                                </div>
                            </div>
                        </th>
                        <td className="px-5 py-4">{book.genre?.name ?? 'Sem gênero'}</td>
                        <td className="px-5 py-4">{book.availability?.availability ?? 'Sem status'}</td>
                        <td className="px-5 py-4">
                            <div className="flex gap-2">
                                <Link
                                    href={route('admin.books.edit', book.id)}
                                    aria-label={`Editar ${book.title}`}
                                    className="admin-button-secondary"
                                >
                                    Editar
                                </Link>
                                <button
                                    type="button"
                                    aria-label={`Excluir ${book.title}`}
                                    className="rounded-xl px-3 py-2 font-semibold text-red-600 hover:bg-red-50"
                                    onClick={() => setTarget({ label: book.title, href: route('admin.books.destroy', book.id) })}
                                >
                                    Excluir
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </AdminTable>
            <p role="status" className="mt-4 text-xs text-slate-500">
                {filtered.length} livros encontrados
            </p>
            <DeleteConfirmation target={target} onClose={() => setTarget(null)} />
        </AdminLayout>
    );
}
