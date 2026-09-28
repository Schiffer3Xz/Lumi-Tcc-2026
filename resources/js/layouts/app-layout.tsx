import ReaderLayout from '@/layouts/reader-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

interface AppLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children, breadcrumbs }: AppLayoutProps) {
    const { auth } = usePage<SharedData>().props;
    return (
        <ReaderLayout
            title={breadcrumbs?.at(-1)?.title ?? 'Configurações'}
            user={auth.user}
            activeItem="config"
            variant="library"
            topbar={{ title: 'Configurações da conta', subtitle: 'Seu perfil, acesso e preferências de leitura.' }}
            className=""
        >
            <div className="border-border bg-background text-foreground rounded-2xl border shadow-sm">{children}</div>
        </ReaderLayout>
    );
}
