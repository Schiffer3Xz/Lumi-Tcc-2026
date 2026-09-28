import SearchBar from '@/components/shared/SearchBar';
import AdminPageHeader from '@/features/admin/AdminPageHeader';
import AdminTable from '@/features/admin/AdminTable';
import CategoryForm from '@/features/admin/CategoryForm';
import DeleteConfirmation from '@/features/admin/DeleteConfirmation';
import { categoryConfig } from '@/features/admin/category-config';
import AdminLayout from '@/layouts/admin-layout';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Manage(props) {
    return <CategoryManager key={props.resource} {...props} />;
}

function CategoryManager({ resource, items }) {
    const config = categoryConfig[resource];
    const [query, setQuery] = useState('');
    const [target, setTarget] = useState(null);
    const filtered = items.filter((item) => item[config.field].toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR')));
    return (
        <AdminLayout title={config.title} section="categories">
            <AdminPageHeader
                title={config.title}
                description={`Cadastre e gerencie ${config.title.toLocaleLowerCase('pt-BR')}.`}
                backHref={route('admin.categories.index')}
            />
            <div className="grid items-start gap-6 xl:grid-cols-[minmax(260px,1fr)_2fr]">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                    <h2 className="mb-5 font-bold text-slate-900">Cadastrar {config.singular}</h2>
                    <CategoryForm resource={resource} />
                </section>
                <section className="min-w-0 space-y-4" aria-label={`Lista de ${config.title}`}>
                    <SearchBar
                        label={`Buscar ${config.singular}`}
                        placeholder={`Buscar ${config.singular}...`}
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                    <AdminTable caption={config.title} columns={['Nome', 'Ações']} empty={!filtered.length}>
                        {filtered.map((item) => (
                            <tr key={item.id}>
                                <th scope="row" className="px-5 py-4 font-medium text-slate-800">
                                    {item[config.field]}
                                </th>
                                <td className="px-5 py-4">
                                    <div className="flex gap-2">
                                        <Link
                                            href={route(`admin.${resource}.edit`, item.id)}
                                            className="admin-button-secondary"
                                            aria-label={`Editar ${item[config.field]}`}
                                        >
                                            Editar
                                        </Link>
                                        <button
                                            type="button"
                                            className="rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                                            aria-label={`Excluir ${item[config.field]}`}
                                            onClick={() =>
                                                setTarget({ label: item[config.field], href: route(`admin.${resource}.destroy`, item.id) })
                                            }
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </AdminTable>
                    <p role="status" className="text-xs text-slate-500">
                        {filtered.length} registros encontrados
                    </p>
                </section>
            </div>
            <DeleteConfirmation target={target} onClose={() => setTarget(null)} />
        </AdminLayout>
    );
}
