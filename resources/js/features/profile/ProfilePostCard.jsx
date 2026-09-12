import { router } from '@inertiajs/react';
import { useState } from 'react';

function PostOptions({ postId }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleDelete = () => {
        setIsOpen(false);

        if (window.confirm('Tem certeza que deseja excluir esta publicação?')) {
            router.delete(route('posts.destroy', postId), { preserveScroll: true });
        }
    };

    return (
        <div className="relative">
            <button
                type="button"
                aria-label="Mais opções da publicação"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((open) => !open)}
                className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
            >
                <i className="fa-solid fa-ellipsis-vertical text-xs" />
            </button>
            {isOpen && (
                <div className="absolute top-full right-0 z-10 mt-1 w-28 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                    <button type="button" onClick={handleDelete} className="w-full rounded-md px-3 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50">
                        Excluir
                    </button>
                </div>
            )}
        </div>
    );
}

export default function ProfilePostCard({ post, user, variant = 'grid' }) {
    if (variant === 'grid') {
        if (!post.imageUrl) {
            return (
                <article className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-xs transition-all hover:border-slate-300/80">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-[11px] font-bold text-white">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-slate-900">{user.name}</h4>
                                <p className="text-[10px] text-slate-400">{post.time}</p>
                            </div>
                        </div>
                        <PostOptions postId={post.id} />
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600">{post.caption}</p>
                    <div className="flex items-center gap-5 border-t border-slate-100 pt-3 text-xs font-medium text-slate-500">
                        <span><i className="fa-regular fa-heart mr-1" />{post.likes}</span>
                        <span><i className="fa-regular fa-comment mr-1" />{post.comments}</span>
                        <i className="fa-regular fa-bookmark ml-auto" />
                    </div>
                </article>
            );
        }

        return (
            <article className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between p-2.5">
                    <div className="flex min-w-0 items-center gap-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[11px] font-bold text-white">
                            {user.name.charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                            <h4 className="truncate text-xs font-semibold text-slate-900">{user.name}</h4>
                            <p className="text-[10px] text-slate-400">{post.time}</p>
                        </div>
                    </div>
                    <PostOptions postId={post.id} />
                </div>

                {post.imageUrl ? (
                    <div className="aspect-[0.8/1] bg-slate-100">
                        <img src={post.imageUrl} alt="Imagem da publicação" className="h-full w-full object-cover" />
                    </div>
                ) : (
                    <div className="flex min-h-48 items-center bg-slate-50 px-5 py-6">
                        <p className="text-sm leading-relaxed text-slate-700">{post.caption}</p>
                    </div>
                )}

                <div className="space-y-2.5 p-2.5">
                    <div className="flex items-center gap-4 text-base text-slate-700">
                        <button type="button" aria-label="Curtir publicação" className="hover:text-red-500"><i className="fa-regular fa-heart" /></button>
                        <button type="button" aria-label="Comentar publicação" className="hover:text-blue-500"><i className="fa-regular fa-comment" /></button>
                        <button type="button" aria-label="Compartilhar publicação" className="hover:text-blue-500"><i className="fa-solid fa-paper-plane" /></button>
                        <button type="button" aria-label="Salvar publicação" className="ml-auto hover:text-amber-500"><i className="fa-regular fa-bookmark" /></button>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-700">{post.likes} curtidas · {post.comments} comentários</p>
                    <div className="space-y-2 text-xs text-slate-600">
                        <p><span className="mr-1 font-bold text-slate-900">{user.name}</span>{post.book?.title ?? post.caption}</p>
                        {post.book && <div className="grid grid-cols-2 gap-1.5 border-t border-slate-100 pt-2 text-[10px] text-slate-500">
                            <span><i className="fa-solid fa-star mr-1 text-yellow-400" />{Number(post.book.rating || 0).toFixed(1)}</span>
                            <span><i className="fa-solid fa-building mr-1 text-slate-400" />{post.book.publisher ?? 'Editora não informada'}</span>
                            <span><i className="fa-solid fa-file-lines mr-1 text-slate-400" />{post.book.page_count ?? '-'} páginas</span>
                            <span><i className="fa-regular fa-calendar mr-1 text-slate-400" />{post.book.publication_year ?? '-'}</span>
                            <span className="col-span-2"><i className="fa-solid fa-users mr-1 text-slate-400" />{post.book.readers_count ?? 0} leitores</span>
                        </div>}
                    </div>
                </div>
            </article>
        );
    }
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-[11px] font-bold text-white">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h4 className="text-xs leading-none font-bold text-slate-900">{user.name}</h4>
                        <p className="mt-0.5 text-[10px] text-slate-400">{post.time}</p>
                    </div>
                </div>
                <PostOptions postId={post.id} />
            </div>

            {/* CONTAINER DE IMAGEM REDUZIDO */}
            <div className="h-80 w-full bg-slate-100">
                {post.imageUrl ? <img src={post.imageUrl} alt="Post" className="h-full w-full object-cover" /> : <p className="p-6 text-sm text-slate-600">{post.caption}</p>}
            </div>

            <div className="space-y-1.5 p-3">
                <div className="flex items-center gap-3 text-base text-slate-700">
                    <button aria-label="Curtir publicação" className="transition-colors hover:text-red-500">
                        <i className="fa-regular fa-heart" />
                    </button>
                    <button aria-label="Comentar publicação" className="transition-colors hover:text-blue-500">
                        <i className="fa-regular fa-comment" />
                    </button>
                    <button aria-label="Salvar publicação" className="ml-auto transition-colors hover:text-amber-500">
                        <i className="fa-regular fa-bookmark" />
                    </button>
                </div>
                <p className="text-xs font-bold text-slate-900">{post.likes} curtidas</p>
                <p className="text-xs text-slate-600">
                    <span className="mr-1 font-bold text-slate-900">{user.name}</span>
                    {post.caption}
                </p>
            </div>
        </div>
    );
}
