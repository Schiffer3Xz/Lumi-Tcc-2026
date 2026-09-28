import AdminLayout from '@/layouts/admin-layout';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { auth } = usePage().props;
    const form = useForm({});
    return (
        <AdminLayout title="Verifique seu e-mail" firstAccess step={2}>
            <section className="rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm sm:p-10">
                <i className="fa-solid fa-envelope mb-6 rounded-full bg-blue-50 p-6 text-3xl text-blue-600" aria-hidden="true" />
                <h1 className="mb-3 text-2xl font-bold text-slate-900">Verifique seu e-mail</h1>
                <p className="mb-6 text-sm leading-relaxed break-words text-slate-600">
                    Confirme o endereço <strong>{auth.user.email}</strong> pelo link de verificação para continuar o acesso ao sistema.
                </p>
                {status === 'verification-link-sent' && (
                    <p role="status" className="mb-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
                        Link enviado. Confira sua caixa de entrada e a pasta de spam.
                    </p>
                )}
                {Object.values(form.errors).map((error, index) => (
                    <p role="alert" key={index} className="mb-4 text-sm text-red-600">
                        {error}
                    </p>
                ))}
                <Link href={route('admin.dashboard')} className="admin-button-primary w-full">
                    Já confirmei meu e-mail. Continuar
                </Link>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.post(route('verification.send'));
                    }}
                    className="my-4"
                >
                    <button type="submit" disabled={form.processing} className="admin-button-secondary w-full">
                        {form.processing ? 'Enviando...' : 'Reenviar e-mail de verificação'}
                    </button>
                </form>
                <Link href={route('logout')} method="post" as="button" className="text-sm text-slate-500 underline">
                    Sair da conta
                </Link>
            </section>
        </AdminLayout>
    );
}
