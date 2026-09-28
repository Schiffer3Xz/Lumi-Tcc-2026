export default function GenreChart({ genres }) {
    const maximum = Math.max(1, ...genres.map((genre) => genre.books_count));
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="genre-chart-title">
            <h2 id="genre-chart-title" className="mb-6 font-bold text-slate-900">
                Livros por gênero
            </h2>
            {genres.length ? (
                <dl className="space-y-4">
                    {genres.map((genre) => (
                        <div key={genre.id}>
                            <div className="mb-1 flex justify-between gap-4 text-sm">
                                <dt className="min-w-0 break-words">{genre.name}</dt>
                                <dd className="font-semibold text-slate-900">{genre.books_count}</dd>
                            </div>
                            <div aria-hidden="true" className="h-4 overflow-hidden rounded-md bg-slate-100">
                                <div className="h-full rounded-md bg-blue-600" style={{ width: `${(genre.books_count / maximum) * 100}%` }} />
                            </div>
                        </div>
                    ))}
                </dl>
            ) : (
                <p className="text-sm text-slate-500">Nenhum gênero cadastrado.</p>
            )}
        </section>
    );
}
