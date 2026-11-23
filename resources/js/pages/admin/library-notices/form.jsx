import AdminPageHeader from '@/features/admin/AdminPageHeader';
import LibraryNoticeCard from '@/features/social/LibraryNoticeCard';
import PostBookPicker from '@/features/social/PostBookPicker';
import AdminLayout from '@/layouts/admin-layout';
import { useForm } from '@inertiajs/react';
import { useEffect, useId, useRef, useState } from 'react';

export default function LibraryNoticeForm({ notice, auth, durations }) {
    const [content, setContent] = useState(notice?.content ?? '');
    const [images, setImages] = useState(() => (notice?.images ?? []).map((url) => ({ url })));
    const [books, setBooks] = useState(notice?.books ?? []);
    const [pickerOpen, setPickerOpen] = useState(false);
    const [imageError, setImageError] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [duration, setDuration] = useState(notice ? '' : '24h');
    const imageInput = useRef(null);
    const objectUrls = useRef(new Set());
    const pickerId = useId();
    const form = useForm({});
    const title = notice ? 'Editar comunicado' : 'Criar notificação';
    const user = auth.user;

    useEffect(() => {
        const urls = objectUrls.current;
        return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }, []);

    function addImages(event) {
        const files = Array.from(event.target.files);
        event.target.value = '';
        if (images.length + files.length > 6 || files.some((file) =>
            !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024,
        )) {
            setImageError('Adicione até seis imagens JPG, PNG ou WebP de até 5 MB cada.');
            return;
        }
        setImageError('');
        const added = files.map((file) => {
            const url = URL.createObjectURL(file);
            objectUrls.current.add(url);
            return { url, file };
        });
        setImages((current) => [...current, ...added]);
    }

    function removeImage(image) {
        if (image.file) {
            URL.revokeObjectURL(image.url);
            objectUrls.current.delete(image.url);
        }
        setImages((current) => current.filter((item) => item !== image));
        setImageError('');
    }

    function submit(event) {
        event.preventDefault();
        form.transform(() => ({
            ...(notice ? { _method: 'patch' } : {}),
            content,
            duration,
            images: images.filter((image) => image.file).map((image) => image.file),
            keep_images: images.filter((image) => !image.file).map((image) => image.url),
            book_ids: books.map((book) => book.id),
        }));
        form.post(notice ? route('admin.library-notices.update', notice.id) : route('admin.library-notices.store'), { forceFormData: true });
    }

    return (
        <AdminLayout title={title} section="library-notices" fitViewport="notice">
            <AdminPageHeader title={title} backHref={route('admin.library-notices.index')} />
            <div className={`admin-notice-workspace ${showPreview ? 'admin-notice-workspace-preview' : ''}`}>
                <form onSubmit={submit} className="admin-notice-form w-full min-w-0 max-w-[44rem] self-start rounded-2xl border border-slate-200 bg-white p-3 sm:p-4" aria-busy={form.processing}>
                    <fieldset disabled={form.processing} className="min-w-0 space-y-3">
                        <label className="block text-sm font-semibold text-slate-800">
                            Texto do comunicado
                            <textarea
                                value={content}
                                onChange={(event) => setContent(event.target.value)}
                                rows={4}
                                maxLength={5000}
                                className="mt-1 block w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm font-normal"
                            />
                        </label>
                        <div className="flex flex-wrap items-center gap-2">
                            <label className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-800">
                                Duração
                                <select value={duration} onChange={(event) => setDuration(event.target.value)}
                                    className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-2 text-sm font-normal">
                                    {notice && <option value="">Manter duração atual</option>}
                                    {Object.entries(durations).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                                </select>
                            </label>
                            <input ref={imageInput} type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={addImages} className="hidden" />
                            <button type="button" className="admin-button-secondary" onClick={() => imageInput.current?.click()} disabled={images.length >= 6}
                                title="Até 6 imagens JPG, PNG ou WebP de 5 MB cada">
                                <i aria-hidden="true" className="fa-solid fa-image" /> Adicionar imagens
                            </button>
                            <button type="button" className="admin-button-secondary" aria-expanded={pickerOpen && books.length < 10} onClick={() => setPickerOpen(!pickerOpen)} disabled={books.length >= 10}>
                                {pickerOpen && books.length < 10 ? 'Fechar busca de livros' : 'Referenciar livro'}
                            </button>
                        </div>
                        {notice?.expiresAt && (
                            <p className="text-xs text-slate-500">
                                Expiração atual em {new Date(notice.expiresAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                            </p>
                        )}
                        {imageError && <p role="alert" className="text-sm text-red-700">{imageError}</p>}
                        {images.length > 0 && (
                            <ul className="flex flex-wrap gap-2">
                                {images.map((image, index) => (
                                    <li key={image.url} className="relative">
                                        <img src={image.url} alt={`Imagem ${index + 1}`} className="size-16 rounded-lg bg-slate-100 object-contain" />
                                        <button type="button" onClick={() => removeImage(image)} aria-label={`Remover imagem ${index + 1}`} className="absolute top-1 right-1 rounded-full bg-slate-900 px-2 py-1 text-xs text-white">×</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {(books.length > 0 || pickerOpen) && <div className="space-y-2">
                            {pickerOpen && books.length < 10 && (
                                <PostBookPicker id={pickerId} endpoint={route('admin.library-notices.books')} selectedIds={books.map((book) => book.id)}
                                    onSelect={(book) => setBooks((current) => [...current, book])} />
                            )}
                            {books.length > 0 && <ul className="space-y-1">
                                {books.map((book) => (
                                    <li key={book.id} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-sm">
                                        <span className="min-w-0 [overflow-wrap:anywhere]">{book.title}</span>
                                        <button type="button" className="shrink-0 text-xs font-semibold text-slate-600" aria-label={`Remover ${book.title}`}
                                            onClick={() => setBooks((current) => current.filter(({ id }) => id !== book.id))}>Remover</button>
                                    </li>
                                ))}
                            </ul>}
                        </div>}
                        {Object.keys(form.errors).length > 0 && (
                            <ul role="alert" className="space-y-1 rounded-xl bg-red-50 p-3 text-sm text-red-800">
                                {Object.entries(form.errors).map(([key, error]) => <li key={key}>{error}</li>)}
                            </ul>
                        )}
                        <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-3 sm:justify-end">
                            <button type="button" className="admin-button-secondary" aria-expanded={showPreview} onClick={() => setShowPreview(!showPreview)}>
                                {showPreview ? 'Ocultar prévia' : 'Visualizar prévia'}
                            </button>
                            <button type="submit" disabled={!content.trim() && !images.length && !books.length} className="admin-button-primary">
                                {form.processing ? 'Salvando…' : notice ? 'Salvar alterações' : 'Publicar comunicado'}
                            </button>
                        </div>
                    </fieldset>
                </form>
                {showPreview && (
                    <section className="admin-notice-preview w-full min-w-0 max-w-[44rem] space-y-2" aria-label="Prévia do comunicado">
                        <h2 className="text-sm font-bold text-slate-700">Prévia do comunicado</h2>
                        <LibraryNoticeCard preview notice={{
                            author: notice?.author ?? { name: user.name, username: user.nickname, profile_photo: user.profile_photo },
                            content, images: images.map(({ url }) => url), books, publishedAt: notice?.publishedAt,
                        }} />
                    </section>
                )}
            </div>
        </AdminLayout>
    );
}
