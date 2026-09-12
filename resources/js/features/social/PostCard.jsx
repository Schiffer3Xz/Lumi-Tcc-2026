import PostBookCard from './PostBookCard';
import PostComments from './PostComments';
export default function PostCard({ post, user, isLiked = false, onLike }) {
    return (
        <article className="flex flex-col gap-4 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-xs transition-all hover:border-slate-300/80">
            {/* CABEÇALHO DO POST */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white shadow-xs ${
                            post.author?.bg ?? 'bg-slate-800'
                        }`}
                    >
                        {post.author?.avatar ?? post.author?.name?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <div className="flex items-center gap-1.5">
                            <h3 className="text-xs font-bold text-slate-800">{post.author?.name}</h3>

                            <span className="text-[11px] text-slate-400">@{post.author?.username}</span>
                        </div>

                        <p className="text-[10px] text-slate-400">{post.time}</p>
                    </div>
                </div>

                <button
                    aria-label="Mais opções da publicação"
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
                >
                    <i className="fa-solid fa-ellipsis-vertical" />
                </button>
            </div>

            {/* CONTEÚDO */}
            <p className="text-xs leading-relaxed text-slate-600">{post.content}</p>

            {/* CARTÃO DE LIVRO (SE HOUVER) */}
            {post.book && <PostBookCard book={post.book} />}

            {/* FOTO DO POST (SE HOUVER) */}
            {post.image && (
                <div className="flex max-h-[360px] min-h-[180px] items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-900/5">
                    <img
                        src={post.image}
                        alt="Imagem da publicação"
                        className="block max-h-[360px] w-full object-contain transition-transform duration-300 hover:scale-[1.01]"
                    />
                </div>
            )}

            {/* AÇÕES */}
            <div className="flex items-center gap-6 border-t border-slate-100 pt-3 text-xs font-medium text-slate-500">
                <button
                    onClick={onLike}
                    aria-label={isLiked ? 'Descurtir publicação' : 'Curtir publicação'}
                    aria-pressed={isLiked}
                    className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'font-bold text-rose-500' : 'hover:text-rose-500'}`}
                >
                    <i className={`${isLiked ? 'fa-solid' : 'fa-regular'} fa-heart text-sm`} />

                    <span>{post.likesCount ?? 0}</span>
                </button>

                <button aria-label="Comentar publicação" className="flex items-center gap-1.5 transition-colors hover:text-blue-600">
                    <i className="fa-regular fa-comment text-sm" />
                    <span>{post.commentsCount ?? 0}</span>
                </button>

                <button aria-label="Compartilhar publicação" className="flex items-center gap-1.5 transition-colors hover:text-blue-600">
                    <i className="fa-solid fa-share-nodes text-sm" />
                    <span className="hidden sm:inline">Compartilhar</span>
                </button>

                <button aria-label="Salvar publicação" className="ml-auto text-slate-400 transition-colors hover:text-slate-600">
                    <i className="fa-regular fa-bookmark text-sm" />
                </button>
            </div>

            {/* COMENTÁRIOS */}
            <PostComments comments={post.comments} user={user} />
        </article>
    );
}
