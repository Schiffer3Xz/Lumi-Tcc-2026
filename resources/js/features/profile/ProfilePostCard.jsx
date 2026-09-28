import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link, useForm } from '@inertiajs/react';

function PostOptions({ postId }) {
    const { delete: destroy, processing, errors } = useForm({});
    const handleDelete = () => {
        if (!processing && window.confirm('Tem certeza que deseja excluir esta publicação?')) {
            destroy(route('posts.destroy', postId), { preserveScroll: true });
        }
    };
    return (
        <div className="shrink-0">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        disabled={processing}
                        aria-label="Mais opções da publicação"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50"
                    >
                        <i className="fa-solid fa-ellipsis-vertical text-xs" aria-hidden="true" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-slate-200 bg-white text-slate-800">
                    <DropdownMenuItem onSelect={handleDelete} className="text-red-600 focus:bg-red-50 focus:text-red-700">
                        Excluir
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {Object.values(errors).map((error) => (
                <p key={error} role="alert" className="text-xs text-red-600">
                    {error}
                </p>
            ))}
        </div>
    );
}

function PostHeader({ post, user }) {
    return (
        <div className="flex items-center justify-between gap-2 p-3">
            <div className="flex min-w-0 items-center gap-2.5">
                <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[11px] font-bold text-white"
                    aria-hidden="true"
                >
                    {user.name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                    <h3 className="truncate text-xs font-semibold text-slate-900">{user.name}</h3>
                    <p className="text-[10px] text-slate-500">{post.time}</p>
                </div>
            </div>
            <PostOptions postId={post.id} />
        </div>
    );
}

function PostLink({ post }) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
            <span>
                <i className="fa-regular fa-heart mr-1" aria-hidden="true" />
                {post.likes} curtidas · {post.comments} comentários
            </span>
            <Link
                href={route('list', { post: post.id })}
                className="rounded-lg py-1 font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                aria-label="Abrir publicação para curtir, comentar, compartilhar ou salvar"
            >
                Ver publicação <span aria-hidden="true">→</span>
            </Link>
        </div>
    );
}

export default function ProfilePostCard({ post, user, variant = 'grid' }) {
    return (
        <article className="min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-shadow hover:shadow-md">
            <PostHeader post={post} user={user} />
            {post.imageUrl && (
                <Link
                    href={route('list', { post: post.id })}
                    className={`block bg-slate-100 ${variant === 'grid' ? 'aspect-[0.8/1]' : 'h-80'}`}
                    aria-label="Abrir publicação"
                >
                    <img
                        src={post.imageUrl}
                        alt={post.book ? `Capa de ${post.book.title}` : 'Imagem da publicação'}
                        loading="lazy"
                        className="h-full w-full object-cover"
                    />
                </Link>
            )}
            <div className="space-y-3 p-3">
                <p className="text-xs leading-relaxed break-words whitespace-pre-wrap text-slate-600">{post.caption || post.book?.title}</p>
                {post.book && (
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500">
                        <span>
                            <i className="fa-solid fa-star mr-1 text-yellow-400" aria-hidden="true" />
                            {Number(post.book.rating || 0).toFixed(1)}
                        </span>
                        <span className="break-words">
                            <i className="fa-solid fa-building mr-1" aria-hidden="true" />
                            {post.book.publisher ?? 'Editora não informada'}
                        </span>
                        <span>
                            <i className="fa-solid fa-file-lines mr-1" aria-hidden="true" />
                            {post.book.page_count ?? '-'} páginas
                        </span>
                        <span>
                            <i className="fa-regular fa-calendar mr-1" aria-hidden="true" />
                            {post.book.publication_year ?? '-'}
                        </span>
                        <span className="col-span-2">
                            <i className="fa-solid fa-users mr-1" aria-hidden="true" />
                            {post.book.readers_count ?? 0} leitores
                        </span>
                    </div>
                )}
                <PostLink post={post} />
            </div>
        </article>
    );
}
