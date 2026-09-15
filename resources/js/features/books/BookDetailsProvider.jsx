import * as Dialog from '@radix-ui/react-dialog';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { BookDetailsContext } from './BookDetailsLink';

const BookDetailsContent = lazy(() => import('./BookDetailsContent'));

export default function BookDetailsProvider({ children }) {
    const [selectedId, setSelectedId] = useState(null);
    const [details, setDetails] = useState(null);
    const [revision, setRevision] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const triggerRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        if (selectedId === null) return;
        const controller = new AbortController();
        setLoading(true);
        setError('');
        fetch(route('book.show', selectedId), { headers: { Accept: 'application/json' }, credentials: 'same-origin', signal: controller.signal })
            .then((response) => {
                if (!response.ok)
                    throw new Error(
                        response.status === 404 ? 'Este livro não está mais disponível.' : 'Não foi possível carregar o livro. Tente novamente.',
                    );
                return response.json();
            })
            .then((data) => {
                if (!controller.signal.aborted) setDetails(data);
            })
            .catch((error) => {
                if (error.name !== 'AbortError') setError(error.message);
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });
        return () => controller.abort();
    }, [selectedId, revision]);

    const openBook = (id, trigger) => {
        if (selectedId === null) {
            triggerRef.current = trigger;
            setDetails(null);
        }
        setSelectedId(id);
        contentRef.current?.scrollTo({ top: 0 });
    };
    const close = () => setSelectedId(null);
    const currentDetails = details?.book.id === selectedId ? details : null;

    return (
        <BookDetailsContext.Provider value={openBook}>
            {children}
            <Dialog.Root
                open={selectedId !== null}
                onOpenChange={(open) => {
                    if (!open) close();
                }}
            >
                <Dialog.Portal>
                    <Dialog.Overlay className="data-[state=open]:animate-in data-[state=open]:fade-in fixed inset-0 z-[80] bg-slate-950/40 backdrop-blur-sm" />
                    <Dialog.Content
                        ref={contentRef}
                        onCloseAutoFocus={(event) => {
                            event.preventDefault();
                            if (triggerRef.current?.isConnected) triggerRef.current.focus();
                        }}
                        className="fixed top-1/2 left-1/2 z-[81] max-h-[92dvh] w-[calc(100%-1.5rem)] max-w-6xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-white/70 bg-slate-50 p-4 text-slate-800 shadow-2xl outline-none sm:p-7"
                    >
                        <div className="mb-5 flex items-center justify-between gap-4">
                            <div>
                                <Dialog.Title className="text-lg font-bold">{currentDetails?.book.title ?? 'Detalhes do livro'}</Dialog.Title>
                                <Dialog.Description className="mt-1 text-xs text-slate-500">
                                    Informações, avaliações e comentários da comunidade.
                                </Dialog.Description>
                            </div>
                            <Dialog.Close
                                aria-label="Fechar detalhes do livro"
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm hover:bg-slate-200"
                            >
                                <i className="fa-solid fa-xmark" aria-hidden="true" />
                            </Dialog.Close>
                        </div>
                        {loading && (
                            <p role="status" className="py-4 text-center text-sm text-slate-500">
                                Carregando detalhes...
                            </p>
                        )}
                        {error && (
                            <div role="alert" className="space-y-3 rounded-xl bg-red-50 p-5 text-sm text-red-700">
                                <p>{error}</p>
                                <button type="button" onClick={() => setRevision((value) => value + 1)} className="font-semibold underline">
                                    Tentar novamente
                                </button>
                            </div>
                        )}
                        {currentDetails && (
                            <Suspense
                                fallback={
                                    <p role="status" className="p-6 text-center">
                                        Carregando...
                                    </p>
                                }
                            >
                                <BookDetailsContent
                                    key={selectedId}
                                    {...currentDetails}
                                    onClose={close}
                                    onRefresh={() => setRevision((value) => value + 1)}
                                />
                            </Suspense>
                        )}
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </BookDetailsContext.Provider>
    );
}
