export default function PostBookCard({ book }) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200/60 bg-slate-50/70 p-3">
            <div
                className={`flex h-12 w-9 flex-shrink-0 items-center justify-center rounded-md ${book.coverBg} text-sm font-bold text-white shadow-xs`}
            >
                📖
            </div>

            <div className="min-w-0">
                <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[9px] font-bold tracking-wider text-amber-800 uppercase">{book.badge}</span>

                <p className="mt-1 truncate text-xs font-bold text-slate-800">{book.title}</p>

                <p className="text-[10px] text-slate-500">{book.author}</p>
            </div>
        </div>
    );
}
