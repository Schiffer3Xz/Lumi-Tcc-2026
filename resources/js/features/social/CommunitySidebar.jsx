import SearchBar from '@/components/shared/SearchBar';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import ReaderListItem from './ReaderListItem';

export default function CommunitySidebar({ suggestedUsers, followedUsers, allUsers, conversationUsers, trendingPosts, onChat }) {
    const [search, setSearch] = useState('');
    const query = search.trim().replace(/^@/, '').toLocaleLowerCase('pt-BR');
    const users = query
        ? allUsers.filter((user) => `${user.name} ${user.nickname ?? ''}`.toLocaleLowerCase('pt-BR').includes(query))
        : suggestedUsers;
    const renderUser = (user) => <ReaderListItem key={user.id} user={user} variant="featured" onChat={() => onChat(user)} />;
    return (
        <div className="flex h-full flex-col overflow-hidden bg-white">
            <div className="border-b border-slate-100 bg-slate-50/50 p-4">
                <SearchBar
                    variant="custom"
                    label="Encontrar pessoas"
                    placeholder="Buscar leitores na escola..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="relative"
                    iconClassName="fa-solid fa-magnifying-glass absolute top-1/2 left-3 -translate-y-1/2 text-xs text-slate-400"
                    inputClassName="w-full rounded-xl border border-slate-200 bg-white py-2 pr-3 pl-9 text-xs outline-none focus:border-blue-500"
                />
            </div>
            <div className="flex-1 space-y-6 overflow-y-auto p-4">
                <section>
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <h3 className="text-xs font-bold text-slate-800 uppercase">{query ? 'Resultados da busca' : 'Sugestões para você'}</h3>
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                            {users.length} encontrados
                        </span>
                    </div>
                    {users.map(renderUser)}
                    {!users.length && (
                        <p className="text-xs text-slate-500">{query ? 'Nenhum leitor encontrado.' : 'Você já segue os leitores disponíveis.'}</p>
                    )}
                </section>
                <section className="border-t border-slate-100 pt-5">
                    <h3 className="mb-2 text-[10px] font-bold text-slate-400 uppercase">Amigos adicionados · {followedUsers.length}</h3>
                    <p className="mb-3 text-[11px] text-slate-500">Leitores que você segue.</p>
                    {followedUsers.map(renderUser)}
                    {!followedUsers.length && (
                        <p className="text-xs text-slate-500">Use o botão de seguir nas sugestões para adicionar leitores aqui.</p>
                    )}
                </section>
                <section className="border-t border-slate-100 pt-5">
                    <h3 className="mb-3 text-[10px] font-bold text-slate-400 uppercase">Conversas</h3>
                    {conversationUsers.map(renderUser)}
                    {!conversationUsers.length && <p className="text-xs text-slate-500">Clique no balão ao lado de um leitor para conversar.</p>}
                </section>
                <section className="border-t border-slate-100 pt-5">
                    <h3 className="mb-2 flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                        <i className="fa-solid fa-fire text-amber-500" aria-hidden="true" />
                        Em alta na escola
                    </h3>
                    <p className="mb-3 text-[11px] text-slate-500">Mais interações nos últimos 7 dias.</p>
                    {trendingPosts.map((post) => (
                        <Link
                            key={post.id}
                            href={route('list', { post: post.id })}
                            className="mb-2 block rounded-xl border border-slate-100 p-3 hover:bg-slate-50"
                        >
                            <p className="text-xs font-semibold text-slate-700">{post.author}</p>
                            <p className="mt-1 line-clamp-2 text-xs text-slate-500">{post.content}</p>
                            <span className="mt-2 block text-[10px] text-blue-600">
                                {post.interactions} {post.interactions === 1 ? 'interação' : 'interações'}
                            </span>
                        </Link>
                    ))}
                    {!trendingPosts.length && <p className="text-xs text-slate-500">Ainda não há interações recentes para destacar.</p>}
                </section>
            </div>
        </div>
    );
}
