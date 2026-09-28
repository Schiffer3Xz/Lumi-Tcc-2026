import AdminField from '@/features/admin/AdminField';
import AdminForm from '@/features/admin/AdminForm';
import AdminPageHeader from '@/features/admin/AdminPageHeader';
import IdentityFields from '@/features/admin/IdentityFields';
import PasswordFields from '@/features/admin/PasswordFields';
import AdminLayout from '@/layouts/admin-layout';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function FirstLogin() {
    const { auth } = usePage().props;
    const form = useForm({
        name: auth.user.name,
        nickname: auth.user.nickname ?? '',
        email: auth.user.email,
        current_password: '',
        password: '',
        password_confirmation: '',
    });
    return (
        <AdminLayout title="Configuração inicial" firstAccess>
            <section className="rounded-3xl border border-white bg-white/95 p-5 shadow-xl shadow-slate-900/5 sm:p-8">
                <AdminPageHeader title="Bem-vindo, Administrador" description="Configure seu perfil e defina uma nova senha para acessar o painel." />
                <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    Substitua a senha temporária antes de continuar.
                </p>
                <AdminForm
                    form={form}
                    onSubmit={() =>
                        form.post(route('admin.credentials.update'), {
                            onFinish: () => form.reset('current_password', 'password', 'password_confirmation'),
                        })
                    }
                    submitLabel="Salvar e verificar e-mail"
                >
                    <IdentityFields form={form} />
                    <AdminField
                        form={form}
                        name="email"
                        label="E-mail"
                        type="email"
                        autoComplete="email"
                        maxLength={255}
                        hint="Você pode manter o endereço atual ou informar um novo."
                    />
                    <PasswordFields form={form} />
                </AdminForm>
                <Link href={route('logout')} method="post" as="button" className="mt-5 text-sm text-slate-500 underline">
                    Sair da conta
                </Link>
            </section>
        </AdminLayout>
    );
}
