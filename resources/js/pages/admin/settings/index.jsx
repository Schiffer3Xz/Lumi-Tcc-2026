import AdminActionCard from '@/features/admin/AdminActionCard';
import AdminPageHeader from '@/features/admin/AdminPageHeader';
import AdminLayout from '@/layouts/admin-layout';

export default function Settings() {
    const actions = [
        ['Perfil', 'Gerencie suas informações pessoais.', 'admin.credentials.edit', 'fa-user-pen'],
        ['Alterar e-mail', 'Atualize o endereço usado na sua conta.', 'admin.settings.email.edit', 'fa-envelope'],
        ['Redefinir senha', 'Atualize sua senha de acesso.', 'admin.settings.password.edit', 'fa-key'],
        ['Cadastrar administrador', 'Adicione um novo integrante à equipe.', 'admin.admins.create', 'fa-user-plus'],
        ['Administradores', 'Consulte a equipe administrativa.', 'admin.admins.index', 'fa-users'],
    ];
    return (
        <AdminLayout title="Configurações gerais" section="settings">
            <div className="mx-auto max-w-5xl">
                <AdminPageHeader
                    title="Configurações gerais"
                    description="Gerencie seu perfil e os acessos da equipe."
                    backHref={route('admin.dashboard')}
                />
                <div className="grid gap-5 sm:grid-cols-2">
                    {actions.map(([title, description, name, icon]) => (
                        <AdminActionCard key={name} title={title} description={description} href={route(name)} icon={icon} />
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
