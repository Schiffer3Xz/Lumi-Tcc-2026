import { cn } from '@/lib/utils';
import { BookOpen } from 'lucide-react';
import { useState } from 'react';
import ReadingProgressItem from './reading-progress-item';

export default function ReadingPreview({ initialReadings, title, children, className }) {
    const [readings, setReadings] = useState(initialReadings);

    const increaseProgress = (id) => {
        setReadings((previous) =>
            previous.map((reading) => (reading.id === id ? { ...reading, progress: Math.min(100, reading.progress + 10) } : reading)),
        );
    };

    return (
        <div
            className={cn(
                'bg-lumi-landing-card/90 w-full max-w-sm space-y-6 rounded-3xl border border-slate-700/60 p-5 shadow-2xl backdrop-blur-md transition-colors duration-300 hover:border-slate-600 sm:p-6',
                className,
            )}
        >
            <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
                <div>
                    <h2 className="text-xs font-bold tracking-wider text-slate-300 uppercase">{title}</h2>
                    <p aria-live="polite" className="mt-0.5 text-xs text-slate-400">
                        {readings.filter((reading) => reading.progress < 100).length} em andamento · demonstração
                    </p>
                </div>
                <div className="rounded-xl bg-slate-800/90 p-2.5 text-amber-300 shadow-inner">
                    <BookOpen className="h-4 w-4" />
                </div>
            </div>
            <div className="space-y-4">
                {readings.map((reading) => (
                    <ReadingProgressItem key={reading.id} reading={reading} onAdvance={increaseProgress} />
                ))}
            </div>
            {children}
            <p className="text-xs leading-relaxed text-slate-400">Experimente avançar o progresso. Os exemplos desta prévia não são salvos.</p>
        </div>
    );
}
