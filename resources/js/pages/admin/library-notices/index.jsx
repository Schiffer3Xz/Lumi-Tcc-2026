import AdminPageHeader from '@/features/admin/AdminPageHeader';
import DeleteConfirmation from '@/features/admin/DeleteConfirmation';
import LibraryNoticeCard from '@/features/social/LibraryNoticeCard';
import AdminLayout from '@/layouts/admin-layout';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function LibraryNoticesIndex({ notices, selectedNotice }) {
    const [target, setTarget] = useState(null);

    return (
        <AdminLayout title="Histórico de comunicados" section="library-notices">
            <AdminPageHeader title="Histórico de comunicados">
                <Link href={route('admin.library-notices.create')} className="admin-button-primary">Criar notificação</Link>
            </AdminPageHeader>
            <div className="max-w-3xl space-y-4">
                {selectedNotice && <LibraryNoticeCard notice={selectedNotice} admin />}
                {notices.data.length === 0 && <p className="rounded-2xl bg-white p-5 text-sm text-slate-500">Nenhum comunicado publicado.</p>}
                {notices.data.map((notice) => (
                    <LibraryNoticeCard key={notice.id} notice={notice} admin summary>
                        <div className="flex flex-wrap items-center gap-3 text-xs">
                            <span className="text-slate-500">{notice.readCount} {notice.readCount === 1 ? 'leitura' : 'leituras'}</span>
                            {!notice.removedAt && notice.expiresAt && (
                                <span className="text-slate-500">
                                    {new Date(notice.expiresAt).getTime() <= Date.now() ? 'Expirou em' : 'Expira em'}{' '}
                                    {new Date(notice.expiresAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                                </span>
                            )}
                            <Link href={route('admin.library-notices.index', { page: notices.current_page, notice: notice.id })} className="font-semibold text-blue-700">
                                Ver comunicado
                            </Link>
                            {notice.canManage && (
                                <>
                                    <Link href={route('admin.library-notices.edit', notice.id)} className="font-semibold text-blue-700">Editar</Link>
                                    <button type="button" className="font-semibold text-red-700" onClick={() => setTarget({
                                        label: notice.content.slice(0, 80) || 'Comunicado da biblioteca',
                                        href: route('admin.library-notices.destroy', notice.id),
                                    })}>Excluir</button>
                                </>
                            )}
                        </div>
                    </LibraryNoticeCard>
                ))}
                {(notices.prev_page_url || notices.next_page_url) && (
                    <nav aria-label="Páginas de comunicados" className="flex gap-4 text-sm font-semibold text-blue-700">
                        {notices.prev_page_url && <Link href={notices.prev_page_url}>Anteriores</Link>}
                        {notices.next_page_url && <Link href={notices.next_page_url}>Próximos</Link>}
                    </nav>
                )}
            </div>
            <DeleteConfirmation target={target} onClose={() => setTarget(null)} />
        </AdminLayout>
    );
}
