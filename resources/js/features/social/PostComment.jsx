export default function PostComment({ comment }) {
    return (
        <div className="flex items-start gap-2.5 pt-1 text-xs">
            <div
                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    comment.bg ?? 'bg-slate-100 text-slate-700'
                }`}
            >
                {comment.avatar ?? comment.user?.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 rounded-xl border border-slate-100 bg-slate-50/80 p-2.5">
                <div className="mb-0.5 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-800">{comment.user}</span>

                    <span className="text-[9px] text-slate-400">{comment.time}</span>
                </div>

                <p className="text-[11px] leading-relaxed text-slate-600">{comment.text}</p>
            </div>
        </div>
    );
}
