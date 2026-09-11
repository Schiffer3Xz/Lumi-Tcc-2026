export default function ProfileStatCard({ icon, count, label }) {
    return (
        <div className="flex h-28 flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-xs text-blue-600">
                <i className={`fa-solid ${icon}`} />
            </div>
            <div>
                <span className="mb-1 block text-2xl leading-none font-bold text-slate-900">{count}</span>
                <span className="text-xs text-slate-400">{label}</span>
            </div>
        </div>
    );
}
