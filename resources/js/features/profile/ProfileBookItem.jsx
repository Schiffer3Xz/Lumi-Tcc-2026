export default function ProfileBookItem({ book }) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-[#E3DCCE]/60 bg-white/80 p-3 backdrop-blur-xs">
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-amber-100/60 text-amber-800">
                    {book.cover ? (
                        <img src={book.cover} alt={book.title} className="h-full w-full object-cover" />
                    ) : (
                        <i className="fa-solid fa-book text-sm" />
                    )}
                </div>
                <div className="min-w-0">
                    <h5 className="truncate text-xs font-bold text-slate-800">{book.title || 'Título indisponível'}</h5>
                    <p className="truncate text-[11px] text-slate-500">{book.author || 'Autor não informado'}</p>
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
                <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        book.status === 'Lendo'
                            ? 'bg-blue-100 text-blue-700'
                            : book.status === 'Lido'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-800'
                    }`}
                >
                    {book.status}
                </span>
            </div>
        </div>
    );
}
