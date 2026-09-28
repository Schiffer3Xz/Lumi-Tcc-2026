import { useForm } from '@inertiajs/react';
import AdminField from './AdminField';
import AdminForm from './AdminForm';
import { categoryConfig } from './category-config';

export default function CategoryForm({ resource, item }) {
    const config = categoryConfig[resource];
    const form = useForm({ [config.field]: item?.[config.field] ?? '' });
    const submit = () => {
        if (item) form.put(route(`admin.${resource}.update`, item.id));
        else form.post(route(`admin.${resource}.store`), { preserveScroll: true, onSuccess: () => form.reset() });
    };
    return (
        <AdminForm
            form={form}
            onSubmit={submit}
            submitLabel={item ? 'Salvar alterações' : `Cadastrar ${config.singular}`}
            cancelHref={item ? route(`admin.${resource}.index`) : undefined}
        >
            <AdminField form={form} name={config.field} label={config.label} required maxLength={255} />
        </AdminForm>
    );
}
