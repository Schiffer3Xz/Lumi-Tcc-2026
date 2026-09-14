import ReaderLayout from '@/layouts/reader-layout';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

function FieldError({ message }) {
    return message ? <p className="mt-1 text-xs text-rose-600">{message}</p> : null;
}

export default function ProfileEdit() {
    const { auth } = usePage().props;
    const user = auth?.user ?? {};
    const [savedMessage, setSavedMessage] = useState(false);
    const { data, setData, patch, errors, processing } = useForm({
        name: user.name ?? '',
        nickname: user.nickname ?? '',
        description: user.description ?? '',
        email: user.email ?? '',
    });

    const submit = (event) => {
        event.preventDefault();
        setSavedMessage(false);
        patch(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => setSavedMessage(true),
        });
    };

    return (
        <ReaderLayout
            title="Editar perfil - Sala de Leitura"
            user={user}
            activeItem="config"
            variant="profile"
            topbar={{
                actions: <span className="text-xs font-semibold text-slate-500">Configurações da conta</span>,
            }}
        >
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-5xl space-y-6">
                    <header className="flex flex-col justify-between gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-end">
                        <div>
                            <span className="text-[10px] font-bold tracking-[0.2em] text-blue-600 uppercase">Minha conta</span>
                            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Editar perfil</h1>
                            <p className="mt-1 max-w-xl text-sm text-slate-500">Mantenha suas informações atualizadas para que outros leitores reconheçam você.</p>
                        </div>
                        <Link
                            href={route('profile')}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
                        >
                            <i className="fa-solid fa-arrow-left text-[11px]" />
                            Voltar ao perfil
                        </Link>
                    </header>

                    <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
                        <aside className="h-fit rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
                            <div className="flex flex-col items-center text-center">
                                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-amber-100 bg-slate-800 text-3xl font-bold text-white shadow-sm">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <h2 className="mt-4 text-base font-bold text-slate-900">{user.name || 'Leitor'}</h2>
                                <p className="mt-1 text-xs text-slate-500">{user.nickname ? `@${user.nickname.replace('@', '')}` : 'Adicione um nickname'}</p>
                            </div>

                            <div className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-500">
                                <div className="flex items-center gap-2">
                                    <i className="fa-solid fa-circle-check text-emerald-500" />
                                    <span>Perfil da comunidade</span>
                                </div>
                                <p className="mt-3 leading-relaxed">Suas informações aparecem no seu perfil público e nas interações da comunidade.</p>
                            </div>
                        </aside>

                        <form onSubmit={submit} className="space-y-6">
                            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
                                <div className="mb-6 flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <i className="fa-solid fa-id-card text-sm" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-900">Informações públicas</h2>
                                        <p className="mt-1 text-xs text-slate-500">Esses dados ajudam outras pessoas a encontrar você.</p>
                                    </div>
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <label className="text-xs font-semibold text-slate-700">
                                        Nome completo
                                        <input
                                            value={data.name}
                                            onChange={(event) => setData('name', event.target.value)}
                                            className="mt-2 block h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-normal text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                            required
                                        />
                                        <FieldError message={errors.name} />
                                    </label>

                                    <label className="text-xs font-semibold text-slate-700">
                                        Nickname
                                        <input
                                            value={data.nickname}
                                            onChange={(event) => setData('nickname', event.target.value)}
                                            className="mt-2 block h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-normal text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                            placeholder="Como você quer ser chamado"
                                        />
                                        <FieldError message={errors.nickname} />
                                    </label>

                                    <label className="text-xs font-semibold text-slate-700 sm:col-span-2">
                                        Descrição
                                        <textarea
                                            value={data.description}
                                            onChange={(event) => setData('description', event.target.value)}
                                            className="mt-2 block min-h-28 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-normal leading-relaxed text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                            placeholder="Conte um pouco sobre você e seus hábitos de leitura"
                                        />
                                        <FieldError message={errors.description} />
                                    </label>
                                </div>
                            </section>

                            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
                                <div className="mb-6 flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                        <i className="fa-solid fa-shield-halved text-sm" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-900">Dados de acesso</h2>
                                        <p className="mt-1 text-xs text-slate-500">Seu e-mail é usado para entrar e receber avisos importantes.</p>
                                    </div>
                                </div>

                                <label className="block text-xs font-semibold text-slate-700">
                                    E-mail
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(event) => setData('email', event.target.value)}
                                        className="mt-2 block h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-normal text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                        required
                                    />
                                    <FieldError message={errors.email} />
                                </label>
                            </section>

                            <div className="flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
                                <Link href={route('profile')} className="text-center text-xs font-semibold text-slate-500 hover:text-slate-800 sm:text-left">
                                    Cancelar alterações
                                </Link>
                                <div className="flex items-center justify-end gap-3">
                                    {savedMessage && <span className="text-xs font-semibold text-emerald-600">Alterações salvas</span>}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <i className={`fa-solid ${processing ? 'fa-spinner fa-spin' : 'fa-check'} text-[11px]`} />
                                        {processing ? 'Salvando...' : 'Salvar alterações'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </ReaderLayout>
    );
}
