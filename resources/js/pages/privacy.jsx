import PrivacySettings from '@/features/profile/PrivacySettings';
import ReaderLayout from '@/layouts/reader-layout';
import { Link } from '@inertiajs/react';

export default function Privacy({ auth }) {
    return (
        <ReaderLayout
            title="Configurações de Privacidade"
            user={auth.user}
            activeItem="config"
            variant="library"
            topbar={{ title: 'Configurações de Privacidade', subtitle: 'Controle a visibilidade das suas avaliações e os avisos da conta.' }}
        >
            <div className="mx-auto max-w-2xl space-y-5">
                <Link href={route('dashboard')} className="text-sm text-blue-600">
                    Voltar ao início
                </Link>
                <section aria-label="Preferências de privacidade" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <PrivacySettings />
                </section>
            </div>
        </ReaderLayout>
    );
}
