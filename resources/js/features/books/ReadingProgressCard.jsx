import { cn } from '@/lib/utils';

export default function ReadingProgressCard({ title, description, eyebrow, progressLabel, actionLabel, onAction, className }) {
    return (
        <div
            className={cn(
                'from-lumi-progress to-lumi-progress-strong relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br p-6 shadow-lg sm:p-8',
                className,
            )}
        >
            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10" />
            <div className="absolute -right-4 -bottom-12 h-24 w-24 rounded-full bg-white/5" />
            <div className="relative flex flex-wrap items-center justify-between gap-5">
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <span className="inline-block text-xs font-bold tracking-wider text-white/70">{eyebrow}</span>
                    <h2 className="text-lg font-bold text-white sm:text-xl">{title}</h2>
                    <p className="text-sm text-white/80">{description}</p>
                    {actionLabel && (
                        <button
                            type="button"
                            onClick={onAction}
                            aria-haspopup="dialog"
                            className="mt-2 inline-flex w-fit items-center gap-2 rounded-lg border border-white/20 bg-white/20 px-4 py-2.5 text-left text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                        >
                            <i className="fa-solid fa-plus text-xs" aria-hidden="true" />
                            {actionLabel}
                        </button>
                    )}
                </div>
                <div className="flex shrink-0 items-center justify-center" aria-label={`Progresso médio de leitura: ${progressLabel}`}>
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-[6px] border-white/30 border-t-white sm:h-24 sm:w-24">
                        <span className="text-2xl font-bold text-white">{progressLabel}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
