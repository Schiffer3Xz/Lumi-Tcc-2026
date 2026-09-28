import AdminField from '@/features/admin/AdminField';
import AdminForm from '@/features/admin/AdminForm';
import AdminSettingsPage from '@/features/admin/AdminSettingsPage';
import IdentityFields from '@/features/admin/IdentityFields';
import PasswordFields from '@/features/admin/PasswordFields';
import { useForm } from '@inertiajs/react';

export default function CreateAdmin() {
    const form = useForm({ name: '', nickname: '', email: '', password: '' });
    return (
        <AdminSettingsPage
            title="Cadastrar administrador"
            description="O novo administrador configurará o perfil e trocará a senha no primeiro acesso."
        >
            <AdminForm
                form={form}
                onSubmit={() => form.post(route('admin.admins.store'), { onFinish: () => form.reset('password') })}
                submitLabel="Cadastrar administrador"
                cancelHref={route('admin.admins.index')}
            >
                <IdentityFields form={form} />
                <AdminField form={form} name="email" label="E-mail" type="email" required maxLength={255} autoComplete="email" />
                <PasswordFields form={form} current={false} confirm={false} />
            </AdminForm>
        </AdminSettingsPage>
    );
}
