import LoginRequiredDialog from '@/features/auth/LoginRequiredDialog';
import ReaderLayout from '@/layouts/reader-layout';
import { Link, router } from '@inertiajs/react';

export default function LoginRequired() {
    return (
        <ReaderLayout title="Entre para continuar" user={{ name: 'Visitante' }} variant="library">
            <section className="rounded-3xl bg-white p-8 text-center">
                <h2 className="text-lumi-navy mb-3 text-2xl font-bold">Seu próximo capítulo começa aqui</h2>
                <p className="mb-5 text-slate-500">Explore o catálogo do Lumi e descubra novas leituras.</p>
                <Link href={route('dashboard')} className="font-semibold text-blue-600">
                    Explorar livros
                </Link>
            </section>
            <LoginRequiredDialog open onClose={() => router.visit(route('dashboard'))} />
        </ReaderLayout>
    );
}
