import AdminActionCard from '@/features/admin/AdminActionCard';
import AdminPageHeader from '@/features/admin/AdminPageHeader';
import AdminLayout from '@/layouts/admin-layout';

export default function Catalog() {
    return (
        <AdminLayout title="Gestão de Acervo" section="catalog">
            <div className="mx-auto max-w-5xl">
                <AdminPageHeader
                    title="Gestão de Acervo"
                    description="Selecione uma operação para o gerenciamento de livros."
                    backHref={route('admin.dashboard')}
                />
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    <AdminActionCard
                        title="Cadastrar livro"
                        description="Adicionar nova obra ao catálogo."
                        href={route('admin.books.index')}
                        icon="fa-plus"
                    />
                    <AdminActionCard
                        title="Editar livros"
                        description="Modificar informações do catálogo."
                        href={route('admin.books.list')}
                        icon="fa-pen-to-square"
                    />
                    <AdminActionCard
                        title="Atualizar disponibilidade"
                        description="Controlar o status dos exemplares."
                        href={route('admin.books.create')}
                        icon="fa-rotate"
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
