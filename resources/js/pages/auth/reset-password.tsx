import AuthField from '@/features/auth/auth-field';
import AuthSubmitButton from '@/features/auth/auth-submit-button';
import PasswordField from '@/features/auth/password-field';
import AuthLayout from '@/layouts/auth-layout';
import { useForm } from '@inertiajs/react';
import { LockKeyhole, Mail } from 'lucide-react';
import { FormEventHandler } from 'react';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { data, setData, post, processing, errors, reset } = useForm({ token, email, password: '', password_confirmation: '' });
    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(route('password.store'), { onFinish: () => reset('password', 'password_confirmation') });
    };

    return (
        <AuthLayout title="Redefinir senha" description="Escolha uma nova senha para acessar sua conta.">
            <form onSubmit={submit} className="space-y-5">
                <AuthField id="email" label="E-mail" icon={Mail} type="email" autoComplete="email" value={data.email} readOnly error={errors.email} />
                <PasswordField
                    id="password"
                    label="Nova senha"
                    required
                    autoFocus
                    autoComplete="new-password"
                    value={data.password}
                    onChange={(event) => setData('password', event.target.value)}
                    error={errors.password}
                />
                <PasswordField
                    id="password_confirmation"
                    label="Confirmar nova senha"
                    required
                    autoComplete="new-password"
                    value={data.password_confirmation}
                    onChange={(event) => setData('password_confirmation', event.target.value)}
                    error={errors.password_confirmation}
                />
                <AuthSubmitButton processing={processing} icon={LockKeyhole}>
                    Redefinir senha
                </AuthSubmitButton>
            </form>
        </AuthLayout>
    );
}
