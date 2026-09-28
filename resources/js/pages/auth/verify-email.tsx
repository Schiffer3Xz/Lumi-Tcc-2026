import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import AuthSubmitButton from '@/features/auth/auth-submit-button';
import AuthLayout from '@/layouts/auth-layout';
import { useForm } from '@inertiajs/react';
import { Mail } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing, errors } = useForm<{ verification?: string }>({});
    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(route('verification.send'));
    };

    return (
        <AuthLayout title="Verificar e-mail" description="Abra o link que enviamos para seu e-mail para confirmar sua conta.">
            <InputError message={errors.verification} className="mb-4" />
            {status === 'verification-link-sent' && (
                <p role="status" className="mb-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
                    Um novo link de verificação foi enviado para seu e-mail.
                </p>
            )}
            <form onSubmit={submit} className="space-y-6 text-center">
                <AuthSubmitButton processing={processing} icon={Mail}>
                    Reenviar e-mail de verificação
                </AuthSubmitButton>
                <TextLink href={route('logout')} method="post" as="button" className="mx-auto block text-sm">
                    Sair da conta
                </TextLink>
            </form>
        </AuthLayout>
    );
}
