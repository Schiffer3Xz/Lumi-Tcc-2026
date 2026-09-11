import AuthField from '@/features/auth/auth-field';
import AuthFooter from '@/features/auth/auth-footer';
import AuthSubmitButton from '@/features/auth/auth-submit-button';
import PasswordField from '@/features/auth/password-field';
import ReadingAuthLayout from '@/layouts/reading-auth-layout';
import { useForm } from '@inertiajs/react';
import { Mail, User, UserPlus } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        accessType: 'aluno',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), { onFinish: () => reset('password', 'password_confirmation') });
    };

    return (
        <ReadingAuthLayout title="Criar Conta" subtitle="Criar sua conta na Plataforma" activePage="register">
            <form className="flex flex-col gap-4" onSubmit={submit}>
                <AuthField
                    id="name"
                    label="Nome Completo"
                    icon={User}
                    type="text"
                    required
                    autoFocus
                    tabIndex={1}
                    autoComplete="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Seu Nome Completo"
                    error={errors.name}
                />
                <AuthField
                    id="email"
                    label="E-mail Escolar"
                    icon={Mail}
                    type="email"
                    required
                    tabIndex={2}
                    autoComplete="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="seu.email@escola.edu.br"
                    error={errors.email}
                />
                <PasswordField
                    id="password"
                    label="Senha de Acesso"
                    required
                    tabIndex={3}
                    autoComplete="new-password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    placeholder="••••••••"
                    error={errors.password}
                />
                <PasswordField
                    id="password_confirmation"
                    label="Confirmar Senha"
                    required
                    tabIndex={4}
                    autoComplete="new-password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    placeholder="••••••••"
                    error={errors.password_confirmation}
                />
                <AuthSubmitButton className="mt-3" tabIndex={5} processing={processing} icon={UserPlus}>
                    Criar Minha Conta
                </AuthSubmitButton>
            </form>
            <AuthFooter
                prompt="Já tem uma conta?"
                link={{ href: route('login'), label: 'Fazer login', tabIndex: 6 }}
                divider="segurança e privacidade"
            />
        </ReadingAuthLayout>
    );
}
