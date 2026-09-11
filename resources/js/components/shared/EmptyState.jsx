import { cn } from '@/lib/utils';

export default function EmptyState({ title, description, icon, className, iconClassName, titleClassName, descriptionClassName, children }) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center',
                className,
            )}
        >
            {icon && (
                <div className={cn('flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600', iconClassName)}>
                    <i className={`${icon} text-lg`} aria-hidden="true" />
                </div>
            )}
            <div className="space-y-1">
                <h5 className={cn('text-sm font-bold text-gray-800', titleClassName)}>{title}</h5>
                {description && <p className={cn('text-xs text-gray-400', descriptionClassName)}>{description}</p>}
            </div>
            {children}
        </div>
    );
}
