import LibraryDrawer from './LibraryDrawer';

export default function GenreDrawer({ isOpen, onClose, genres, value, onChange }) {
    return (
        <LibraryDrawer isOpen={isOpen} onClose={onClose} title="Todos os gêneros" eyebrow="Catálogo" className="max-w-sm">
            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto" role="group" aria-label="Gêneros literários">
                {genres.map((genre) => (
                    <button
                        key={genre.label}
                        type="button"
                        aria-pressed={value === genre.label}
                        onClick={() => {
                            onChange(genre.label);
                            onClose();
                        }}
                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                            value === genre.label
                                ? 'border-lumi-navy bg-lumi-navy font-semibold text-yellow-300'
                                : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                        <i className={`${genre.icon} w-4 text-center text-xs`} aria-hidden="true" />
                        <span>{genre.label}</span>
                    </button>
                ))}
            </div>
        </LibraryDrawer>
    );
}
