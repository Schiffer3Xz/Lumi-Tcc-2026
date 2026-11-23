import { Link } from '@inertiajs/react';
import { useEffect, useId, useRef, useState } from 'react';
import LibraryNoticeCard from './LibraryNoticeCard';

export default function LibraryNoticeBoard({ notices, selectedNotice }) {
    const selected = useRef(null);
    const panelId = useId();
    const noticeDetailsId = useId();
    const [expanded, setExpanded] = useState(() => Boolean(selectedNotice) || notices.current_page > 1);
    const [hiddenImagesFor, setHiddenImagesFor] = useState(null);
    const noticeId = selectedNotice?.id;
    const imagesVisible = hiddenImagesFor !== noticeId;

    useEffect(() => {
        if (noticeId) setExpanded(true);
    }, [noticeId]);

    useEffect(() => {
        if (expanded && noticeId) selected.current?.focus();
    }, [expanded, noticeId]);

    return (
        <section aria-labelledby="library-notices-title" className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <h2 id="library-notices-title">
                <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => setExpanded(!expanded)}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-600 sm:px-4"
                >
                    <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                        <i className="fa-solid fa-book-open text-xs" />
                    </span>
                    <span className="flex-1">Lembretes da Biblioteca</span>
                    <i aria-hidden="true" className={`fa-solid fa-chevron-down text-xs text-slate-500 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                </button>
            </h2>
            <div id={panelId} hidden={!expanded} className="space-y-3 border-t border-slate-100 p-3 sm:p-4">
                <p className="text-xs leading-relaxed text-slate-600">
                    Todas as novidades, avisos e informações importantes que a biblioteca e a escola querem compartilhar com você estão aqui!
                </p>
                {selectedNotice ? (
                    <div ref={selected} tabIndex={-1} className="scroll-mt-6 space-y-3 outline-none">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-blue-700">
                            <Link href={route('list')} preserveState className="hover:underline">Ver todos os lembretes</Link>
                            {selectedNotice.images?.length > 0 && (
                                <button
                                    type="button"
                                    aria-controls={noticeDetailsId}
                                    aria-expanded={imagesVisible}
                                    onClick={() => setHiddenImagesFor(imagesVisible ? noticeId : null)}
                                    className="hover:underline"
                                >
                                    {imagesVisible ? 'Ocultar imagens' : 'Mostrar imagens'}
                                </button>
                            )}
                        </div>
                        <div id={noticeDetailsId}>
                            <LibraryNoticeCard notice={imagesVisible ? selectedNotice : { ...selectedNotice, images: [] }} />
                        </div>
                    </div>
                ) : (
                    <>
                        {!notices.data.length && <p className="text-sm text-slate-600">Nenhum comunicado publicado.</p>}
                        {notices.data.map((notice) => (
                            <LibraryNoticeCard key={notice.id} notice={notice} summary>
                                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                                    <Link href={route('list', { notice: notice.id })} className="font-semibold text-blue-700 hover:underline">
                                        Ler comunicado
                                    </Link>
                                    {notice.hasRead && <span className="text-slate-500">Lido</span>}
                                </div>
                            </LibraryNoticeCard>
                        ))}
                        {(notices.prev_page_url || notices.next_page_url) && (
                            <nav aria-label="Páginas de lembretes" className="flex gap-4 text-xs font-semibold text-blue-700">
                                {notices.prev_page_url && <Link href={notices.prev_page_url} preserveState preserveScroll>Mais recentes</Link>}
                                {notices.next_page_url && <Link href={notices.next_page_url} preserveState preserveScroll>Mais antigos</Link>}
                            </nav>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
