import PostComment from './PostComment';
export default function PostComments({ comments = [], user }) {
    return (
        <div className="flex flex-col gap-3 pt-1">
            {/* INPUT */}
            <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                </div>

                <div className="relative flex-1">
                    <input
                        type="text"
                        aria-label="Escreva um comentário"
                        placeholder="Escreva um comentário..."
                        className="w-full rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-1.5 pr-8 text-xs text-slate-700 transition-all outline-none focus:border-blue-400 focus:bg-white"
                    />

                    <button
                        aria-label="Enviar comentário"
                        className="absolute top-1/2 right-2.5 -translate-y-1/2 text-xs text-slate-400 transition-colors hover:text-blue-600"
                    >
                        <i className="fa-solid fa-paper-plane" />
                    </button>
                </div>
            </div>

            {/* COMENTÁRIOS REAIS */}
            {comments?.map((comment) => (
                <PostComment key={comment.id} comment={comment} />
            ))}
        </div>
    );
}
