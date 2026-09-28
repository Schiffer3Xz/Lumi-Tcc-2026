import { Link } from '@inertiajs/react';

export default function AdminActionCard({ title, description, href, icon }) {
    return (
        <Link
            href={href}
            className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-blue-400 sm:p-8"
        >
            <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-xl text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                <i className={`fa-solid ${icon}`} aria-hidden="true" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
        </Link>
    );
}
