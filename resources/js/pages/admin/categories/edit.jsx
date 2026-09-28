import AdminPageHeader from '@/features/admin/AdminPageHeader';
import CategoryForm from '@/features/admin/CategoryForm';
import { categoryConfig } from '@/features/admin/category-config';
import AdminLayout from '@/layouts/admin-layout';

export default function EditCategory({ resource, item }) {
    const config = categoryConfig[resource];
    return (
        <AdminLayout title={`Editar ${config.singular}`} section="categories">
            <div className="mx-auto max-w-2xl">
                <AdminPageHeader title={`Editar ${config.singular}`} backHref={route(`admin.${resource}.index`)} />
                <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8">
                    <CategoryForm key={`${resource}-${item.id}`} resource={resource} item={item} />
                </div>
            </div>
        </AdminLayout>
    );
}
