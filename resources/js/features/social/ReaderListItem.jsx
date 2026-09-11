export default function ReaderListItem({ user, variant = 'profile', isActive = false, onClick }) {
    if (variant === 'featured') {
        return (
            <button
                type="button"
                onClick={onClick}
                className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-transparent p-2 text-left transition-all hover:border-slate-100 hover:bg-slate-50"
            >
                <div className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                    {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()}

                    <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full border border-white bg-emerald-500" />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-slate-800">{user.name}</p>

                    <p className="truncate text-[10px] text-slate-400">@{user.nickname}</p>
                </div>

                <i className="fa-regular fa-comment text-xs text-slate-300 transition-colors hover:text-blue-600" />
            </button>
        );
    }
    return (
        <button
            onClick={onClick}
            className={`flex w-full items-center justify-between rounded-xl p-2.5 text-left transition-colors ${
                isActive ? 'border border-amber-200 bg-amber-50' : 'border border-transparent hover:bg-slate-50'
            }`}
        >
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                    {user.profile_photo ? (
                        <img src={user.profile_photo} alt={user.name} className="h-full w-full object-cover" />
                    ) : user.name ? (
                        user.name.charAt(0).toUpperCase()
                    ) : (
                        'U'
                    )}
                </div>
                <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-slate-800">{user.name}</p>
                    {user.nickname && <p className="truncate text-[10px] text-slate-400">@{user.nickname.replace('@', '')}</p>}
                </div>
            </div>
            <i className="fa-solid fa-chevron-right text-[10px] text-slate-400" />
        </button>
    );
}
