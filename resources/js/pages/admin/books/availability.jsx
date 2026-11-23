import BookAvailabilityManager from '@/features/admin/BookAvailabilityManager';
import { coverUrl } from '@/features/admin/book-utils';
import AdminLayout from '@/layouts/admin-layout';

export default function Availability({ books, filters, pagination, statuses }) {
    const listQuery = { q: filters.q || undefined, status: filters.status || undefined, page: pagination.currentPage > 1 ? pagination.currentPage : undefined };
    const items = books.map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author?.name ?? 'Sem autor',
        status: book.availability?.availability ?? 'Sem status',
        cover_url: coverUrl(book.cover_url),
        edit_url: route('admin.books.availability.edit', { book: book.id, _query: listQuery }),
    }));
    return (
        <AdminLayout title="Disponibilidade do acervo" section="availability">
            <BookAvailabilityManager books={items} filters={filters} pagination={pagination} statuses={statuses} dashboardUrl={route('admin.catalog.index')} />
        </AdminLayout>
    );
}
