export default function AdminStatCard({ label, value, icon = 'fa-book' }) {
    return (
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-caption-sm font-bold tracking-wide text-slate-500 uppercase">{label}</h2>
                <i className={`fa-solid ${icon} rounded-lg bg-blue-50 p-2 text-blue-600`} aria-hidden="true" />
            </div>
            <p className="text-xl font-bold text-slate-900">{value}</p>
        </div>
    );
}
