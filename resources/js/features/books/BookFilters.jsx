import SearchBar from '@/components/shared/SearchBar';
import GenreQuickSelect from './GenreQuickSelect';

export default function BookFilters({
    query,
    onQueryChange,
    genres,
    selectedGenre,
    onGenreChange,
    onMoreGenres,
    placeholder = 'Pesquise por livros, autores, gêneros...',
    searchLabel = 'BUSCAR',
    onSearch,
}) {
    return (
        <>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                <SearchBar value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder={placeholder} />
                <button
                    type="button"
                    onClick={onSearch}
                    className="flex items-center justify-center gap-2 rounded-xl bg-yellow-300 px-6 py-3 text-sm font-bold tracking-wide whitespace-nowrap text-gray-900 shadow-sm transition-all hover:bg-yellow-400 hover:shadow-md"
                >
                    <i className="fa-solid fa-magnifying-glass text-xs" aria-hidden="true" />
                    {searchLabel}
                </button>
            </div>
            <GenreQuickSelect genres={genres} value={selectedGenre} onChange={onGenreChange} onMore={onMoreGenres} />
        </>
    );
}
