import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Configurações do perfil',
        href: '/settings/profile',
    },
];

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: auth.user.name,
        nickname: auth.user.nickname ?? '',
        description: auth.user.description ?? '',
        email: auth.user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Configurações do perfil" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Informações do perfil" description="Atualize seu nome, sua apresentação e seu e-mail." />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nome</Label>

                            <Input
                                id="name"
                                name="name"
                                aria-invalid={Boolean(errors.name)}
                                aria-describedby={errors.name ? 'name-error' : undefined}
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Nome completo"
                            />

                            <InputError className="mt-2" id="name-error" message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="nickname">Apelido</Label>

                            <Input
                                id="nickname"
                                name="nickname"
                                aria-invalid={Boolean(errors.nickname)}
                                aria-describedby={errors.nickname ? 'nickname-error' : undefined}
                                className="mt-1 block w-full"
                                value={data.nickname}
                                onChange={(e) => setData('nickname', e.target.value)}
                                autoComplete="nickname"
                                placeholder="Como você quer ser encontrado"
                            />

                            <InputError className="mt-2" id="nickname-error" message={errors.nickname} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Descrição</Label>

                            <textarea
                                id="description"
                                name="description"
                                aria-invalid={Boolean(errors.description)}
                                aria-describedby={errors.description ? 'description-error' : undefined}
                                className="border-input bg-background ring-offset-background focus-visible:ring-ring mt-1 block min-h-24 w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Conte um pouco sobre você"
                            />

                            <InputError className="mt-2" id="description-error" message={errors.description} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">E-mail</Label>

                            <Input
                                id="email"
                                name="email"
                                aria-invalid={Boolean(errors.email)}
                                aria-describedby={errors.email ? 'email-error' : undefined}
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="email"
                                placeholder="E-mail"
                            />

                            <InputError className="mt-2" id="email-error" message={errors.email} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="text-foreground mt-2 text-sm">
                                    Seu e-mail ainda não foi verificado.
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-muted-foreground hover:text-foreground rounded-md text-sm underline focus:ring-2 focus:ring-offset-2 focus:outline-hidden"
                                    >
                                        Reenviar e-mail de verificação.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div role="status" className="mt-2 text-sm font-medium text-green-600">
                                        Um novo link de verificação foi enviado para seu e-mail.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing} aria-busy={processing}>
                                Salvar alterações
                            </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p role="status" className="text-muted-foreground text-sm">
                                    Alterações salvas.
                                </p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
