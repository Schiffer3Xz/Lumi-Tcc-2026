import AdminPageHeader from '@/features/admin/AdminPageHeader';
import BookForm from '@/features/admin/BookForm';
import AdminLayout from '@/layouts/admin-layout';

export default function CreateBook(props) {
    return (
        <AdminLayout title="Cadastrar livro" section="catalog">
            <div className="mx-auto max-w-4xl">
                <AdminPageHeader
                    title="Cadastrar novo livro"
                    description="Preencha os dados para adicionar uma nova obra ao acervo."
                    backHref={route('admin.books.list')}
                />
                <BookForm {...props} />
            </div>
        </AdminLayout>
    );
}
