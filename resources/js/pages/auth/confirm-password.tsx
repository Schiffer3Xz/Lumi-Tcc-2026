import AuthSubmitButton from '@/features/auth/auth-submit-button';
import PasswordField from '@/features/auth/password-field';
import AuthLayout from '@/layouts/auth-layout';
import { useForm } from '@inertiajs/react';
import { LockKeyhole } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({ password: '' });
    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(route('password.confirm'), { onFinish: () => reset('password') });
    };

    return (
        <AuthLayout title="Confirmar senha" description="Confirme sua senha para continuar nesta área da plataforma.">
            <form onSubmit={submit} className="space-y-5">
                <PasswordField
                    id="password"
                    label="Senha"
                    required
                    autoFocus
                    autoComplete="current-password"
                    value={data.password}
                    onChange={(event) => setData('password', event.target.value)}
                    error={errors.password}
                />
                <AuthSubmitButton processing={processing} icon={LockKeyhole}>
                    Confirmar senha
                </AuthSubmitButton>
            </form>
        </AuthLayout>
    );
}
