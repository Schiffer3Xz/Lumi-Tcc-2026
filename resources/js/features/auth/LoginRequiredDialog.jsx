import Modal from '@/components/shared/Modal';
import { Link } from '@inertiajs/react';
import { LogIn, X } from 'lucide-react';

export default function LoginRequiredDialog({ open, onClose }) {
    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            closeOnBackdrop
            label="Entre para continuar"
            overlayClassName="bg-slate-950/60 backdrop-blur-sm"
            className="relative w-full max-w-md rounded-3xl bg-white p-6 text-slate-700 shadow-2xl sm:p-8"
        >
            <button
                type="button"
                onClick={onClose}
                aria-label="Fechar aviso de login"
                className="absolute top-3 right-3 rounded-xl p-3 text-slate-500 hover:bg-slate-100"
            >
                <X size={20} aria-hidden="true" />
            </button>
            <div className="text-lumi-navy mb-5 flex size-14 items-center justify-center rounded-2xl bg-yellow-300">
                <LogIn aria-hidden="true" />
            </div>
            <h2 className="text-lumi-navy mb-3 pr-5 text-2xl font-bold">Entre para continuar</h2>
            <p className="mb-6 text-sm leading-relaxed">
                Esta área é exclusiva para quem tem uma conta no Lumi. Entre ou crie sua conta para participar.
            </p>
            <div className="flex flex-col gap-3">
                <Link href={route('login')} className="bg-lumi-navy rounded-xl px-5 py-3 text-center font-semibold text-white hover:opacity-90">
                    Entrar
                </Link>
                <Link href={route('register')} className="rounded-xl border border-slate-200 px-5 py-3 text-center font-semibold hover:bg-slate-50">
                    Criar conta
                </Link>
                <button type="button" onClick={onClose} className="rounded-xl px-5 py-3 text-sm text-slate-500 hover:bg-slate-50">
                    Continuar explorando
                </button>
            </div>
        </Modal>
    );
}
