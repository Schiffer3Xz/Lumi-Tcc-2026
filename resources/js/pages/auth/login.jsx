import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, Eye, EyeOff, LogIn, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50/50 to-slate-200 relative overflow-hidden p-4">
            <Head title="Log in" />

            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-100/60 blur-3xl pointer-events-none" />
            <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-indigo-100/40 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 right-10 w-96 h-96 rounded-full bg-blue-200/30 blur-3xl pointer-events-none" />

            <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(8_112_184|0.07)] border border-white/80 p-8 relative z-10 my-8">
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white mb-4">
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sala de Leitura</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Plataforma Escolar Web</p>
                </div>

                <div className="flex bg-slate-100/80 p-1 rounded-full mb-6">
                    <button
                        type="button"
                        className="flex-1 py-2 text-xs font-semibold rounded-full bg-amber-300 text-slate-900 shadow-sm transition-all"
                    >
                        Entrar no Sistema
                    </button>
                    <TextLink
                        href={route('register')}
                        className="flex-1 py-2 text-xs font-semibold rounded-full text-slate-500 hover:text-slate-900 text-center transition-all flex items-center justify-center"
                    >
                        Criar Conta
                    </TextLink>
                </div>

                {status && (
                    <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-sm font-medium text-emerald-600">
                        {status}
                    </div>
                )}

                <form className="flex flex-col gap-5" onSubmit={submit}>
                    <div className="grid gap-1.5">
                        <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                            E-mail Escolar
                        </Label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                                <Mail className="w-4 h-4" />
                            </span>
                            <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="seu.email@escola.edu.br"
                                className="pl-10 h-11 bg-slate-50/50 border-slate-200 rounded-xl focus:bg-white transition-all text-sm"
                            />
                        </div>
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-1.5">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                                Senha de Acesso
                            </Label>
                            {canResetPassword && (
                                <TextLink href={route('password.request')} className="text-xs text-slate-500 hover:text-blue-600 font-medium" tabIndex={5}>
                                    Esqueci minha senha
                                </TextLink>
                            )}
                        </div>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                                <Lock className="w-4 h-4" />
                            </span>
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                                className="pl-10 pr-10 h-11 bg-slate-50/50 border-slate-200 rounded-xl focus:bg-white transition-all text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                        <Checkbox id="remember" name="remember" tabIndex={3} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                        <Label htmlFor="remember" className="text-xs text-slate-600 font-normal cursor-pointer">
                            Lembrar meu acesso
                        </Label>
                    </div>

                    <Button
                        type="submit"
                        className="mt-2 w-full h-11 bg-amber-300 hover:bg-amber-400 text-slate-900 font-semibold rounded-xl shadow-[0_4px_20px_rgba(252,211,77,0.4)] transition-all flex items-center justify-center gap-2"
                        tabIndex={4}
                        disabled={processing}
                    >
                        {processing ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <LogIn className="w-4 h-4" />
                                Acessar Plataforma
                            </>
                        )}
                    </Button>
                </form>

                <div className="text-center text-xs text-slate-500 mt-6">
                    Não tem uma conta?{' '}
                    <TextLink href={route('register')} className="text-slate-900 font-semibold underline underline-offset-2" tabIndex={5}>
                        Cadastre-se
                    </TextLink>
                </div>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200/80" />
                    </div>
                    <div className="relative flex justify-center text-[11px] uppercase">
                        <span className="bg-white px-3 text-slate-400 tracking-wider">ou continue sem conta</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Link
                        type="button"
                        href={route('dashboard')}
                        className="w-full h-10 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        Entrar sem conta
                    </Link>

                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Conexão Segura e Dados Protegidos (LGPD)</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
