import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

export default function ReadingProgressItem({ reading, onAdvance, className }) {
    return (
        <div className={cn('group space-y-2', className)}>
            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                    <div className={cn('h-6 w-6 flex-shrink-0 rounded-full shadow-sm', reading.color)} />
                    <div>
                        <p className="font-bold text-white transition-colors group-hover:text-amber-300">{reading.title}</p>
                        <p className="text-[11px] text-slate-400">{reading.author}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sky-400">{reading.progress}%</span>
                    {reading.progress < 100 && (
                        <button
                            type="button"
                            onClick={() => onAdvance(reading.id)}
                            title="Avançar leitura"
                            aria-label={`Avançar leitura de ${reading.title}`}
                            className="rounded bg-slate-800 p-1 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
                        >
                            <Plus className="h-3 w-3" />
                        </button>
                    )}
                </div>
            </div>
            <div
                role="progressbar"
                aria-label={`Progresso de ${reading.title}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={reading.progress}
                className="h-2 w-full overflow-hidden rounded-full bg-slate-800 p-0.5"
            >
                <div
                    className={cn('h-full rounded-full transition-all duration-500 ease-out', reading.color)}
                    style={{ width: `${reading.progress}%` }}
                />
            </div>
        </div>
    );
}
