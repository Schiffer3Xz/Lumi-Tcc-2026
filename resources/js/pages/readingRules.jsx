import ReadingRules from '@/features/profile/ReadingRules';
import ReaderLayout from '@/layouts/reader-layout';
import { Link } from '@inertiajs/react';

export default function Rules({ auth, readingRules }) {
    return (
        <ReaderLayout
            title="Regras da Sala de Leitura"
            user={auth.user}
            activeItem="home"
            variant="library"
            topbar={{ title: 'Regras da Sala de Leitura', subtitle: 'Consulte as orientações cadastradas para utilizar a sala.' }}
        >
            <div className="mx-auto max-w-2xl space-y-5">
                <Link href={route('dashboard')} className="text-sm text-blue-600">
                    Voltar ao início
                </Link>
                <ReadingRules rules={readingRules} />
            </div>
        </ReaderLayout>
    );
}
