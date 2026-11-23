import EmptyState from '@/components/shared/EmptyState';
import NotificationMessage from '@/components/layout/NotificationMessage';
import AdminLayout from '@/layouts/admin-layout';
import ReaderLayout from '@/layouts/reader-layout';
import { Link, useForm } from '@inertiajs/react';

export default function Notifications({ auth, notifications, unreadNotifications }) {
    const { post, processing } = useForm({});
    const isAdmin = Boolean(auth.user.is_admin);
    const prefix = isAdmin ? 'admin.' : '';
    const Layout = isAdmin ? AdminLayout : ReaderLayout;
    return (
        <Layout
            title="Notificações"
            user={auth.user}
            variant="library"
            topbar={{ title: 'Notificações', subtitle: 'Acompanhe as interações da comunidade com você.' }}
        >
            <div className="mx-auto max-w-3xl space-y-5">
                <div className="flex flex-wrap justify-between gap-3 text-sm">
                    <Link href={route(`${prefix}dashboard`)} className="text-blue-600">
                        Voltar ao início
                    </Link>
                    {!isAdmin && <Link href={route('privacy')} className="text-blue-600">
                        Configurar avisos
                    </Link>}
                    <button
                        disabled={processing || !unreadNotifications}
                        onClick={() => post(route(`${prefix}notifications.read`), { preserveScroll: true })}
                        className="font-semibold text-slate-700 disabled:opacity-40"
                    >
                        Marcar todas como lidas
                    </button>
                </div>
                {notifications.data.length ? (
                    notifications.data.map((notification) => (
                        <button
                            key={notification.id}
                            disabled={processing}
                            onClick={() => post(route(`${prefix}notifications.open`, notification.id))}
                            className={`block w-full rounded-2xl border p-5 text-left shadow-sm disabled:opacity-50 ${notification.read_at ? 'border-slate-200 bg-white' : 'border-blue-200 bg-blue-50'}`}
                        >
                            <p className="text-sm text-slate-700">
                                <NotificationMessage notification={notification} />
                            </p>
                            <p className="mt-2 text-xs text-slate-500">
                                {new Date(notification.created_at.replace(' ', 'T') + 'Z').toLocaleString('pt-BR')} ·{' '}
                                {notification.read_at ? 'Lida' : 'Não lida'}
                            </p>
                        </button>
                    ))
                ) : (
                    <EmptyState
                        title="Nenhuma notificação"
                        description="Novos avisos aparecerão aqui."
                        icon="fa-regular fa-bell"
                    />
                )}
                <nav aria-label="Páginas de notificações" className="flex justify-between text-sm text-blue-600">
                    {notifications.prev_page_url ? <Link href={notifications.prev_page_url}>Anteriores</Link> : <span />}
                    {notifications.next_page_url && <Link href={notifications.next_page_url}>Próximas</Link>}
                </nav>
            </div>
        </Layout>
    );
}
