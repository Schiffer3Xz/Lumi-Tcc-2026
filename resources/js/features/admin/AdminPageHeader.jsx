import { Link } from '@inertiajs/react';

export default function AdminPageHeader({ title, description, backHref, children }) {
    return (
        <header className="mb-8 flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center">
            <div className="min-w-0">
                <p className="mb-2 text-caption-sm font-bold tracking-widest text-blue-600 uppercase">Administração</p>
                <h1 className="text-2xl font-bold tracking-tight break-words text-slate-900">{title}</h1>
                {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
                {children}
                {backHref && (
                    <Link href={backHref} className="admin-button-secondary">
                        <i className="fa-solid fa-arrow-left" aria-hidden="true" />
                        Voltar
                    </Link>
                )}
            </div>
        </header>
    );
}
