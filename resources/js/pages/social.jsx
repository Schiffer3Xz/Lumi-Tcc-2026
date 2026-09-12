import SearchBar from '@/components/shared/SearchBar';
import PostFeed from '@/features/social/PostFeed';
import ReaderListItem from '@/features/social/ReaderListItem';
import ReaderLayout from '@/layouts/reader-layout';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Feed({ auth, suggestedUsers = [], followedUsers = [], allUsers = [], posts = [] }) {
    const user = auth?.user ?? { name: 'Estudante', email: '' };
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const normalizedSearch = searchTerm.trim().toLocaleLowerCase();

        if (!normalizedSearch) {
            setSearchResults([]);
            return;
        }

        setSearchResults(
            allUsers.filter((user) => {
                const name = user.name?.toLocaleLowerCase() ?? '';
                const nickname = user.nickname?.toLocaleLowerCase() ?? '';

                return name.includes(normalizedSearch) || nickname.includes(normalizedSearch);
            }),
        );
    }, [allUsers, searchTerm]);

    const usersToDisplay = searchTerm.trim() ? searchResults : suggestedUsers;

    return (
        <>
            <ReaderLayout title="Sala de Leitura - Feed da Comunidade" user={user} activeItem="usuarios" variant="social">
                <div className="flex flex-1 overflow-hidden">
                    {/* FEED PRINCIPAL */}
                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                        <div className="mx-auto flex max-w-[720px] flex-col gap-6">
                            {/* CABEÇALHO DO FEED */}
                            <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white p-5 shadow-xs">
                                <div>
                                    <span className="mb-0.5 block text-[10px] font-bold tracking-widest text-blue-600 uppercase">
                                        COMUNIDADE LITERÁRIA
                                    </span>

                                    <h2 className="text-lg font-bold text-slate-800">Atividades e Publicações</h2>
                                </div>

                                <div className="flex items-center gap-2 rounded-xl border border-slate-200/60 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                                    <i className="fa-solid fa-arrow-down-wide-short text-blue-500" />
                                    <span>Mais recentes</span>
                                </div>
                            </div>

                            {/* LISTA DE POSTS */}
                            <PostFeed posts={posts} user={user} />
                        </div>
                    </main>

                    {/* SIDEBAR DIREITA */}
                    <aside className="hidden h-full w-[340px] flex-shrink-0 flex-col border-l border-slate-200/80 bg-white xl:flex">
                        {/* CAMPO DE BUSCA */}
                        <div className="border-b border-slate-100 bg-slate-50/50 p-4">
                            <span className="mb-1.5 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">ENCONTRAR PESSOAS</span>

                            <SearchBar
                                variant="custom"
                                label="Encontrar pessoas"
                                className="relative"
                                iconClassName="fa-solid fa-magnifying-glass absolute top-1/2 left-3 -translate-y-1/2 text-xs text-slate-400"
                                placeholder="Buscar leitores na escola..."
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                inputClassName="w-full rounded-xl border border-slate-200/90 bg-white py-2 pr-3 pl-9 text-xs text-slate-700 shadow-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
                            {/* USUÁRIOS DA APLICAÇÃO */}
                            <div>
                                <div className="mb-3 flex items-center justify-between">
                                    <h3 className="text-xs font-bold tracking-wider text-slate-800 uppercase">Sugestões para você</h3>

                                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                                        {usersToDisplay.length} encontrados
                                    </span>
                                </div>

                                <div className="flex flex-col gap-1">
                                    {usersToDisplay.slice(0, 5).map((u) => (
                                        <ReaderListItem key={u.id} user={u} variant="featured" onClick={() => router.get(`people/${u.id}`)} />
                                    ))}
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* AMIGOS ADICIONADOS */}
                            <div>
                                <h3 className="mb-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">Amigos adicionados</h3>

                                <div className="flex flex-col gap-1">
                                    {followedUsers.map((u) => (
                                        <ReaderListItem key={u.id} user={u} variant="featured" onClick={() => router.get(`people/${u.id}`)} />
                                    ))}
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* TÓPICOS POPULARES */}
                            <div>
                                <h3 className="mb-3 flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                    <i className="fa-solid fa-fire text-amber-500" />
                                    Em Alta na Escola
                                </h3>

                                <div className="flex flex-col gap-1.5" />
                            </div>
                        </div>
                    </aside>
                </div>
            </ReaderLayout>
        </>
    );
}
