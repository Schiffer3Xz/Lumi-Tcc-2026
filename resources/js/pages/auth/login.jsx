import TextLink from '@/components/text-link';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import AuthField from '@/features/auth/auth-field';
import AuthFooter from '@/features/auth/auth-footer';
import AuthSubmitButton from '@/features/auth/auth-submit-button';
import PasswordField from '@/features/auth/password-field';
import ReadingAuthLayout from '@/layouts/reading-auth-layout';
import { Link, useForm } from '@inertiajs/react';
import { Eye, LogIn, Mail } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({ email: '', password: '', remember: false });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <ReadingAuthLayout title="Log in" subtitle="Plataforma Escolar Web" activePage="login">
            {status && (
                <div
                    role="status"
                    className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center text-sm font-medium text-emerald-600"
                >
                    {status}
                </div>
            )}
            <form className="flex flex-col gap-5" onSubmit={submit}>
                <AuthField
                    id="email"
                    label="E-mail Escolar"
                    icon={Mail}
                    type="email"
                    required
                    autoFocus
                    tabIndex={1}
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
                    tabIndex={2}
                    autoComplete="current-password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    placeholder="••••••••"
                    error={errors.password}
                    labelAction={
                        canResetPassword ? (
                            <TextLink
                                href={route('password.request')}
                                className="text-xs font-medium text-slate-500 hover:text-blue-600"
                                tabIndex={5}
                            >
                                Esqueci minha senha
                            </TextLink>
                        ) : null
                    }
                />
                <div className="flex items-center space-x-2 pt-1">
                    <Checkbox id="remember" name="remember" tabIndex={3} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <Label htmlFor="remember" className="cursor-pointer text-xs font-normal text-slate-600">
                        Lembrar meu acesso
                    </Label>
                </div>
                <AuthSubmitButton className="mt-2" tabIndex={4} processing={processing} icon={LogIn}>
                    Acessar Plataforma
                </AuthSubmitButton>
            </form>
            <AuthFooter
                prompt="Não tem uma conta?"
                link={{ href: route('register'), label: 'Cadastre-se', tabIndex: 5 }}
                divider="ou continue sem conta"
            >
                <Link
                    type="button"
                    href={route('catalogo')}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 transition-all hover:bg-slate-50"
                >
                    <Eye className="h-3.5 w-3.5 text-slate-400" />
                    Entrar sem conta
                </Link>
            </AuthFooter>
        </ReadingAuthLayout>
    );
}
