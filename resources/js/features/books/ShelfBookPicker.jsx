import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

function BookSelection({ books }) {
    const [query, setQuery] = useState('');
    const [message, setMessage] = useState('');
    const { put, processing, errors } = useForm({});
    const filtered = books.filter((book) =>
        `${book.title} ${book.author ?? ''}`.toLocaleLowerCase('pt-BR').includes(query.trim().toLocaleLowerCase('pt-BR')),
    );

    const addBook = (book) => {
        if (processing) return;
        setMessage('');
        put(route('book.favorite', book.id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => setMessage(`${book.title} foi adicionado à sua estante.`),
        });
    };

    return (
        <div className="space-y-4">
            <input
                autoFocus
                type="search"
                aria-label="Buscar livro para adicionar à estante"
                placeholder="Buscar por título ou autor..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
            />
            {message && (
                <p role="status" className="text-sm text-emerald-700">
                    {message}
                </p>
            )}
            {Object.values(errors).map((error) => (
                <p key={error} role="alert" className="text-sm text-red-600">
                    {error}
                </p>
            ))}
            <div className="max-h-[50dvh] space-y-2 overflow-y-auto" aria-busy={processing}>
                {filtered.map((book) => (
                    <div key={book.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                        <div className="flex h-16 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-100 text-slate-400">
                            {book.cover_url ? (
                                <img src={book.cover_url} alt="" className="h-full w-full object-cover" />
                            ) : (
                                <i className="fa-solid fa-book" aria-hidden="true" />
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-semibold text-slate-800">{book.title}</h3>
                            <p className="text-xs text-slate-500">{book.author || 'Autor não informado'}</p>
                        </div>
                        <button
                            type="button"
                            disabled={processing}
                            onClick={() => addBook(book)}
                            aria-label={`Adicionar ${book.title} à estante`}
                            className="shrink-0 rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
                        >
                            Adicionar
                        </button>
                    </div>
                ))}
                {!filtered.length && (
                    <p className="py-6 text-center text-sm text-slate-500">
                        {books.length ? 'Nenhum livro encontrado para essa busca.' : 'Não há novos livros disponíveis para adicionar à estante.'}
                    </p>
                )}
            </div>
        </div>
    );
}

export default function ShelfBookPicker({ books = [] }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
                >
                    <i className="fa-solid fa-plus" aria-hidden="true" />
                    Adicionar à estante
                </button>
            </DialogTrigger>
            <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl bg-white text-slate-800">
                <DialogTitle className="pr-5">Adicionar à estante</DialogTitle>
                <DialogDescription>Escolha um livro do catálogo para guardar na sua estante.</DialogDescription>
                <BookSelection books={books} />
            </DialogContent>
        </Dialog>
    );
}
