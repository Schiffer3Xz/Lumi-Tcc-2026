import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link, router, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import PostBookCard from './PostBookCard';
import PostComments from './PostComments';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function PostCard({ post, user }) {
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportText, setReportText] = useState('');
    const inputRef = useRef(null);
    const requestPending = useRef(false);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState('');
    const [shareFallback, setShareFallback] = useState(false);
    const [editing, setEditing] = useState(false);
    const editForm = useForm({ content: post.content });
    const isLiked = post.isLiked;
    const isSaved = post.isSaved;

    const mutate = (method, url) => {
        if (requestPending.current || editForm.processing) return;
        requestPending.current = true;
        setBusy(true);
        setMessage('');
        router.visit(url, {
            method,
            preserveScroll: true,
            preserveState: true,
            onError: () => setMessage('Não foi possível concluir a ação. Tente novamente.'),
            onFinish: () => {
                requestPending.current = false;
                setBusy(false);
            },
        });
    };

    const copyLink = async () => {
        setMessage('');
        try {
            await navigator.clipboard.writeText(post.url);
            setShareFallback(false);
            setMessage('Link copiado!');
        } catch {
            setShareFallback(true);
            setMessage('Copie o link abaixo para compartilhar.');
        }
    };

    const share = async () => {
        setMessage('');
        if (!navigator.share) return copyLink();
        try {
            await navigator.share({ title: 'Publicação no Lumi', url: post.url });
        } catch (error) {
            if (error.name !== 'AbortError') await copyLink();
        }
    };

    const deletePost = () => {
        if (window.confirm('Excluir esta publicação e seus comentários?')) {
            mutate('delete', route('posts.destroy', post.id));
        }
    };

    const saveEdit = (event) => {
        event.preventDefault();
        if (busy || editForm.processing) return;
        editForm.patch(route('posts.update', post.id), {
            preserveScroll: true,
            onSuccess: () => setEditing(false),
        });
    };


    return (
        <article
            id={`post-${post.id}`}
            className="flex flex-col gap-4 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-xs transition-all hover:border-slate-300/80"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white shadow-xs ${post.author?.bg ?? 'bg-slate-800'}`}
                    >
                        {post.author?.avatar ?? post.author?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <Link
                                href={post.canManage ? route('profile') : route('people', post.author.id)}
                                className="text-xs font-bold text-slate-800 hover:text-blue-600"
                            >
                                {post.author?.name}
                            </Link>
                            {post.author?.username && <span className="text-[11px] text-slate-400">@{post.author.username}</span>}
                        </div>
                        <p className="text-[10px] text-slate-400">{post.time}</p>
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            disabled={busy || editForm.processing}
                            aria-label="Mais opções da publicação"
                            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
                        >
                            <i className="fa-solid fa-ellipsis-vertical" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={copyLink}>Copiar link</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => mutate(isSaved ? 'delete' : 'put', route('posts.save', post.id))}>
                            {isSaved ? 'Remover dos salvos' : 'Salvar publicação'}
                        </DropdownMenuItem>
                        {post.canManage && (
                            <>
                                <DropdownMenuItem
                                    onSelect={() => {
                                        editForm.setData('content', post.content);
                                        editForm.clearErrors();
                                        setEditing(true);
                                    }}
                                >
                                    Editar publicação
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={deletePost} className="text-red-600">
                                    Excluir publicação
                                </DropdownMenuItem>
                            </>
                        )}

                            <DropdownMenuItem
                                onSelect={() => {
                                    setReportText('');
                                    setShowReportModal(true);
                                }}
                            >
                                Denunciar Comentário
                            </DropdownMenuItem>

                       <Dialog
                            open={showReportModal}
                            onOpenChange={setShowReportModal}
                        >
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Denunciar comentário</DialogTitle>

                                    <DialogDescription>
                                        Explique o motivo da denúncia. Sua informação será analisada.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="py-4">
                                    <Textarea
                                        placeholder="Descreva o motivo da denúncia..."
                                        value={reportText}
                                        onChange={(e) => setReportText(e.target.value)}
                                        rows={5}
                                    />
                                </div>

                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowReportModal(false)}
                                    >
                                        Cancelar
                                    </Button>

                                    <Button
                                        variant="destructive"
                                        disabled={!reportText.trim()}
                                        onClick={() => {
                                            console.log(reportText);

                                            // Aqui você envia para o Laravel

                                            setShowReportModal(false);
                                            setReportText('');
                                        }}
                                    >
                                        Enviar denúncia
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>



                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {editing ? (
                <form onSubmit={saveEdit} className="space-y-2">
                    <textarea
                        autoFocus
                        aria-label="Editar texto da publicação"
                        value={editForm.data.content}
                        onChange={(event) => editForm.setData('content', event.target.value)}
                        maxLength={5000}
                        disabled={editForm.processing}
                        className="min-h-24 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-700"
                    />
                    {editForm.errors.content && (
                        <p role="alert" className="text-xs text-red-600">
                            {editForm.errors.content}
                        </p>
                    )}
                    <div className="flex gap-3 text-xs">
                        <button
                            type="submit"
                            disabled={busy || editForm.processing || (!post.image && !editForm.data.content.trim())}
                            className="rounded-lg bg-blue-600 px-3 py-2 text-white disabled:opacity-40"
                        >
                            {editForm.processing ? 'Salvando...' : 'Salvar alterações'}
                        </button>
                        <button type="button" disabled={editForm.processing} onClick={() => setEditing(false)}>
                            Cancelar
                        </button>
                    </div>
                </form>
            ) : (
                <p className="text-xs leading-relaxed break-words whitespace-pre-wrap text-slate-600">{post.content}</p>
            )}

            {post.book && <PostBookCard book={post.book} />}
            {post.image && (
                <div className="flex max-h-[360px] min-h-[180px] items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-900/5">
                    <img
                        src={post.image}
                        alt="Imagem da publicação"
                        className="block max-h-[360px] w-full object-contain transition-transform duration-300 hover:scale-[1.01]"
                    />
                </div>
            )}

            <div className="flex items-center gap-6 border-t border-slate-100 pt-3 text-xs font-medium text-slate-500">
                <button
                    type="button"
                    disabled={busy || editForm.processing}
                    onClick={() => mutate(isLiked ? 'delete' : 'put', route('posts.like', post.id))}
                    aria-label={isLiked ? 'Descurtir publicação' : 'Curtir publicação'}
                    aria-pressed={isLiked}
                    className={`flex items-center gap-1.5 transition-colors disabled:opacity-40 ${isLiked ? 'font-bold text-rose-500' : 'hover:text-rose-500'}`}
                >
                    <i className={`${isLiked ? 'fa-solid' : 'fa-regular'} fa-heart text-sm`} />
                    <span>{post.likesCount ?? 0}</span>
                </button>
                <button
                    type="button"
                    onClick={() => inputRef.current?.focus()}
                    aria-label="Comentar publicação"
                    className="flex items-center gap-1.5 transition-colors hover:text-blue-600"
                >
                    <i className="fa-regular fa-comment text-sm" />
                    <span>{post.commentsCount ?? 0}</span>
                </button>
                <button
                    type="button"
                    onClick={share}
                    aria-label="Compartilhar publicação"
                    className="flex items-center gap-1.5 transition-colors hover:text-blue-600"
                >
                    <i className="fa-solid fa-share-nodes text-sm" />
                    <span className="hidden sm:inline">Compartilhar</span>
                </button>
                <button
                    type="button"
                    disabled={busy || editForm.processing}
                    onClick={() => mutate(isSaved ? 'delete' : 'put', route('posts.save', post.id))}
                    aria-label={isSaved ? 'Remover publicação dos salvos' : 'Salvar publicação'}
                    aria-pressed={isSaved}
                    className={`ml-auto transition-colors disabled:opacity-40 ${isSaved ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <i className={`${isSaved ? 'fa-solid' : 'fa-regular'} fa-bookmark text-sm`} />
                </button>
            </div>
            {message && (
                <p role="status" className="text-xs text-slate-600">
                    {message}
                </p>
            )}
            {shareFallback && (
                <input
                    readOnly
                    aria-label="Link da publicação"
                    value={post.url}
                    onFocus={(event) => event.target.select()}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                />
            )}
            <PostComments
                postId={post.id}
                comments={post.comments}
                user={user}
                inputRef={inputRef}
                busy={busy || editForm.processing}
                onDelete={(commentId) => {
                    if (window.confirm('Excluir este comentário?')) mutate('delete', route('posts.comments.destroy', [post.id, commentId]));
                }}
            />
        </article>
    );
}
