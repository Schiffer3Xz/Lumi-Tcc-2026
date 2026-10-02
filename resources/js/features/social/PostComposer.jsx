import { useEffect, useId, useRef, useState } from 'react';

export default function PostComposer({ user, onSubmit, processing = false, errors = {} }) {
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageError, setImageError] = useState('');
    const errorId = useId();

    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
            setImageError('Escolha uma imagem de até 5 MB.');
            event.target.value = '';
            return;
        }

        setImageError('');
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
        setImageError('');

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        if (cameraInputRef.current) {
            cameraInputRef.current.value = '';
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (processing || (!content.trim() && !image)) return;
        onSubmit({ content, image });
    };

    return (
        <form
            onSubmit={handleSubmit}
            aria-busy={processing}
            className="flex flex-col gap-4 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-xs sm:gap-5 sm:p-5"
        >
            {/* AUTOR */}
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white sm:h-10 sm:w-10">
                    {user.name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-slate-800">{user.name}</p>

                    <p className="text-caption-sm text-slate-400">Nova publicação</p>
                </div>
            </div>

            {/* TEXTO */}
            <p className="text-xs leading-relaxed text-slate-500">
                O texto é analisado antes de publicar na rede social. Se for sinalizado, você poderá revisá-lo e tentar novamente. Imagens não são
                analisadas automaticamente.
            </p>
            <textarea
                value={content}
                maxLength={5000}
                disabled={processing}
                aria-invalid={Boolean(errors.content)}
                aria-describedby={errors.content ? `${errorId}-content` : undefined}
                onChange={(event) => setContent(event.target.value)}
                aria-label="Texto da publicação"
                placeholder="O que você está pensando?"
                rows={7}
                className="min-h-[160px] w-full resize-none rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-3 text-xs leading-relaxed text-slate-700 transition-all outline-none placeholder:text-slate-400 focus:border-blue-400 focus:bg-white sm:min-h-[180px] sm:px-4"
            />
            {errors.content && (
                <p id={`${errorId}-content`} role="alert" className="text-xs text-red-600">
                    {errors.content}
                </p>
            )}
            {(imageError || errors.image) && (
                <p role="alert" className="text-xs text-red-600">
                    {imageError || errors.image}
                </p>
            )}

            {/* PREVIEW DA IMAGEM */}
            {imagePreview && (
                <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    <img
                        src={imagePreview}
                        alt="Pré-visualização da publicação"
                        className="max-h-[400px] min-h-[180px] w-full object-cover sm:max-h-[450px]"
                    />

                    <button
                        type="button"
                        disabled={processing}
                        onClick={removeImage}
                        aria-label="Remover imagem"
                        className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/70 text-white backdrop-blur-sm transition-colors hover:bg-rose-500 sm:top-3 sm:right-3"
                    >
                        <i className="fa-solid fa-xmark text-sm" />
                    </button>
                </div>
            )}

            {/* INPUT FOTO */}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} disabled={processing} className="hidden" />

            {/* INPUT CÂMERA */}
            <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                disabled={processing}
                className="hidden"
            />

            {/* AÇÕES */}
            <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                {/* ESQUERDA */}
                <div className="flex w-full items-center gap-2 sm:w-auto">
                    {/* FOTO */}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={processing}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 sm:flex-none"
                    >
                        <i className="fa-regular fa-image text-sm" />

                        <span>Foto</span>
                    </button>

                    {/* CÂMERA */}
                    <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        disabled={processing}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 sm:flex-none"
                    >
                        <i className="fa-solid fa-camera text-sm" />

                        <span>Câmera</span>
                    </button>
                </div>

                {/* PUBLICAR */}
                <button
                    type="submit"
                    disabled={processing || (!content.trim() && !image)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                >
                    <i className="fa-solid fa-paper-plane" />
                    {processing ? 'Analisando e publicando...' : 'Publicar na rede social'}
                </button>
            </div>
        </form>
    );
}
