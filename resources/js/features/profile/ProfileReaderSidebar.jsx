import ReaderListItem from '@/features/social/ReaderListItem';
import ProfileReviews from './ProfileReviews';
export default function ProfileReaderSidebar({ users, selectedUserId, onSelectUser, reviews }) {
    return (
        <aside className="hidden w-80 space-y-6 overflow-y-auto border-l border-slate-200/80 bg-white p-6 lg:block">
            <div>
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">COMUNIDADE</span>
                <h3 className="text-base font-bold text-slate-900">Outros Usuários</h3>
            </div>

            {/* LISTA DE USUÁRIOS VINDOS DA PROP `users` */}
            <div className="space-y-2">
                {users && users.length > 0 ? (
                    users.map((u) => <ReaderListItem key={u.id} user={u} isActive={u.id === selectedUserId} onClick={() => onSelectUser(u.id)} />)
                ) : (
                    <p className="text-xs text-slate-400 italic">Nenhum outro usuário encontrado.</p>
                )}
            </div>

            {/* AVALIAÇÕES EM DESTAQUE DO USUÁRIO */}
            {reviews.length > 0 && <ProfileReviews reviews={reviews} />}
        </aside>
    );
}
