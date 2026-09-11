import ProfileBookItem from './ProfileBookItem';
export default function ProfileBookHistory({ books }) {
    return (
        <div className="space-y-4 rounded-2xl border border-[#E3DCCE] bg-[#EFEAE1] p-6 text-slate-800">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-amber-400/30 p-2 text-amber-900">
                        <i className="fa-solid fa-books text-lg" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold">Livros Adicionados</h4>
                        <p className="text-xs text-slate-500">Títulos registrados pelo usuário</p>
                    </div>
                </div>
                <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-semibold text-slate-700">{books.length} Títulos</span>
            </div>

            <div className="space-y-2.5">
                {books.length > 0 ? (
                    books.map((book, idx) => <ProfileBookItem key={`${book.status}-${book.id ?? idx}`} book={book} />)
                ) : (
                    <p className="py-4 text-center text-xs text-slate-500">Nenhum livro registrado no momento.</p>
                )}
            </div>
        </div>
    );
}
