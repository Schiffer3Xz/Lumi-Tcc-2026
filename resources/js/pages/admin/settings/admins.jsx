import AdminPageHeader from '@/features/admin/AdminPageHeader';
import AdminStatCard from '@/features/admin/AdminStatCard';
import AdminLayout from '@/layouts/admin-layout';
import { Link } from '@inertiajs/react';

export default function Admins({ admins, totalAdmins }) {
    return (
        <AdminLayout title="Administradores" section="settings">
            <AdminPageHeader title="Administradores" description="Gerenciamento da equipe administrativa.">
                <Link href={route('admin.admins.create')} className="admin-button-primary">
                    Cadastrar administrador
                </Link>
            </AdminPageHeader>
            <div className="mb-6 max-w-sm">
                <AdminStatCard label="Administradores cadastrados" value={totalAdmins} icon="fa-users" />
            </div>
            <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {admins.map((admin) => (
                    <li key={admin.id} className="flex min-w-0 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                        <span
                            aria-hidden="true"
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600"
                        >
                            {admin.name.slice(0, 1)}
                        </span>
                        <div className="min-w-0">
                            <h2 className="font-semibold break-words text-slate-900">{admin.name}</h2>
                            <p className="mt-1 text-sm break-all text-slate-500">{admin.email}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </AdminLayout>
    );
}
