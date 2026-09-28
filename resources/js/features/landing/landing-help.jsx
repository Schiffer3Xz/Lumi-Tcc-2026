import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Link } from '@inertiajs/react';
import { HelpCircle } from 'lucide-react';

export default function LandingHelp() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    type="button"
                    aria-label="Ajuda para começar no Lumi"
                    className="fixed right-5 bottom-5 z-20 flex size-11 items-center justify-center rounded-full border border-slate-600 bg-slate-800 text-slate-200 shadow-lg transition-colors hover:bg-amber-300 hover:text-slate-900"
                >
                    <HelpCircle aria-hidden="true" className="size-5" />
                </button>
            </DialogTrigger>
            <DialogContent className="bg-lumi-landing rounded-2xl border-slate-700 text-white">
                <DialogTitle className="pr-6">Como começar no Lumi</DialogTitle>
                <DialogDescription className="text-slate-300">Encontre seu próximo livro e organize suas leituras.</DialogDescription>
                <div className="space-y-5 text-sm leading-relaxed text-slate-300">
                    <p>
                        <Link href={route('catalogo')} className="font-semibold text-amber-300 underline underline-offset-4">
                            Explore o catálogo
                        </Link>{' '}
                        para conhecer as obras disponíveis, mesmo sem uma conta.
                    </p>
                    <p>
                        <Link href={route('register')} className="font-semibold text-amber-300 underline underline-offset-4">
                            Crie sua conta
                        </Link>{' '}
                        para manter sua estante, acompanhar leituras e participar da comunidade.
                    </p>
                    <p>
                        Já tem uma conta?{' '}
                        <Link href={route('login')} className="font-semibold text-amber-300 underline underline-offset-4">
                            Entre na plataforma.
                        </Link>{' '}
                        Se esqueceu a senha, use a opção de recuperação na tela de acesso.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
