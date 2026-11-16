import { router } from '@inertiajs/react';
import { useRef, useState } from 'react';
import LibraryDrawer from './LibraryDrawer';
import ReadingProgressItem from './ReadingProgressItem';

const textValue = (value) => (typeof value === 'object' ? value?.name || '' : String(value || ''));

export default function ReadingProgressDrawer({ books, readingProgress, onClose }) {
    const [draftPages, setDraftPages] = useState({});
    const [isPicking, setIsPicking] = useState(false);
    const [query, setQuery] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const pending = useRef(false);
    const selectedIds = new Set(readingProgress.map((progress) => progress.book.id));
    const availableBooks = books.filter(
        (book) =>
            !selectedIds.has(book.id) &&
            `${textValue(book.title)} ${textValue(book.author)}`.toLocaleLowerCase('pt-BR').includes(query.trim().toLocaleLowerCase('pt-BR')),
    );

    const mutate = (method, url, data, onSuccess) => {
        if (pending.current) return;
        pending.current = true;
        setBusy(true);
        setError('');
        router.visit(url, {
            method,
            data,
            preserveScroll: true,
            preserveState: true,
            onSuccess,
            onError: (errors) => setError(Object.values(errors)[0] || 'Não foi possível atualizar seu progresso. Tente novamente.'),
            onFinish: () => {
                pending.current = false;
                setBusy(false);
            },
        });
    };

    const saveAndClose = () => {
        if (pending.current) return;
        const progresses = readingProgress
            .filter((progress) => draftPages[progress.id] !== undefined && draftPages[progress.id] !== Number(progress.current_page || 0))
            .map((progress) => ({ id: progress.id, current_page: draftPages[progress.id] }));
        if (!progresses.length) return onClose();
        mutate('patch', route('reading-progress.sync'), { progresses }, onClose);
    };

    return (
        <LibraryDrawer
            onClose={saveAndClose}
            busy={busy}
            className="reading-progress-drawer"
            title={isPicking ? 'Adicionar livro' : 'Progresso de leitura'}
            eyebrow={isPicking ? 'Progresso de leitura' : 'Minhas leituras'}
            description={isPicking ? 'Escolha um livro para acompanhar sua leitura.' : 'Um capítulo de cada vez. Acompanhe sua jornada.'}
        >
            {error && (
                <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </p>
            )}
            {isPicking ? (
                <>
                    <button
                        type="button"
                        disabled={busy}
                        onClick={() => setIsPicking(false)}
                        className="hover:text-lumi-navy mb-3 self-start rounded-lg py-2 text-sm font-semibold text-slate-600"
                    >
                        <i className="fa-solid fa-arrow-left mr-2" aria-hidden="true" />
                        Minhas leituras
                    </button>
                    <label className="relative mb-4 block">
                        <span className="sr-only">Pesquisar livros por título ou autor</span>
                        <i
                            className="fa-solid fa-magnifying-glass absolute top-1/2 left-3 -translate-y-1/2 text-xs text-slate-400"
                            aria-hidden="true"
                        />
                        <input
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Pesquisar por título ou autor..."
                            className="focus:border-lumi-progress focus:ring-lumi-progress/20 w-full rounded-xl border border-slate-200 py-3 pr-4 pl-9 text-sm outline-none focus:ring-2"
                        />
                    </label>
                    <div className="min-h-0 flex-1 space-y-2 overflow-y-auto" aria-busy={busy}>
                        {availableBooks.map((book) => (
                            <button
                                key={book.id}
                                type="button"
                                disabled={busy || readingProgress.length >= 5}
                                onClick={() => mutate('post', route('reading-progress.store'), { book_id: book.id }, () => setIsPicking(false))}
                                className="hover:border-lumi-progress flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition-colors hover:bg-blue-50/40 disabled:opacity-50"
                                aria-label={`Adicionar ${book.title} ao progresso`}
                            >
                                <div className="flex h-16 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-100 text-slate-400">
                                    {book.cover_url ? (
                                        <img src={book.cover_url} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        <i className="fa-solid fa-book text-xs" aria-hidden="true" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-sm font-bold text-slate-800">{book.title}</h3>
                                    <p className="truncate text-xs text-slate-500">{textValue(book.author) || 'Autor não informado'}</p>
                                    <p className="text-caption mt-1 text-slate-500">{book.page_count || '-'} páginas</p>
                                </div>
                                <i className="fa-solid fa-plus text-lumi-progress-strong text-xs" aria-hidden="true" />
                            </button>
                        ))}
                        {!availableBooks.length && (
                            <p role="status" className="py-8 text-center text-sm text-slate-500">
                                {query ? 'Nenhum livro encontrado para essa busca.' : 'Não há outros livros disponíveis para adicionar.'}
                            </p>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <div className="reading-summary shrink-0">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-caption-sm font-semibold tracking-widest text-slate-300 uppercase">Na sua companhia</p>
                                <p className="mt-1 text-sm font-semibold">
                                    <span className="text-2xl font-bold">{readingProgress.length}</span>
                                    <span className="ml-2 text-slate-200">
                                        {readingProgress.length === 1 ? 'livro em andamento' : 'livros em andamento'}
                                    </span>
                                </p>
                            </div>
                            <i className="fa-solid fa-book-open text-2xl text-amber-200/80" aria-hidden="true" />
                        </div>
                        <div className="reading-summary-slots" aria-label={`${readingProgress.length} de 5 espaços de leitura ocupados`}>
                            {Array.from({ length: 5 }, (_, index) => (
                                <span key={index} className={index < readingProgress.length ? 'is-filled' : ''} />
                            ))}
                        </div>
                    </div>
                    <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pb-1" aria-busy={busy}>
                        {readingProgress.map((progress) => (
                            <ReadingProgressItem
                                key={progress.id}
                                progress={progress}
                                currentPage={draftPages[progress.id] ?? Number(progress.current_page || 0)}
                                disabled={busy}
                                onChange={(page) => setDraftPages((current) => ({ ...current, [progress.id]: page }))}
                                onRemove={() => mutate('delete', route('reading-progress.destroy', progress.id), {})}
                            />
                        ))}
                        {!readingProgress.length && (
                            <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-10 text-center">
                                <i className="fa-solid fa-bookmark text-lumi-progress-strong mb-4 text-2xl" aria-hidden="true" />
                                <p className="text-lumi-navy text-sm font-bold">Sua próxima história começa aqui</p>
                                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                                    Adicione um livro e veja cada página se transformar em uma conquista.
                                </p>
                            </div>
                        )}
                    </div>
                    <button
                        type="button"
                        disabled={busy || readingProgress.length >= 5}
                        onClick={() => setIsPicking(true)}
                        className="bg-lumi-navy hover:bg-lumi-navy-hover mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white transition-colors disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                        <i className="fa-solid fa-plus text-xs" aria-hidden="true" />
                        {busy ? 'Salvando...' : readingProgress.length >= 5 ? 'Limite de 5 livros atingido' : 'Adicionar livro'}
                    </button>
                    <p className="text-caption-sm mt-3 flex shrink-0 items-center justify-center gap-2 text-slate-500">
                        <i className="fa-solid fa-check text-lumi-progress-strong" aria-hidden="true" />
                        Seu progresso é salvo ao fechar
                    </p>
                </>
            )}
        </LibraryDrawer>
    );
}
