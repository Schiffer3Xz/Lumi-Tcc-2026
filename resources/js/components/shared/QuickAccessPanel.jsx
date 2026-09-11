import { cn } from '@/lib/utils';

export default function QuickAccessPanel({ title, items, className }) {
    return (
        <div className={cn('rounded-2xl border border-gray-200 bg-[#FFFFFF] p-5 shadow-sm', className)}>
            <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-gray-800">
                <span className="h-5 w-1 rounded-full bg-yellow-300" />
                {title}
            </h3>
            <div className="flex flex-col gap-2">
                {items.map((item) => (
                    <button
                        key={item.id ?? item.label}
                        type="button"
                        onClick={item.onClick}
                        disabled={item.disabled}
                        className="group flex items-center gap-3 rounded-xl p-3 text-left transition-all hover:bg-gray-50"
                    >
                        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#1A2332]/5 transition-colors group-hover:bg-yellow-300/10">
                            <i className={`${item.icon} text-sm text-gray-500 transition-colors group-hover:text-yellow-600`} aria-hidden="true" />
                        </span>
                        <span className="text-sm font-medium text-gray-600 transition-colors group-hover:text-gray-900">{item.label}</span>
                        <i
                            className="fa-solid fa-chevron-right ml-auto text-[10px] text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-gray-400"
                            aria-hidden="true"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
