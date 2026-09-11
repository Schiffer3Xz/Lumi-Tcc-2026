import { cn } from '@/lib/utils';

export default function GenreQuickSelect({ genres, value, onChange, disabled = false, className }) {
    return (
        <div className={cn('mb-6 flex flex-wrap gap-2', className)} role="group" aria-label="Gêneros literários">
            {genres.map((genre) => (
                <button
                    key={genre.label}
                    type="button"
                    disabled={disabled}
                    aria-pressed={value === genre.label}
                    onClick={() => onChange(genre.label)}
                    className={cn(
                        'flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all sm:text-sm',
                        value === genre.label
                            ? 'bg-[#1A2332] text-yellow-300 shadow-md'
                            : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50',
                    )}
                >
                    <i className={`${genre.icon} text-[10px]`} aria-hidden="true" />
                    {genre.label}
                </button>
            ))}
        </div>
    );
}
