import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { Link, router, useForm } from '@inertiajs/react';
import { CircleCheck, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import ModerationAlert from './ModerationAlert';
import PostBookCard from './PostBookCard';
import PostComments from './PostComments';

import ReportPostDialog from './ReportPostDialog';

export default function PostCard({ post, user }) {
    const inputRef = useRef(null);
    const menuTriggerRef = useRef(null);
    const requestPending = useRef(false);

    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState('');
    const [shareFallback, setShareFallback] = useState(false);
    const [editing, setEditing] = useState(false);
    const [moderationMessage, setModerationMessage] = useState('');
    const [showComments, setShowComments] = useState(false);

    const [showReportModal, setShowReportModal] = useState(false);
    const [reportSuccess, setReportSuccess] = useState(false);

    useEffect(() => {
        if (!reportSuccess) return;

        const timeout = window.setTimeout(() => setReportSuccess(false), 5000);
        return () => window.clearTimeout(timeout);
    }, [reportSuccess]);

    const editForm = useForm({
        content: post.content,
    });

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

            onError: () => {
                setMessage('Não foi possível concluir a ação. Tente novamente.');
            },

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

        if (!navigator.share) {
            return copyLink();
        }

        try {
            await navigator.share({
                title: 'Publicação no Lumi',
                url: post.url,
            });
        } catch (error) {
            if (error.name !== 'AbortError') {
                await copyLink();
            }
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
            onError: (errors) => {
                if (errors.moderation) setModerationMessage(errors.moderation);
            },

            onSuccess: () => {
                setEditing(false);
            },
        });
    };

    const openReportModal = () => {
        setReportSuccess(false);
        setShowReportModal(true);
    };

    return (
        <article
            id={`post-${post.id}`}
            className="flex flex-col gap-4 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-xs transition-all hover:border-slate-300/80"
        >
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
                            <Link
                                href={post.canManage ? route('profile') : route('people', post.author.id)}
                                className="text-xs font-bold text-slate-800 hover:text-blue-600"
                            >
                                {post.author?.name}
                            </Link>

                            {post.author?.username && <span className="text-caption text-slate-400">@{post.author.username}</span>}
                        </div>

                        <p className="text-caption-sm text-slate-400">{post.time}</p>
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            ref={menuTriggerRef}
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

                        <DropdownMenuItem onSelect={openReportModal}>Denunciar publicação</DropdownMenuItem>
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
                    className={`flex items-center gap-1.5 transition-colors disabled:opacity-40 ${
                        isLiked ? 'font-bold text-rose-500' : 'hover:text-rose-500'
                    }`}
                >
                    <i className={`${isLiked ? 'fa-solid' : 'fa-regular'} fa-heart text-sm`} />

                    <span>{post.likesCount ?? 0}</span>
                </button>

                <button
                    type="button"
                    onClick={() => setShowComments((visible) => !visible)}
                    aria-expanded={showComments}
                    aria-controls={`post-comments-${post.id}`}
                    aria-label={showComments ? 'Ocultar comentários' : 'Mostrar comentários'}
                    className="flex items-center gap-1.5 transition-colors hover:text-blue-600"
                >
                    <i className="fa-regular fa-comment text-sm" />

                    <span>
                        {showComments ? 'Ocultar comentários' : 'Comentários'} ({post.commentsCount ?? 0})
                    </span>
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

            {reportSuccess &&
                createPortal(
                    <div
                        role="status"
                        className="fixed top-4 right-4 z-[100] flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-emerald-800 shadow-lg sm:top-6 sm:right-6"
                    >
                        <CircleCheck className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                        <p className="text-xs font-medium">Denúncia enviada com sucesso!</p>
                        <button
                            type="button"
                            onClick={() => setReportSuccess(false)}
                            aria-label="Fechar mensagem de sucesso"
                            className="rounded-lg p-1 text-emerald-600 transition-colors hover:bg-emerald-100 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
                        >
                            <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                    </div>,
                    document.body,
                )}

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

            <div id={`post-comments-${post.id}`} hidden={!showComments}>
                <PostComments
                    postId={post.id}
                    comments={post.comments}
                    user={user}
                    inputRef={inputRef}
                    busy={busy || editForm.processing}
                    onDelete={(commentId) => {
                        if (window.confirm('Excluir este comentário?')) {
                            mutate('delete', route('posts.comments.destroy', [post.id, commentId]));
                        }
                    }}
                />
            </div>

            <ModerationAlert message={moderationMessage} onClose={() => setModerationMessage('')} />
            <ReportPostDialog
                postId={post.id}
                open={showReportModal}
                onClose={() => setShowReportModal(false)}
                onSuccess={() => setReportSuccess(true)}
                returnFocusRef={menuTriggerRef}
            />
        </article>
    );
}
