export default function ProfilePostCard({ post, user, variant = 'grid' }) {
    if (variant === 'grid') {
        return (
            <div className="group relative mx-auto aspect-square w-full max-w-xs cursor-pointer overflow-hidden rounded-xl bg-slate-900 shadow-xs">
                <img src={post.imageUrl} alt="Post" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                {/* OVERLAY HOVER */}
                <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/40 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex items-center gap-1">
                        <i className="fa-solid fa-heart" />
                        <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <i className="fa-solid fa-comment" />
                        <span>{post.comments}</span>
                    </div>
                </div>
            </div>
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
                <button aria-label="Mais opções da publicação" className="text-slate-400 hover:text-slate-600">
                    <i className="fa-solid fa-ellipsis text-xs" />
                </button>
            </div>

            {/* CONTAINER DE IMAGEM REDUZIDO */}
            <div className="h-80 w-full bg-slate-100">
                <img src={post.imageUrl} alt="Post" className="h-full w-full object-cover" />
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
