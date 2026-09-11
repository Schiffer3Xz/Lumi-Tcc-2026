import Modal from '@/components/shared/Modal';
export default function CreatePostModal({ isOpen, onClose }) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            label="Nova Publicação"
            overlayClassName="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
            className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-5 shadow-xl"
        >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Nova Publicação</h3>
                <button onClick={onClose} aria-label="Fechar nova publicação" className="text-slate-400 hover:text-slate-600">
                    <i className="fa-solid fa-xmark text-base" />
                </button>
            </div>

            <div className="cursor-pointer space-y-1 rounded-xl border-2 border-dashed border-slate-200 p-4 text-center transition-colors hover:bg-slate-50">
                <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-sm text-blue-600">
                    <i className="fa-solid fa-image" />
                </div>
                <p className="text-xs font-semibold text-slate-700">Escolha uma imagem</p>
                <p className="text-[10px] text-slate-400">PNG, JPG até 5MB</p>
            </div>

            <textarea
                aria-label="Legenda da publicação"
                rows="2"
                placeholder="Escreva uma legenda..."
                className="w-full resize-none rounded-xl border border-slate-200 p-2.5 text-xs placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            />

            <div className="flex justify-end gap-2 pt-1">
                <button
                    onClick={onClose}
                    className="rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                >
                    Cancelar
                </button>
                <button
                    onClick={onClose}
                    className="rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
                >
                    Publicar
                </button>
            </div>
        </Modal>
    );
}
