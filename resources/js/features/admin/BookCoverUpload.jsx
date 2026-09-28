import InputError from '@/components/input-error';
import { useEffect, useState } from 'react';
import { coverUrl } from './book-utils';

export default function BookCoverUpload({ form, currentCover }) {
    const [preview, setPreview] = useState(null);
    const file = form.data.cover_image;
    useEffect(() => {
        if (!file) {
            setPreview(null);
            return;
        }
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);
    const source = preview || coverUrl(currentCover);
    return (
        <div>
            <label htmlFor="cover-upload" className="mb-2 block text-xs font-bold text-slate-700">
                Capa da obra
            </label>
            <input
                id="cover-upload"
                name="cover_image"
                type="file"
                className="peer sr-only"
                accept="image/jpeg,image/png,image/webp"
                aria-invalid={Boolean(form.errors.cover_image)}
                aria-describedby="cover-hint cover-error"
                onChange={(event) => {
                    const selected = event.target.files?.[0];
                    if (!selected) return;
                    if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type) || selected.size > 2 * 1024 * 1024) {
                        form.setError('cover_image', 'Selecione uma imagem JPG, PNG ou WebP de até 2 MB.');
                        event.target.value = '';
                        return;
                    }
                    form.clearErrors('cover_image');
                    form.setData('cover_image', selected);
                }}
            />
            <label
                htmlFor="cover-upload"
                className="relative flex aspect-[2/3] max-h-[420px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center text-slate-500 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-blue-600 hover:border-blue-500"
            >
                {source ? (
                    <img src={source} alt="Prévia da capa do livro" className="absolute inset-0 h-full w-full object-contain" />
                ) : (
                    <>
                        <i className="fa-solid fa-cloud-arrow-up mb-3 text-3xl" aria-hidden="true" />
                        <span className="text-sm">Selecionar capa</span>
                    </>
                )}
            </label>
            <p id="cover-hint" className="mt-3 text-xs text-slate-500">
                JPG, PNG ou WebP. Máximo de 2 MB. Clique na capa para substituí-la.
            </p>
            <InputError id="cover-error" message={form.errors.cover_image} className="mt-2" />
        </div>
    );
}
