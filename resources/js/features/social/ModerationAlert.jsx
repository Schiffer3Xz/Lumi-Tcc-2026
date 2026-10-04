import Modal from '@/components/shared/Modal';
import { ShieldAlert } from 'lucide-react';

export default function ModerationAlert({ message, onClose }) {
    return (
        <Modal
            isOpen={Boolean(message)}
            onClose={onClose}
            label="Publicação não permitida"
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-slate-800 shadow-xl"
            overlayClassName="bg-slate-950/60"
        >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <ShieldAlert className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-bold">Publicação não permitida</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{message}</p>
            <p className="mt-2 text-sm text-slate-600">Seu texto foi mantido para você revisar e tentar novamente.</p>
            <button
                type="button"
                onClick={onClose}
                className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
                Revisar texto
            </button>
        </Modal>
    );
}
