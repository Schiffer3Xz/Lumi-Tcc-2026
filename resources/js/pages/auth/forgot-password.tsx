import TextLink from '@/components/text-link';
import AuthField from '@/features/auth/auth-field';
import AuthSubmitButton from '@/features/auth/auth-submit-button';
import AuthLayout from '@/layouts/auth-layout';
import { useForm } from '@inertiajs/react';
import { Mail } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(route('password.email'));
    };

    return (
        <AuthLayout title="Recuperar senha" description="Informe seu e-mail para receber um link de redefinição de senha.">
            {status && (
                <p role="status" className="mb-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
                    {status}
                </p>
            )}
            <form onSubmit={submit} className="space-y-5">
                <AuthField
                    id="email"
                    label="E-mail"
                    icon={Mail}
                    type="email"
                    required
                    autoComplete="email"
                    autoFocus
                    value={data.email}
                    onChange={(event) => setData('email', event.target.value)}
                    placeholder="seu.email@escola.edu.br"
                    error={errors.email}
                />
                <AuthSubmitButton processing={processing} icon={Mail}>
                    Enviar link de recuperação
                </AuthSubmitButton>
            </form>
            <p className="mt-6 text-center text-sm text-slate-500">
                <TextLink href={route('login')}>Voltar para entrar</TextLink>
            </p>
        </AuthLayout>
    );
}
