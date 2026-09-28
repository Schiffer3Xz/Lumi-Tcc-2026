import Modal from '@/components/shared/Modal';
import { useForm } from '@inertiajs/react';

export default function DeleteConfirmation({ target, onClose }) {
    const form = useForm({});
    return (
        <Modal
            isOpen={Boolean(target)}
            onClose={() => {
                if (!form.processing) {
                    form.clearErrors();
                    onClose();
                }
            }}
            label="Confirmar exclusão"
            overlayClassName="bg-slate-900/50"
            className="w-full max-w-md rounded-2xl bg-white p-6 text-slate-700 shadow-xl"
        >
            <h2 className="text-lg font-bold text-slate-900">Excluir registro?</h2>
            <p className="mt-3 text-sm break-words">
                Você está prestes a excluir <strong>{target?.label}</strong>. Esta ação não pode ser desfeita.
            </p>
            {Object.values(form.errors).map((error, index) => (
                <p key={index} role="alert" className="mt-3 text-sm text-red-600">
                    {error}
                </p>
            ))}
            <div className="mt-6 flex justify-end gap-3">
                <button type="button" disabled={form.processing} onClick={onClose} className="admin-button-secondary">
                    Cancelar
                </button>
                <button
                    type="button"
                    disabled={form.processing}
                    className="admin-button-danger"
                    onClick={() => form.delete(target.href, { preserveScroll: true, onSuccess: onClose })}
                >
                    {form.processing ? 'Excluindo...' : 'Excluir'}
                </button>
            </div>
        </Modal>
    );
}
