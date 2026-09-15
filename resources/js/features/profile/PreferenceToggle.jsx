export default function PreferenceToggle({ title, description, enabled, onChange, disabled = false }) {
    return (
        <div className="flex items-start justify-between gap-2 rounded-xl border border-slate-200/60 bg-slate-50 p-3">
            <div>
                <h4 className="text-xs font-bold text-slate-800">{title}</h4>
                <p className="mt-0.5 text-[11px] leading-tight text-slate-400">{description}</p>
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={enabled}
                aria-label={title}
                onClick={onChange}
                disabled={disabled}
                className={`mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors ${
                    enabled ? 'justify-end bg-amber-400' : 'justify-start bg-slate-300'
                }`}
            >
                <span className="h-4 w-4 rounded-full bg-white shadow-xs" />
            </button>
        </div>
    );
}
