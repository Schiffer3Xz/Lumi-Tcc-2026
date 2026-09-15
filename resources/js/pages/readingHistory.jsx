import EmptyState from '@/components/shared/EmptyState';
import BookDetailsLink from '@/features/books/BookDetailsLink';
import ReaderLayout from '@/layouts/reader-layout';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

const labels = { reading: 'Leitura', saved: 'Estante', rating: 'Avaliação' };

export default function ReadingHistory({ auth, entries = [] }) {
    const [search, setSearch] = useState('');
    const [kind, setKind] = useState('all');
    const filtered = entries.filter(
        (entry) =>
            (kind === 'all' || entry.kind === kind) &&
            `${entry.title} ${entry.author ?? ''}`.toLocaleLowerCase('pt-BR').includes(search.trim().toLocaleLowerCase('pt-BR')),
    );

    return (
        <ReaderLayout
            title="Histórico de leitura"
            user={auth.user}
            activeItem="home"
            variant="library"
            topbar={{ title: 'Histórico de leitura', subtitle: 'Consulte suas leituras, livros na estante e avaliações registrados na conta.' }}
        >
            <div className="mx-auto max-w-3xl space-y-5">
                <Link href={route('dashboard')} className="text-sm text-blue-600">
                    Voltar ao início
                </Link>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                        aria-label="Buscar no histórico"
                        placeholder="Buscar título ou autor..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        className="flex-1 rounded-xl border border-slate-200 bg-white p-3 text-sm"
                    />
                    <select
                        aria-label="Tipo de registro"
                        value={kind}
                        onChange={(event) => setKind(event.target.value)}
                        className="rounded-xl border border-slate-200 bg-white p-3 text-sm"
                    >
                        <option value="all">Todos os registros</option>
                        {Object.entries(labels).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>
                <p className="text-xs text-slate-500">
                    Exibindo o registro mais recente de cada leitura, avaliação e livro salvo ainda presente na conta.
                </p>
                {filtered.length ? (
                    filtered.map((entry) => (
                        <BookDetailsLink
                            key={entry.id}
                            bookId={entry.bookId}
                            className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-300"
                        >
                            <div className="flex flex-wrap justify-between gap-2 text-xs text-slate-500">
                                <span>{labels[entry.kind]}</span>
                                <time>
                                    {entry.date ? new Date(entry.date.replace(' ', 'T') + 'Z').toLocaleString('pt-BR') : 'Data não informada'}
                                </time>
                            </div>
                            <h2 className="mt-2 font-semibold text-slate-800">{entry.title}</h2>
                            <p className="text-sm text-slate-500">{entry.author ?? 'Autor não informado'}</p>
                            {entry.kind === 'reading' && (
                                <p className="mt-2 text-sm text-blue-700">
                                    {entry.pageCount > 0 && entry.currentPage >= entry.pageCount ? 'Leitura concluída' : 'Em leitura'} · Página{' '}
                                    {entry.currentPage} de {entry.pageCount || '—'}
                                </p>
                            )}
                            {entry.kind === 'rating' && <p className="mt-2 text-sm text-amber-700">Sua nota: {entry.rating}/5</p>}
                        </BookDetailsLink>
                    ))
                ) : (
                    <EmptyState
                        title="Nenhum registro encontrado"
                        description={
                            entries.length
                                ? 'Tente outro título ou filtro.'
                                : 'Adicione livros à estante, registre uma leitura ou avalie um livro para começar.'
                        }
                        icon="fa-solid fa-clock-rotate-left"
                    />
                )}
            </div>
        </ReaderLayout>
    );
}
