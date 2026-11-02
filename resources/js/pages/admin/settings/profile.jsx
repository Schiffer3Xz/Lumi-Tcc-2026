import AdminField from '@/features/admin/AdminField';
import AdminForm from '@/features/admin/AdminForm';
import AdminSettingsPage from '@/features/admin/AdminSettingsPage';
import IdentityFields from '@/features/admin/IdentityFields';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Profile() {
    const { auth } = usePage().props;
    const form = useForm({ name: auth.user.name, nickname: auth.user.nickname ?? '', description: auth.user.description ?? '' });
    const [photoPreview, setPhotoPreview] = useState(auth.user.profile_photo ?? null);
    form.transform((data) => ({ ...data, profile_photo: data.profile_photo ?? null }));
    return (
        <AdminSettingsPage title="Informações pessoais" description="Atualize os dados do seu perfil administrativo.">
            <div className="mb-6 flex items-center gap-4 border-b border-slate-100 pb-6">
                <div className="flex shrink-0 flex-col items-center gap-2">
                    <span aria-hidden="true" className="bg-lumi-navy flex h-14 w-14 items-center justify-center overflow-hidden rounded-full text-xl font-bold text-yellow-300">
                        {photoPreview ? <img src={photoPreview} alt={`Foto de perfil de ${auth.user.name}`} className="h-full w-full object-cover" /> : auth.user.name.slice(0, 1)}
                    </span>
                    <label className="cursor-pointer text-xs font-semibold text-blue-700 hover:underline">
                        {photoPreview ? 'Alterar foto' : 'Adicionar foto'}
                        <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) { form.setData('profile_photo', file); setPhotoPreview(URL.createObjectURL(file)); }
                        }} />
                    </label>
                    {form.errors.profile_photo && <p role="alert" className="text-xs text-red-600">{form.errors.profile_photo}</p>}
                </div>
                <div className="min-w-0">
                    <p className="font-bold break-words text-slate-900">{auth.user.name}</p>
                    <p className="mt-1 text-sm break-all text-slate-500">{auth.user.email}</p>
                </div>
            </div>
            <AdminForm form={form} onSubmit={() => form.post(route('admin.settings.profile.update'))} cancelHref={route('admin.settings.index')}>
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
