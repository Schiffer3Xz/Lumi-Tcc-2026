import TextLink from '@/components/text-link';
import { cn } from '@/lib/utils';
import { ShieldCheck } from 'lucide-react';

export default function AuthFooter({ prompt, link, divider, children, securityText = 'Conexão Segura e Dados Protegidos (LGPD)' }) {
    const securityNotice = (
        <div className={cn('flex items-center justify-center gap-1.5 text-[11px] text-slate-400', children ? 'pt-2' : 'pt-1')}>
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>{securityText}</span>
        </div>
    );

    return (
        <>
            <div className="mt-6 text-center text-xs text-slate-500">
                {prompt}{' '}
                <TextLink href={link.href} className="font-semibold text-slate-900 underline underline-offset-2" tabIndex={link.tabIndex}>
                    {link.label}
                </TextLink>
            </div>
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200/80" />
                </div>
                <div className="relative flex justify-center text-[11px] uppercase">
                    <span className="bg-white px-3 tracking-wider text-slate-400">{divider}</span>
                </div>
            </div>
            {children ? (
                <div className="flex flex-col gap-3">
                    {children}
                    {securityNotice}
                </div>
            ) : (
                securityNotice
            )}
        </>
    );
}
