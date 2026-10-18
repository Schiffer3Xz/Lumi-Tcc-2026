import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Check, Loader2, Search, Users, X } from 'lucide-react';

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
            <DialogContent className="max-h-[90dvh] gap-0 overflow-y-auto rounded-3xl border-slate-200 bg-white p-0 shadow-2xl">
                <DialogHeader className="border-b border-blue-100 bg-gradient-to-br from-blue-50 via-indigo-50/60 to-white px-6 pt-7 pb-6 text-left">
                    <span className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200"><Users size={24} aria-hidden="true" /></span>
                    <p className="text-[11px] font-bold tracking-widest text-blue-600 uppercase">Leituras que conectam</p>
                    <DialogTitle>Criar grupo</DialogTitle>
                    <DialogDescription>Escolha um nome e pelo menos dois leitores. Você também fará parte do grupo.</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-5 p-6" aria-busy={form.processing}>
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="group-name" className="text-sm font-semibold text-slate-800">Nome do grupo</label>
                            <span className="text-xs tabular-nums text-slate-400">{form.data.name.length}/100</span>
                        </div>
                        <input id="group-name" autoFocus required maxLength={100} disabled={form.processing}
                            value={form.data.name} onChange={(event) => form.setData('name', event.target.value)}
                            placeholder="Ex.: Clube de leitura"
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50" />
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="group-search" className="text-sm font-semibold text-slate-800">Convide leitores</label>
                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">{form.data.participants.length}/49</span>
                        </div>
                        <div className="relative mt-3">
                            <Search size={17} aria-hidden="true" className="pointer-events-none absolute top-3.5 left-3.5 text-slate-400" />
                            <input id="group-search" value={search} disabled={form.processing} onChange={(event) => setSearch(event.target.value)}
                                placeholder="Buscar leitores..." className="w-full rounded-xl border border-slate-200 py-3 pr-3 pl-10 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50" />
                        </div>
                        {form.data.participants.length > 0 && (
                            <div className="mt-3 flex max-h-24 flex-wrap gap-1.5 overflow-y-auto" aria-label="Leitores selecionados">
                                {users.filter((user) => form.data.participants.includes(user.id)).map((user) => (
                                    <button key={user.id} type="button" disabled={form.processing} onClick={() => toggleParticipant(user.id)} aria-label={`Remover ${user.name}`}
                                        className="flex max-w-full items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 py-1.5 pr-2 pl-3 text-xs font-medium text-blue-700 hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-blue-600">
                                        <span className="truncate">{user.name}</span><X size={13} className="shrink-0" aria-hidden="true" />
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="mt-3 max-h-56 space-y-1 overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50/60 p-1.5">
                            {filteredUsers.map((user) => (
                                <label key={user.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-2.5 transition focus-within:ring-2 focus-within:ring-blue-400 ${form.data.participants.includes(user.id) ? 'border-blue-200 bg-blue-50' : 'border-transparent hover:border-slate-200 hover:bg-white'}`}>
                                    <span aria-hidden="true" className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${form.data.participants.includes(user.id) ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200'}`}>
                                        {user.name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}
                                    </span>
                                    <input type="checkbox" className="sr-only" checked={form.data.participants.includes(user.id)}
                                        disabled={form.processing || (form.data.participants.length >= 49 && !form.data.participants.includes(user.id))}
                                        onChange={() => toggleParticipant(user.id)} />
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-sm font-semibold text-slate-700">{user.name}</span>
                                        {user.nickname && <span className="block truncate text-xs text-slate-400">@{user.nickname.replace(/^@/, '')}</span>}
                                    </span>
                                    <span aria-hidden="true" className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${form.data.participants.includes(user.id) ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'}`}>
                                        {form.data.participants.includes(user.id) && <Check size={13} strokeWidth={3} />}
                                    </span>
                                </label>
                            ))}
                            {!filteredUsers.length && <p className="p-3 text-sm text-slate-500">Nenhum leitor encontrado.</p>}
                        </div>
                    </div>
                    {Object.entries(form.errors).map(([field, error]) => <p key={field} role="alert" className="text-sm text-red-600">{error}</p>)}
                    <p role="status" className="text-xs text-slate-500">
                        {form.data.participants.length < 2 ? `Selecione mais ${2 - form.data.participants.length} ${form.data.participants.length === 1 ? 'leitor' : 'leitores'} para começar.` : `${form.data.participants.length + 1} participantes, incluindo você.`}
                    </p>
                    <div className="flex gap-3 border-t border-slate-100 pt-4">
                        <button type="button" disabled={form.processing} onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-blue-600">Cancelar</button>
                        <button type="submit" disabled={form.processing || !form.data.name.trim() || form.data.participants.length < 2}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-40">
                            {form.processing ? <Loader2 size={17} className="animate-spin" aria-hidden="true" /> : <Users size={17} aria-hidden="true" />}
                            {form.processing ? 'Criando...' : 'Criar grupo'}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
