import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const messages = { like: 'curtiu sua publicação', comment: 'comentou na sua publicação', follow: 'começou a seguir você' };

function NotificationList({ close }) {
    const [page, setPage] = useState(1);
    const [refresh, setRefresh] = useState(0);
    const [notifications, setNotifications] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { unreadNotifications = 0 } = usePage().props;
    const { post, processing } = useForm({});

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError('');
        fetch(route('notifications', { page }), {
            headers: { Accept: 'application/json' },
            credentials: 'same-origin',
            signal: controller.signal,
        })
            .then((response) => {
                if (!response.ok) throw new Error('Falha ao carregar notificações.');
                return response.json();
            })
            .then((data) => setNotifications(data.notifications))
            .catch((error) => {
                if (error.name !== 'AbortError') setError('Não foi possível carregar as notificações. Tente novamente.');
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });
        return () => controller.abort();
    }, [page, refresh]);

    return (
        <>
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
                <h2 className="text-base font-bold text-slate-800">Notificações</h2>
                <button
                    type="button"
                    onClick={() => close()}
                    aria-label="Fechar notificações"
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                >
                    <i className="fa-solid fa-xmark" aria-hidden="true" />
                </button>
            </div>
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 text-xs">
                <span className="text-slate-500">{unreadNotifications} não lidas</span>
                <button
                    type="button"
                    disabled={processing || !unreadNotifications || loading}
                    onClick={() =>
                        post(route('notifications.read'), {
                            preserveScroll: true,
                            preserveState: true,
                            onSuccess: () => setRefresh((value) => value + 1),
                            onError: () => setError('Não foi possível marcar as notificações como lidas.'),
                        })
                    }
                    className="font-semibold text-blue-600 disabled:opacity-40"
                >
                    Marcar todas como lidas
                </button>
            </div>
            <div className="max-h-[min(55vh,400px)] overflow-y-auto" aria-busy={loading}>
                {loading ? (
                    <p role="status" className="p-6 text-center text-sm text-slate-500">
                        Carregando notificações...
                    </p>
                ) : error ? (
                    <div className="space-y-3 p-5 text-center text-sm">
                        <p role="alert" className="text-red-600">
                            {error}
                        </p>
                        <button type="button" onClick={() => setRefresh((value) => value + 1)} className="text-blue-600">
                            Tentar novamente
                        </button>
                    </div>
                ) : notifications?.data.length ? (
                    notifications.data.map((notification) => (
                        <button
                            key={notification.id}
                            type="button"
                            disabled={processing}
                            onClick={() => post(route('notifications.open', notification.id), { onSuccess: () => close() })}
                            className={`block w-full border-b border-slate-100 p-4 text-left transition-colors hover:bg-slate-100 disabled:opacity-50 ${notification.read_at ? 'bg-white' : 'bg-blue-50'}`}
                        >
                            <p className="text-sm text-slate-700">
                                <strong>{notification.actor}</strong> {messages[notification.kind]}.
                            </p>
                            <p className="mt-1.5 text-[11px] text-slate-500">
                                {new Date(notification.created_at.replace(' ', 'T') + 'Z').toLocaleString('pt-BR')} ·{' '}
                                {notification.read_at ? 'Lida' : 'Não lida'}
                            </p>
                        </button>
                    ))
                ) : (
                    <div className="space-y-2 px-5 py-8 text-center text-slate-500">
                        <i className="fa-regular fa-bell text-2xl" aria-hidden="true" />
                        <p className="text-sm font-semibold">Nenhuma notificação</p>
                        <p className="text-xs">Novas curtidas, comentários e seguidores aparecerão aqui.</p>
                    </div>
                )}
            </div>
            {!loading && !error && notifications?.last_page > 1 && (
                <nav aria-label="Páginas de notificações" className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs">
                    <button
                        type="button"
                        disabled={page === 1 || processing}
                        onClick={() => setPage((value) => value - 1)}
                        className="text-blue-600 disabled:opacity-40"
                    >
                        Anteriores
                    </button>
                    <span className="text-slate-500">
                        {page} de {notifications.last_page}
                    </span>
                    <button
                        type="button"
                        disabled={page >= notifications.last_page || processing}
                        onClick={() => setPage((value) => value + 1)}
                        className="text-blue-600 disabled:opacity-40"
                    >
                        Próximas
                    </button>
                </nav>
            )}
            <Link
                href={route('privacy')}
                onClick={() => close()}
                className="block border-t border-slate-100 p-3 text-center text-xs font-semibold text-blue-600 hover:bg-slate-50"
            >
                Configurar avisos
            </Link>
        </>
    );
}

export default function NotificationPopover({ className, iconClassName }) {
    const { unreadNotifications = 0 } = usePage().props;
    return (
        <Popover>
            <PopoverButton aria-label={unreadNotifications ? `Notificações: ${unreadNotifications} não lidas` : 'Notificações'} className={className}>
                <i aria-hidden="true" className={iconClassName} />
                {unreadNotifications > 0 && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />}
            </PopoverButton>
            <PopoverPanel
                anchor={{ to: 'bottom end', gap: 12, padding: 12 }}
                focus
                role="dialog"
                aria-label="Notificações"
                className="z-[70] w-[380px] max-w-[calc(100vw-24px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl outline-none"
            >
                {({ close }) => <NotificationList close={close} />}
            </PopoverPanel>
        </Popover>
    );
}
