import { cn } from '@/lib/utils';

export default function ReadingProgressCard({ title, description, eyebrow, progressLabel, actionLabel, onAction, onClick, className }) {
    return (
        <div
            className={cn('relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-[#81A9D4] to-[#6B9AC4] p-6 shadow-lg sm:p-8', onClick && 'cursor-pointer', className)}
            onClick={onClick}
        >
            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10" />
            <div className="absolute -right-4 -bottom-12 h-24 w-24 rounded-full bg-white/5" />
            <div className="relative flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <span className="inline-block text-xs font-bold tracking-wider text-white/70">{eyebrow}</span>
                    <h2 className="text-lg font-bold text-white sm:text-xl">{title}</h2>
                    <p className="text-sm text-white/80">{description}</p>
                    {actionLabel && (
                        <button
                            type="button"
                            onClick={onAction}
                            className="mt-2 inline-flex w-fit items-center gap-2 rounded-lg border border-white/20 bg-white/20 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/30"
                        >
                            <i className="fa-solid fa-plus text-xs" aria-hidden="true" />
                            {actionLabel}
                        </button>
                    )}
                </div>
                <div className="flex items-center justify-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border-[6px] border-white/30 border-t-white">
                        <span className="text-2xl font-bold text-white">{progressLabel}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
