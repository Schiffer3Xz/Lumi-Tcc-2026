import { router } from '@inertiajs/react';
import { useRef, useState } from 'react';
import chatRequest from './chatRequest';

export default function GroupManagement({ group, onDeleted }) {
    const [expanded, setExpanded] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const pending = useRef(false);

    const remove = async (member = null) => {
        if (pending.current) return;
        const confirmation = member
            ? `Remover ${member.name} do grupo? Essa pessoa perderá acesso à conversa.`
            : `Excluir o grupo "${group.name}" e todas as mensagens para todos os participantes? Essa ação não pode ser desfeita.`;
        if (!window.confirm(confirmation)) return;

        pending.current = true;
        setBusy(true);
        setError('');
        try {
            await chatRequest(
                member ? route('chat.groups.participants.destroy', [group.id, member.id], false) : route('chat.groups.destroy', group.id, false),
                {
                    method: 'DELETE',
                },
            );
            if (!member) {
                onDeleted();
                return;
            }
            router.reload({
                only: ['groupConversations'],
                onFinish: () => {
                    pending.current = false;
                    setBusy(false);
                },
            });
        } catch (failure) {
            setError(failure.message || 'Não foi possível concluir a ação. Tente novamente.');
            pending.current = false;
            setBusy(false);
        }
    };

    if (!group.can_manage) return null;

    return (
        <div className="mt-3">
            <button
                type="button"
                onClick={() => setExpanded((open) => !open)}
                aria-expanded={expanded}
                aria-controls={`manage-group-${group.id}`}
                className="text-xs font-semibold text-blue-600 hover:underline"
            >
                {expanded ? 'Ocultar opções do grupo' : 'Gerenciar grupo'}
            </button>
            {expanded && (
                <div id={`manage-group-${group.id}`} className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
                    <h3 className="mb-2 text-xs font-semibold text-slate-700">Integrantes</h3>
                    <ul className="max-h-40 space-y-2 overflow-y-auto">
                        {group.participants.map((member) => (
                            <li key={member.id} className="flex items-center justify-between gap-3 text-xs">
                                <span className="min-w-0 break-words text-slate-700">{member.name}</span>
                                {Number(member.id) === Number(group.created_by) ? (
                                    <span className="text-slate-400">Criador</span>
                                ) : (
                                    <button
                                        type="button"
                                        disabled={busy}
                                        onClick={() => remove(member)}
                                        aria-label={`Remover ${member.name}`}
                                        className="shrink-0 rounded-lg px-2 py-1 text-red-600 hover:bg-red-50 disabled:opacity-40"
                                    >
                                        Remover
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                    <button
                        type="button"
                        disabled={busy}
                        onClick={() => remove()}
                        className="mt-3 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-40"
                    >
                        Excluir grupo
                    </button>
                    {busy && (
                        <p role="status" className="mt-2 text-xs text-slate-500">
                            Atualizando grupo...
                        </p>
                    )}
                    {error && (
                        <p role="alert" className="mt-2 text-xs text-red-600">
                            {error}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
