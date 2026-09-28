import { useForm } from '@inertiajs/react';
import AdminField from './AdminField';
import AdminForm from './AdminForm';
import BookCoverUpload from './BookCoverUpload';

export default function BookForm({ book, authors, genres, availabilities }) {
    const form = useForm({
        title: book?.title ?? '',
        page_count: book?.page_count ?? '',
        fk_author_id: book?.fk_author_id ?? '',
        fk_genre_id: book?.fk_genre_id ?? '',
        fk_availability_id: book?.fk_availability_id ?? '',
        description: book?.description ?? '',
        cover_image: null,
    });
    const submit = () => {
        form.transform((data) => ({ ...data, ...(book ? { _method: 'put' } : {}) }));
        form.post(book ? route('admin.books.update', book.id) : route('admin.books.store'), { forceFormData: true });
    };
    return (
        <AdminForm
            form={form}
            onSubmit={submit}
            submitLabel={book ? 'Salvar alterações' : 'Cadastrar livro'}
            cancelHref={route('admin.books.list')}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
        >
            <div className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                <BookCoverUpload form={form} currentCover={book?.cover_url} />
                <div className="space-y-5">
                    <AdminField form={form} name="title" label="Título da obra" required maxLength={150} />
                    <AdminField form={form} name="page_count" label="Número de páginas" type="number" required min={1} step={1} />
                    {[
                        ['fk_author_id', 'Autor', authors, 'name'],
                        ['fk_genre_id', 'Gênero', genres, 'name'],
                        ['fk_availability_id', 'Disponibilidade', availabilities, 'availability'],
                    ].map(([name, label, options, text]) => (
                        <AdminField key={name} form={form} name={name} label={label} as="select" required>
                            <option value="">Selecione...</option>
                            {options.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option[text]}
                                </option>
                            ))}
                        </AdminField>
                    ))}
                    <AdminField form={form} name="description" label="Descrição" as="textarea" rows={5} />
                </div>
            </div>
        </AdminForm>
    );
}
