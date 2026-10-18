import { useState } from 'react';

const colors = ['#2563eb', '#8b5cf6', '#14b8a6', '#f59e0b', '#f43f5e', '#06b6d4', '#6366f1', '#84cc16', '#d946ef', '#64748b'];
const number = new Intl.NumberFormat('pt-BR');
const percentage = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });

export default function GenreChart({ genres = [] }) {
    const [selectedId, setSelectedId] = useState(null);
    const items = [...genres]
        .sort((a, b) => b.books_count - a.books_count || a.name.localeCompare(b.name, 'pt-BR'))
        .map((genre, index) => ({ ...genre, count: Math.max(0, Number(genre.books_count) || 0), color: colors[index % colors.length] }));
    const total = items.reduce((sum, genre) => sum + genre.count, 0);
    const selected = items.find((genre) => genre.id === selectedId);
    let offset = 0;

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-labelledby="genre-chart-title">
            <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-7">
                <div>
                    <p className="mb-1 text-xs font-semibold tracking-widest text-blue-600 uppercase">Composição do acervo</p>
                    <h2 id="genre-chart-title" className="text-lg font-bold text-slate-900">Livros por gênero</h2>
                    <p className="mt-1 text-sm text-slate-500">Conheça a diversidade de histórias da sua biblioteca.</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                    <i className="fa-solid fa-layer-group" aria-hidden="true" />
                    {items.length} {items.length === 1 ? 'gênero' : 'gêneros'}
                </span>
            </header>
            {total > 0 ? (
                <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                    <div className="flex flex-col items-center justify-center gap-5 bg-gradient-to-b from-slate-50 to-white px-5 py-8 sm:px-7">
                        <div className="relative aspect-square w-full max-w-72">
                            <svg viewBox="0 0 240 240" className="h-full w-full -rotate-90" aria-hidden="true">
                                <circle cx="120" cy="120" r="94" fill="none" stroke="#f1f5f9" strokeWidth="28" />
                                {items.filter((genre) => genre.count > 0).map((genre) => {
                                    const length = (genre.count / total) * 100;
                                    const start = offset;
                                    offset += length;
                                    const segment = length === 100 ? 100 : length - Math.min(0.9, length * 0.15);
                                    return (
                                        <circle
                                            key={genre.id}
                                            cx="120" cy="120" r="94" fill="none" pathLength="100"
                                            stroke={genre.color}
                                            strokeWidth={selectedId === genre.id ? 34 : 28}
                                            strokeDasharray={`${segment} ${100 - segment}`}
                                            strokeDashoffset={-start}
                                            opacity={selected && selected.id !== genre.id ? 0.22 : 1}
                                            className="transition-all duration-200 motion-reduce:transition-none"
                                        />
                                    );
                                })}
                            </svg>
                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-14 text-center" aria-live="polite" aria-atomic="true">
                                <span className="text-xs font-medium text-slate-500">{selected ? 'Neste gênero' : 'Total no gráfico'}</span>
                                <span className="mt-1 text-4xl font-bold tracking-tight text-slate-900">{number.format(selected ? selected.count : total)}</span>
                                <span className="mt-1 line-clamp-2 max-w-full text-sm text-slate-500">{selected ? selected.name : 'livros catalogados'}</span>
                            </div>
                        </div>
                        <p className="max-w-xs rounded-xl border border-slate-100 bg-white px-4 py-3 text-center text-sm text-slate-500">
                            <span className="font-semibold text-slate-800">{items[0].name}</span> reúne{' '}
                            <span className="font-semibold text-blue-600">{percentage.format((items[0].count / total) * 100)}%</span> dos livros por gênero.
                        </p>
                    </div>
                    <div className="min-w-0 px-5 py-6 sm:px-7 lg:border-l lg:border-slate-100">
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <h3 className="text-sm font-semibold text-slate-900">Explore os gêneros</h3>
                            {selected && <button type="button" onClick={() => setSelectedId(null)} className="rounded text-xs font-semibold text-blue-600 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">Ver todos</button>}
                        </div>
                        <p className="mb-4 text-xs text-slate-500">Selecione um gênero para destacar sua participação.</p>
                        <ul className="grid gap-2 sm:grid-cols-2">
                            {items.map((genre) => (
                                <li key={genre.id} className="min-w-0">
                                    <button
                                        type="button"
                                        aria-pressed={selectedId === genre.id}
                                        onClick={() => setSelectedId(selectedId === genre.id ? null : genre.id)}
                                        className={`flex h-full w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${selectedId === genre.id ? 'border-blue-200 bg-blue-50' : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'}`}
                                    >
                                        <span className="mt-1.5 size-2.5 shrink-0 rounded-full" style={{ backgroundColor: genre.color }} aria-hidden="true" />
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-sm font-medium break-words text-slate-700">{genre.name}</span>
                                            <span className="mt-1 flex flex-wrap items-baseline justify-between gap-x-2 text-xs text-slate-500">
                                                <span><strong className="font-semibold text-slate-900">{number.format(genre.count)}</strong> {genre.count === 1 ? 'livro' : 'livros'}</span>
                                                <span>{percentage.format((genre.count / total) * 100)}%</span>
                                            </span>
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center px-6 py-14 text-center">
                    <span className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-500"><i className="fa-solid fa-book-open" aria-hidden="true" /></span>
                    <p className="font-semibold text-slate-900">Seu acervo vai ganhar forma aqui</p>
                    <p className="mt-2 max-w-sm text-sm text-slate-500">{items.length ? 'Adicione livros aos gêneros para visualizar a distribuição do acervo.' : 'Cadastre gêneros e associe seus livros para visualizar a distribuição do acervo.'}</p>
                </div>
            )}
        </section>
    );
}
