import { useForm } from '@inertiajs/react';
import PostComment from './PostComment';

export default function PostComments({ postId, comments = [], user, inputRef, busy, onDelete }) {
    const { data, setData, post, processing, errors, reset } = useForm({ content: '' });

    const submit = (event) => {
        event.preventDefault();
        if (!data.content.trim() || processing || busy) return;
        post(route('posts.comments.store', postId), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                inputRef.current?.focus();
            },
        });
    };

    return (
        <div className="flex flex-col gap-3 pt-1">
            <form onSubmit={submit} className="flex items-center gap-2">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-white">
                    {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="relative flex-1">
                    <input
                        ref={inputRef}
                        type="text"
                        value={data.content}
                        onChange={(event) => setData('content', event.target.value)}
                        maxLength={2000}
                        disabled={processing}
                        aria-label="Escreva um comentário"
                        aria-invalid={Boolean(errors.content)}
                        aria-describedby={errors.content ? `comment-error-${postId}` : undefined}
                        placeholder="Escreva um comentário..."
                        className="w-full rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-1.5 pr-8 text-xs text-slate-700 transition-all outline-none focus:border-blue-400 focus:bg-white"
                    />
                    <button
                        type="submit"
                        disabled={processing || busy || !data.content.trim()}
                        aria-label={processing ? 'Enviando comentário' : 'Enviar comentário'}
                        className="absolute top-1/2 right-2.5 -translate-y-1/2 text-xs text-slate-400 transition-colors hover:text-blue-600 disabled:opacity-40"
                    >
                        <i className="fa-solid fa-paper-plane" />
                    </button>
                </div>
            </form>
            {errors.content && (
                <p id={`comment-error-${postId}`} role="alert" className="text-xs text-red-600">
                    {errors.content}
                </p>
            )}
            {comments.map((comment) => (
                <div key={comment.id}>
                    <PostComment comment={comment} />
                    {comment.canDelete && (
                        <button
                            type="button"
                            disabled={busy || processing}
                            onClick={() => onDelete(comment.id)}
                            className="ml-9 text-[10px] text-slate-500 hover:text-red-600 disabled:opacity-40"
                        >
                            Excluir comentário
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
