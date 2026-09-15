import { useForm, usePage } from '@inertiajs/react';
import PreferenceToggle from './PreferenceToggle';

export default function PrivacySettings() {
    const { auth } = usePage().props;
    const { data, setData, patch, processing, errors, recentlySuccessful, isDirty } = useForm({
        public_reviews: Boolean(auth.user.public_reviews),
        social_notifications: Boolean(auth.user.social_notifications),
    });

    const submit = (event) => {
        event.preventDefault();
        patch(route('privacy.update'), { preserveScroll: true });
    };

    return (
        <form onSubmit={submit} className="space-y-5">
            <PreferenceToggle
                title="Avaliações públicas"
                description={
                    data.public_reviews
                        ? 'Outros leitores podem ver seu nome e seus comentários nos livros.'
                        : 'Somente você pode ver seus comentários nos livros.'
                }
                enabled={data.public_reviews}
                disabled={processing}
                onChange={() => setData('public_reviews', !data.public_reviews)}
            />
            <p className="text-xs text-slate-500">
                As notas continuam contribuindo para a média dos livros, sem identificar você. Suas publicações no feed permanecem visíveis à
                comunidade.
            </p>
            <PreferenceToggle
                title="Notificações sociais"
                description="Receber novos avisos de curtidas, comentários nas suas publicações e seguidores."
                enabled={data.social_notifications}
                disabled={processing}
                onChange={() => setData('social_notifications', !data.social_notifications)}
            />
            <p className="text-xs text-slate-500">Desativar os avisos mantém as notificações já recebidas no seu histórico.</p>
            {Object.values(errors).map((error) => (
                <p key={error} role="alert" className="text-xs text-red-600">
                    {error}
                </p>
            ))}
            <button
                type="submit"
                disabled={processing || !isDirty}
                className="rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
                {processing ? 'Salvando...' : 'Salvar preferências'}
            </button>
            {recentlySuccessful && (
                <p role="status" className="text-sm text-emerald-700">
                    Preferências salvas.
                </p>
            )}
        </form>
    );
}
