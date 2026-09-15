import { useForm } from '@inertiajs/react';

export default function FollowButton({ userId, initialIsFollowing = false, compact = false }) {
    const { post, delete: destroy, processing, errors } = useForm({});
    const toggle = () => {
        if (processing) return;
        const options = { preserveScroll: true, preserveState: true };
        if (initialIsFollowing) destroy(route('follow.destroy', userId), options);
        else post(route('follow.store', userId), options);
    };
    return (
        <div>
            <button
                type="button"
                disabled={processing}
                onClick={toggle}
                aria-label={initialIsFollowing ? 'Deixar de seguir leitor' : 'Seguir leitor'}
                aria-pressed={initialIsFollowing}
                title={initialIsFollowing ? 'Deixar de seguir' : 'Seguir'}
                className={`flex items-center justify-center gap-1.5 rounded-xl text-xs font-medium transition-colors disabled:opacity-40 ${compact ? 'h-8 w-8' : 'px-4 py-2'} ${initialIsFollowing ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
                <i className={`fa-solid ${initialIsFollowing ? 'fa-user-check' : 'fa-user-plus'} text-xs`} aria-hidden="true" />
                {!compact && (processing ? 'Salvando...' : initialIsFollowing ? 'Seguindo' : 'Seguir')}
            </button>
            {Object.values(errors).map((error) => (
                <p key={error} role="alert" className="text-xs text-red-600">
                    {error}
                </p>
            ))}
        </div>
    );
}
