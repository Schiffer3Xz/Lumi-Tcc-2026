import Modal from '@/components/shared/Modal';
import { cn } from '@/lib/utils';
import { useId } from 'react';

export default function LibraryDrawer({ isOpen = true, onClose, title, eyebrow, description, children, className, busy = false }) {
    const titleId = useId();

    return (
        <Modal
            isOpen={isOpen}
            onClose={busy ? undefined : onClose}
            labelledBy={titleId}
            closeOnBackdrop={!busy}
            overlayClassName="fixed inset-0 z-50 flex items-stretch justify-end bg-slate-900/25 p-0"
            className={cn('relative flex h-dvh max-h-dvh w-full max-w-md flex-col bg-white p-5 text-slate-800 shadow-2xl', className)}
        >
            <div className="mb-5 flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="min-w-0">
                    {eyebrow && <p className="text-[10px] font-bold tracking-widest text-blue-600 uppercase">{eyebrow}</p>}
                    <h2 id={titleId} className="text-lg font-bold text-slate-800">
                        {title}
                    </h2>
                    {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    disabled={busy}
                    aria-label={`Fechar ${title.toLocaleLowerCase('pt-BR')}`}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                >
                    <i className="fa-solid fa-xmark" aria-hidden="true" />
                </button>
            </div>
            {children}
        </Modal>
    );
}
