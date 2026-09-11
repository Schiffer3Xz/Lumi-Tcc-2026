import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function FollowButton({ userId, initialIsFollowing = false }) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    return (
        <button
            onClick={() => {
                if (isFollowing) {
                    router.delete(route('follow.destroy', userId), {
                        onSuccess: () => setIsFollowing(false),
                    });
                } else {
                    router.post(
                        route('follow.store', userId),
                        {},
                        {
                            preserveScroll: true,
                            preserveState: true,
                            onSuccess: () => setIsFollowing(true),
                        },
                    );
                }
            }}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium transition-colors ${
                isFollowing ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
        >
            <i className={`fa-solid ${isFollowing ? 'fa-user-check' : 'fa-user-plus'} text-xs`} />

            {isFollowing ? 'Seguindo' : 'Seguir'}
        </button>
    );
}
