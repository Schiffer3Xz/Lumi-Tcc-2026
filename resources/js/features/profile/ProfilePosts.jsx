import { Link } from '@inertiajs/react';
import { useState } from 'react';
import ProfilePostCard from './ProfilePostCard';

export default function ProfilePosts({ posts, user, createPostHref }) {
    const [viewMode, setViewMode] = useState('grid');
    return (
        <>
            {/* CABEÇALHO DO FEED + BOTÃO DE NOVO POST */}
            <div className="flex items-center justify-between border-b border-slate-200/80 pt-2 pb-3">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setViewMode('grid')}
                        aria-pressed={viewMode === 'grid'}
                        className={`flex items-center gap-2 pb-1 text-xs font-bold tracking-wider uppercase transition-colors ${
                            viewMode === 'grid' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        <i className="fa-solid fa-border-all" />
                        <span>Publicações</span>
                    </button>
                    <button
                        onClick={() => setViewMode('feed')}
                        aria-pressed={viewMode === 'feed'}
                        className={`flex items-center gap-2 pb-1 text-xs font-bold tracking-wider uppercase transition-colors ${
                            viewMode === 'feed' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        <i className="fa-solid fa-list" />
                        <span>Feed</span>
                    </button>
                </div>

                <Link
                    href={createPostHref}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-700"
                >
                    <i className="fa-solid fa-plus text-[10px]" />
                    <span>Novo Post</span>
                </Link>
            </div>

            {/* FEED / GRADE COM IMAGENS COMPACTAS */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {posts.map((post) => (
                        <ProfilePostCard key={post.id} post={post} user={user} variant="grid" />
                    ))}
                </div>
            ) : (
                <div className="mx-auto max-w-sm space-y-5">
                    {posts.map((post) => (
                        <ProfilePostCard key={post.id} post={post} user={user} variant="feed" />
                    ))}
                </div>
            )}
        </>
    );
}
