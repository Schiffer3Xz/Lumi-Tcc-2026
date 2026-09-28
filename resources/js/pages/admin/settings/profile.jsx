import AdminField from '@/features/admin/AdminField';
import AdminForm from '@/features/admin/AdminForm';
import AdminSettingsPage from '@/features/admin/AdminSettingsPage';
import IdentityFields from '@/features/admin/IdentityFields';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function Profile() {
    const { auth } = usePage().props;
    const form = useForm({ name: auth.user.name, nickname: auth.user.nickname ?? '', description: auth.user.description ?? '' });
    return (
        <AdminSettingsPage title="Informações pessoais" description="Atualize os dados do seu perfil administrativo.">
            <div className="mb-6 flex items-center gap-4 border-b border-slate-100 pb-6">
                <span
                    aria-hidden="true"
                    className="bg-lumi-navy flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-bold text-yellow-300"
                >
                    {auth.user.name.slice(0, 1)}
                </span>
                <div className="min-w-0">
                    <p className="font-bold break-words text-slate-900">{auth.user.name}</p>
                    <p className="mt-1 text-sm break-all text-slate-500">{auth.user.email}</p>
                </div>
            </div>
            <AdminForm form={form} onSubmit={() => form.put(route('admin.settings.profile.update'))} cancelHref={route('admin.settings.index')}>
                <IdentityFields form={form} />
                <AdminField form={form} name="description" label="Biografia" as="textarea" rows={4} required maxLength={255} />
                <div className="flex flex-wrap gap-3">
                    <Link href={route('admin.settings.email.edit')} className="admin-button-secondary">
                        Alterar e-mail
                    </Link>
                    <Link href={route('admin.settings.password.edit')} className="admin-button-secondary">
                        Redefinir senha
                    </Link>
                </div>
            </AdminForm>
        </AdminSettingsPage>
    );
}
