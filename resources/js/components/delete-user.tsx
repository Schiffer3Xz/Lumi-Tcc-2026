import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import HeadingSmall from '@/components/heading-small';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({ password: '' });

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setOpen(false);
        clearErrors();
        reset();
    };

    return (
        <div className="space-y-6">
            <HeadingSmall title="Excluir conta" description="Exclua sua conta e os dados associados a ela." />
            <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
                <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
                    <p className="font-medium">Atenção</p>
                    <p className="text-sm">Esta ação é permanente e não pode ser desfeita.</p>
                </div>

                <Dialog
                    open={open}
                    onOpenChange={(isOpen) => {
                        if (isOpen) setOpen(true);
                        else closeModal();
                    }}
                >
                    <DialogTrigger asChild>
                        <Button variant="destructive">Excluir conta</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle className="pr-6">Deseja excluir sua conta?</DialogTitle>
                        <DialogDescription>
                            Sua conta e os dados associados serão excluídos permanentemente. Informe sua senha para confirmar.
                        </DialogDescription>
                        <form className="space-y-6" onSubmit={deleteUser}>
                            <div className="grid gap-2">
                                <Label htmlFor="delete-account-password">Senha atual</Label>

                                <Input
                                    id="delete-account-password"
                                    type="password"
                                    name="password"
                                    required
                                    aria-invalid={Boolean(errors.password)}
                                    aria-describedby={errors.password ? 'delete-account-password-error' : undefined}
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Sua senha atual"
                                    autoComplete="current-password"
                                />

                                <InputError id="delete-account-password-error" message={errors.password} />
                            </div>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary" onClick={closeModal}>
                                        Cancelar
                                    </Button>
                                </DialogClose>

                                <Button type="submit" variant="destructive" disabled={processing} aria-busy={processing}>
                                    Excluir conta
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
