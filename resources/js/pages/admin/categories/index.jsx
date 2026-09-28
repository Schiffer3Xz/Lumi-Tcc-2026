import AdminActionCard from '@/features/admin/AdminActionCard';
import AdminPageHeader from '@/features/admin/AdminPageHeader';
import AdminLayout from '@/layouts/admin-layout';

export default function Categories() {
    return (
        <AdminLayout title="Gestão de Categorias" section="categories">
            <div className="mx-auto max-w-5xl">
                <AdminPageHeader
                    title="Gestão de Categorias"
                    description="Escolha uma ação para gerenciar seus dados."
                    backHref={route('admin.dashboard')}
                />
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    <AdminActionCard
                        title="Gêneros"
                        description="Gerencie os gêneros literários do acervo."
                        href={route('admin.genres.index')}
                        icon="fa-folder-plus"
                    />
                    <AdminActionCard
                        title="Autores"
                        description="Cadastre escritores e mantenha a base atualizada."
                        href={route('admin.authors.index')}
                        icon="fa-user-plus"
                    />
                    <AdminActionCard
                        title="Disponibilidades"
                        description="Gerencie os status utilizados nos livros."
                        href={route('admin.availability.index')}
                        icon="fa-tags"
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
