import BookAvailabilityManager from '@/features/admin/BookAvailabilityManager';
import { coverUrl } from '@/features/admin/book-utils';
import AdminLayout from '@/layouts/admin-layout';

export default function Availability({ books }) {
    const items = books.map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author?.name ?? 'Sem autor',
        status: book.availability?.availability ?? 'Sem status',
        cover_url: coverUrl(book.cover_url),
        edit_url: route('admin.books.edit', book.id),
    }));
    return (
        <AdminLayout title="Disponibilidade do acervo" section="catalog">
            <BookAvailabilityManager books={items} dashboardUrl={route('admin.catalog.index')} />
        </AdminLayout>
    );
}
