import AdminForm from '@/features/admin/AdminForm';
import AdminSettingsPage from '@/features/admin/AdminSettingsPage';
import PasswordFields from '@/features/admin/PasswordFields';
import { useForm } from '@inertiajs/react';

export default function Password() {
    const form = useForm({ current_password: '', password: '', password_confirmation: '' });
    return (
        <AdminSettingsPage title="Redefinir senha" description="Confirme a senha atual para definir uma nova senha de acesso.">
            <AdminForm
                form={form}
                onSubmit={() => form.put(route('admin.settings.password.update'), { onFinish: () => form.reset() })}
                cancelHref={route('admin.credentials.edit')}
            >
                <PasswordFields form={form} />
            </AdminForm>
        </AdminSettingsPage>
    );
}
