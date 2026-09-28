import AdminField from '@/features/admin/AdminField';
import AdminForm from '@/features/admin/AdminForm';
import AdminSettingsPage from '@/features/admin/AdminSettingsPage';
import { useForm, usePage } from '@inertiajs/react';

export default function Email() {
    const { auth } = usePage().props;
    const form = useForm({ email: auth.user.email, current_password: '' });
    return (
        <AdminSettingsPage title="Alterar e-mail" description="Após a alteração, confirme o novo endereço pelo link enviado por e-mail.">
            <AdminForm
                form={form}
                onSubmit={() => form.put(route('admin.settings.email.update'), { onFinish: () => form.reset('current_password') })}
                cancelHref={route('admin.credentials.edit')}
            >
                <AdminField form={form} name="email" label="Novo e-mail" type="email" required maxLength={255} autoComplete="email" />
                <AdminField form={form} name="current_password" label="Senha atual" type="password" required autoComplete="current-password" />
            </AdminForm>
        </AdminSettingsPage>
    );
}
