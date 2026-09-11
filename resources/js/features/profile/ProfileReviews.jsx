export default function ProfileReviews({ reviews }) {
    return (
        <div className="space-y-3 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-400 uppercase">
                <i className="fa-solid fa-star text-[10px] text-amber-500" />
                <span>Últimas Avaliações</span>
            </div>

            <div className="space-y-2">
                {reviews.slice(0, 3).map((review, idx) => (
                    <div key={review.id ?? idx} className="space-y-1 rounded-xl border border-slate-200/60 bg-slate-50 p-3">
                        <div className="flex items-center justify-between">
                            <span className="truncate text-xs font-bold text-slate-800">{review.title || 'Livro Avaliado'}</span>
                            <span className="shrink-0 text-xs font-bold text-amber-500">★ {review.rating || 5}</span>
                        </div>
                        {review.comment && <p className="truncate text-[11px] text-slate-500 italic">"{review.comment}"</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}
