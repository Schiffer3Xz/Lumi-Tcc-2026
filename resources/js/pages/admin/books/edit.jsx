import AdminPageHeader from '@/features/admin/AdminPageHeader';
import BookForm from '@/features/admin/BookForm';
import AdminLayout from '@/layouts/admin-layout';

export default function EditBook(props) {
    return (
        <AdminLayout title="Editar livro" section="catalog">
            <div className="mx-auto max-w-4xl">
                <AdminPageHeader title="Editar livro" description={props.book.title} backHref={route('admin.books.list')} />
                <BookForm key={props.book.id} {...props} />
            </div>
        </AdminLayout>
    );
}
