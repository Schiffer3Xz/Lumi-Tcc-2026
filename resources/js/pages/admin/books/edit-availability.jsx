import AdminField from '@/features/admin/AdminField';
import AdminForm from '@/features/admin/AdminForm';
import AdminPageHeader from '@/features/admin/AdminPageHeader';
import BookCover from '@/features/books/BookCover';
import AdminLayout from '@/layouts/admin-layout';
import { useForm } from '@inertiajs/react';

export default function EditAvailability({ book, availabilities, listQuery }) {
    const listUrl = route('admin.books.create', listQuery);
    const form = useForm({ fk_availability_id: String(book.availability?.id ?? '') });

    return (
        <AdminLayout title="Alterar status do livro" section="availability">
            <div className="mx-auto max-w-2xl">
                <AdminPageHeader title="Alterar status do livro" backHref={listUrl} />
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <section className="flex items-center gap-4 bg-lumi-navy p-5 text-white sm:gap-6 sm:p-7">
                        <div className="flex h-24 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/10 text-white/70">
                            <BookCover book={book} eager />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-lg font-bold break-words">{book.title}</h2>
                            {book.author && <p className="mt-1 text-sm text-slate-300">{book.author.name}</p>}
                            <p className="mt-3 text-sm text-slate-300">
                                Status atual{' '}
                                <span className="ml-1 rounded-full bg-white/10 px-2.5 py-1 font-semibold text-white">
                                    {book.availability?.availability ?? 'Sem status'}
                                </span>
                            </p>
                        </div>
                    </section>
                    <AdminForm
                        className="p-5 sm:p-7"
                        form={form}
                        onSubmit={() => form.patch(route('admin.books.availability.update', { book: book.id, _query: listQuery }))}
                        submitLabel="Salvar status"
                        cancelHref={listUrl}
                    >
                        <AdminField form={form} name="fk_availability_id" label="Disponibilidade" as="select" required>
                            <option value="" disabled>
                                Selecione um status
                            </option>
                            {availabilities.map((status) => (
                                <option key={status.id} value={status.id}>
                                    {status.availability}
                                </option>
                            ))}
                        </AdminField>
                    </AdminForm>
                </div>
            </div>
        </AdminLayout>
    );
}
