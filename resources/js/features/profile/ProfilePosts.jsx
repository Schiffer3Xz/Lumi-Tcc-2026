import { Link } from '@inertiajs/react';
import { useState } from 'react';
import ProfilePostCard from './ProfilePostCard';

export default function ProfilePosts({ posts, user, createPostHref }) {
    const [activeTab, setActiveTab] = useState('photos');
    const [viewMode, setViewMode] = useState('grid');

    const filteredPosts = posts.filter((post) => {
        if (activeTab === 'photos') return Boolean(post.imageUrl);
        if (activeTab === 'texts') return !post.imageUrl;
        return !post.imageUrl;
    });

    const tabs = [
        { id: 'photos', label: 'Fotos', icon: 'fa-image' },
        { id: 'texts', label: 'Textos', icon: 'fa-align-left' },
    ];

    return (
        <>
            {/* CABEÇALHO DO FEED + BOTÃO DE NOVO POST */}
            <div className="flex items-center justify-between border-b border-slate-200/80 pt-2 pb-3">
                <div className="flex items-center gap-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            aria-pressed={activeTab === tab.id}
                            className={`flex items-center gap-2 pb-1 text-xs font-bold tracking-wider uppercase transition-colors ${
                                activeTab === tab.id ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            <i className={`fa-solid ${tab.icon}`} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="hidden items-center gap-3 sm:flex">
                    <button
                        type="button"
                        onClick={() => setViewMode('grid')}
                        aria-label="Exibir em grade"
                        aria-pressed={viewMode === 'grid'}
                        className={`text-xs transition-colors ${viewMode === 'grid' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <i className="fa-solid fa-border-all" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode('feed')}
                        aria-label="Exibir em feed"
                        aria-pressed={viewMode === 'feed'}
                        className={`text-xs transition-colors ${viewMode === 'feed' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <i className="fa-solid fa-list" />
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredPosts.map((post) => (
                        <ProfilePostCard key={post.id} post={post} user={user} variant="grid" />
                    ))}
                </div>
            ) : (
                <div className="mx-auto max-w-sm space-y-5">
                    {filteredPosts.map((post) => (
                        <ProfilePostCard key={post.id} post={post} user={user} variant="feed" />
                    ))}
                </div>
            )}

            {filteredPosts.length === 0 && <p className="py-8 text-center text-xs text-slate-400">Nenhuma publicação nesta categoria.</p>}
        </>
    );
}
