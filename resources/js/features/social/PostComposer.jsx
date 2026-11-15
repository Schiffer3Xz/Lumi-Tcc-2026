import { useEffect, useId, useRef, useState } from 'react';
import PostBookCard from './PostBookCard';

export default function PostComposer({ user, books = [], onSubmit, processing = false, errors = {} }) {
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageError, setImageError] = useState('');
    const errorId = useId();
    const [selectedBook, setSelectedBook] = useState(null);
    const [bookPickerOpen, setBookPickerOpen] = useState(false);
    const [bookQuery, setBookQuery] = useState('');
    const normalize = (value) =>
        (value || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLocaleLowerCase('pt-BR');
    const visibleBooks = books.filter((book) => normalize(`${book.title} ${book.author || ''}`).includes(normalize(bookQuery.trim())));

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
        if (processing || (!content.trim() && !image && !selectedBook)) return;
        onSubmit({ content, image, book_id: selectedBook?.id ?? null });
    };

    return (
        <form
            onSubmit={handleSubmit}
            aria-busy={processing}
            className="flex flex-col gap-4 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-xs sm:gap-5 sm:p-5"
        >
            {/* AUTOR */}
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-800 text-xs font-bold text-white sm:h-10 sm:w-10">
                    {user.profile_photo ? (
                        <img src={user.profile_photo} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                        user.name.charAt(0).toUpperCase()
                    )}
                </div>

                <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-slate-800">{user.name}</p>

                    <p className="text-caption-sm text-slate-400">Nova publicação</p>
                </div>
            </div>

            {/* TEXTO */}
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

            {bookPickerOpen && (
                <section
                    id={`${errorId}-books`}
                    aria-label="Selecionar livro de referência"
                    className="space-y-3 rounded-xl border border-blue-100 bg-blue-50/40 p-3"
                >
                    <label htmlFor={`${errorId}-book-search`} className="block text-xs font-semibold text-slate-700">
                        Sobre qual livro você quer falar?
                    </label>
                    <input
                        id={`${errorId}-book-search`}
                        type="search"
                        autoFocus
                        value={bookQuery}
                        onChange={(event) => setBookQuery(event.target.value)}
                        placeholder="Buscar por título ou autor..."
                        disabled={processing}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                    <ul className="max-h-64 space-y-1 overflow-y-auto" aria-label="Livros do acervo">
                        {visibleBooks.map((book) => (
                            <li key={book.id}>
                                <button
                                    type="button"
                                    disabled={processing}
                                    onClick={() => {
                                        setSelectedBook(book);
                                        setBookPickerOpen(false);
                                        setBookQuery('');
                                    }}
                                    className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-white focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                                >
                                    <span className="flex h-12 w-9 shrink-0 items-center justify-center overflow-hidden rounded bg-slate-800 text-white">
                                        {book.cover_url ? (
                                            <img src={book.cover_url} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            <i className="fa-solid fa-book" aria-hidden="true" />
                                        )}
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block truncate text-xs font-semibold text-slate-800">{book.title}</span>
                                        <span className="block text-xs text-slate-500">{book.author || 'Autor não informado'}</span>
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                    {visibleBooks.length === 0 && (
                        <p role="status" className="text-xs text-slate-500">
                            Nenhum livro encontrado.
                        </p>
                    )}
                </section>
            )}
            {selectedBook && (
                <div className="space-y-2">
                    <PostBookCard book={selectedBook} preview />
                    <button
                        type="button"
                        disabled={processing}
                        onClick={() => setSelectedBook(null)}
                        className="text-xs font-semibold text-slate-500 hover:text-red-600"
                    >
                        Remover referência
                    </button>
                </div>
            )}
            {errors.book_id && (
                <p role="alert" className="text-xs text-red-600">
                    {errors.book_id}
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
                <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                    {/* FOTO */}
                    <button
                        type="button"
                        disabled={processing}
                        aria-expanded={bookPickerOpen}
                        aria-controls={`${errorId}-books`}
                        onClick={() => setBookPickerOpen((open) => !open)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100 sm:flex-none"
                    >
                        <i className="fa-solid fa-book" aria-hidden="true" />
                        <span>{selectedBook ? 'Trocar livro' : 'Referenciar livro'}</span>
                    </button>
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
                    disabled={processing || (!content.trim() && !image && !selectedBook)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                >
                    <i className="fa-solid fa-paper-plane" />
                    {processing ? 'Analisando e publicando...' : 'Publicar na rede social'}
                </button>
            </div>
        </form>
    );
}
