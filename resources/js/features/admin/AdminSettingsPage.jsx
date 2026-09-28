import AdminLayout from '@/layouts/admin-layout';
import AdminPageHeader from './AdminPageHeader';

export default function AdminSettingsPage({ title, description, children }) {
    return (
        <AdminLayout title={title} section="settings">
            <div className="mx-auto max-w-3xl">
                <AdminPageHeader title={title} description={description} backHref={route('admin.settings.index')} />
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">{children}</div>
            </div>
        </AdminLayout>
    );
}
