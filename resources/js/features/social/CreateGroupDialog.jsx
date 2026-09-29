import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function CreateGroupDialog({ users, onClose, onCreated }) {
    const form = useForm({ name: '', participants: [] });
    const [search, setSearch] = useState('');
    const query = search.trim().toLocaleLowerCase('pt-BR');
    const filteredUsers = users.filter((user) => `${user.name} ${user.nickname ?? ''}`.toLocaleLowerCase('pt-BR').includes(query));

    const toggleParticipant = (id) => {
        form.setData('participants', form.data.participants.includes(id)
            ? form.data.participants.filter((selected) => selected !== id)
            : [...form.data.participants, id]);
    };

    const submit = (event) => {
        event.preventDefault();
        if (form.processing) return;
        form.post(route('chat.groups.store'), {
            preserveScroll: true,
            onSuccess: (page) => {
                const group = page.props.groupConversations.find((item) => item.id === page.props.filters.group);
                onCreated(group);
            },
        });
    };

    return (
        <Dialog open onOpenChange={(open) => { if (!open && !form.processing) onClose(); }}>
            <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl">
                <DialogHeader>
                    <DialogTitle>Criar grupo</DialogTitle>
                    <DialogDescription>Escolha um nome e pelo menos dois leitores. Você também fará parte do grupo.</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label htmlFor="group-name" className="text-sm font-medium text-slate-700">Nome do grupo</label>
                        <input id="group-name" autoFocus required maxLength={100} disabled={form.processing}
                            value={form.data.name} onChange={(event) => form.setData('name', event.target.value)}
                            placeholder="Ex.: Clube de leitura"
                            className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm" />
                    </div>
                    <div>
                        <label htmlFor="group-search" className="text-sm font-medium text-slate-700">Participantes ({form.data.participants.length} selecionados)</label>
                        <input id="group-search" value={search} onChange={(event) => setSearch(event.target.value)}
                            placeholder="Buscar leitores..." className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm" />
                        <div className="mt-2 max-h-56 space-y-1 overflow-y-auto">
                            {filteredUsers.map((user) => (
                                <label key={user.id} className="flex cursor-pointer items-center gap-3 rounded-xl p-3 hover:bg-slate-50">
                                    <input type="checkbox" checked={form.data.participants.includes(user.id)}
                                        disabled={form.processing || (form.data.participants.length >= 49 && !form.data.participants.includes(user.id))}
                                        onChange={() => toggleParticipant(user.id)} />
                                    <span className="text-sm text-slate-700">{user.name}</span>
                                </label>
                            ))}
                            {!filteredUsers.length && <p className="p-3 text-sm text-slate-500">Nenhum leitor encontrado.</p>}
                        </div>
                    </div>
                    {Object.entries(form.errors).map(([field, error]) => <p key={field} role="alert" className="text-sm text-red-600">{error}</p>)}
                    <div className="flex justify-end gap-3">
                        <button type="button" disabled={form.processing} onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2 text-sm">Cancelar</button>
                        <button type="submit" disabled={form.processing || !form.data.name.trim() || form.data.participants.length < 2}
                            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                            {form.processing ? 'Criando...' : 'Criar grupo'}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
