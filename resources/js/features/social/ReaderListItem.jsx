import FollowButton from '@/features/profile/FollowButton';
import { Link } from '@inertiajs/react';

export default function ReaderListItem({ user, variant = 'profile', isActive = false, onClick, onChat }) {
    if (variant === 'featured') {
        return (
            <div className="flex w-full items-center gap-1 rounded-xl border border-transparent p-2 transition-all hover:border-slate-100 hover:bg-slate-50">
                <Link href={route('people', user.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                        {user.name
                            .split(' ')
                            .filter(Boolean)
                            .map((name) => name[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-slate-800">{user.name}</p>
                        {user.nickname && <p className="truncate text-[10px] text-slate-400">@{user.nickname.replace(/^@/, '')}</p>}
                    </div>
                </Link>
                <FollowButton userId={user.id} initialIsFollowing={user.isFollowing} compact />
                {onChat && (
                    <button
                        type="button"
                        onClick={onChat}
                        aria-label={`Conversar com ${user.name}`}
                        title="Abrir conversa"
                        className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                    >
                        <i className="fa-regular fa-comment text-sm" aria-hidden="true" />
                        {user.unreadMessages > 0 && (
                            <span className="absolute -top-1 -right-1 rounded-full bg-rose-500 px-1 text-[9px] text-white">
                                {user.unreadMessages}
                                <span className="sr-only"> mensagens não lidas</span>
                            </span>
                        )}
                    </button>
                )}
            </div>
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
