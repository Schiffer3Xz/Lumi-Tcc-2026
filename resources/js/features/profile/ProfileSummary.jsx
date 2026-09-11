export default function ProfileSummary({ user, variant = 'personal', action }) {
    if (variant === 'personal') {
        return (
            <div className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-5">
                        <div className="relative shrink-0">
                            <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-amber-400 to-indigo-600 p-[2px]">
                                <div className="h-full w-full rounded-full bg-white p-[2px]">
                                    <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-800 text-2xl font-bold text-white">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                            </div>
                            <span className="absolute right-1 bottom-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                                <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                                    🛡️ Aluno Verificado
                                </span>
                            </div>
                            <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                    </div>

                    {action}
                </div>

                {/* BIO */}
                <p className="max-w-2xl text-xs leading-relaxed text-slate-600">"{user.bio}"</p>

                {/* CONTADORES SOCIAIS */}
                <div className="flex items-center gap-8 border-t border-slate-100 pt-3 text-xs">
                    {[
                        { label: 'Seguidores', count: user.followers },
                        { label: 'Seguindo', count: user.following },
                        { label: 'Amigos', count: user.friends },
                    ].map(({ label, count }) => (
                        <div key={label} className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-slate-900">{count}</span>
                            <span className="text-slate-500">{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-amber-200 bg-amber-100 text-xl font-bold text-amber-800">
                        {user.profile_photo ? (
                            <img src={user.profile_photo} alt={user.name} className="h-full w-full object-cover" />
                        ) : user.name ? (
                            user.name.charAt(0).toUpperCase()
                        ) : (
                            'U'
                        )}
                    </div>
                    <span className="absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900">{user.name}</h3>
                        {user.nickname && <span className="text-xs font-medium text-slate-400">@{user.nickname.replace('@', '')}</span>}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{user.description || 'Nenhuma descrição informada.'}</p>
                </div>
            </div>
            {action}
        </div>
    );
}
