import FireflyIcon from '@/components/shared/FireflyIcon';
import { Link } from '@inertiajs/react';
import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';

export default function Sidebar({ id, items, activeItem, isOpen, onClose, onNavigate, variant = 'library', className, children }) {
    const closeRef = useRef(onClose);
    const triggerRef = useRef(null);
    const isSocial = variant === 'social';
    const inactiveClassName = isSocial ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white';

    useEffect(() => {
        closeRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        const media = window.matchMedia('(min-width: 1024px)');
        const update = () => {
            if (media.matches) closeRef.current?.();
        };
        update();
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);

    const navigate = (event) => {
        onNavigate?.(event);
        if (!event.defaultPrevented) onClose?.();
    };
    const content = (
        <>
            <div className="text-yellow-300" role="img" aria-label="Lumi, mascote vagalume">
                <FireflyIcon className="size-8" />
            </div>
            <nav aria-label="Navegação principal" className="flex flex-1 flex-col gap-3">
                {items.map((item) => {
                    const isActive = item.id === activeItem;
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            onClick={navigate}
                            aria-current={isActive ? 'page' : undefined}
                            className={clsx(
                                'relative flex flex-col items-center gap-1 rounded-xl p-3 transition-colors duration-200',
                                isActive ? 'bg-yellow-300/10 text-yellow-300' : inactiveClassName,
                            )}
                            title={item.label}
                        >
                            {isActive && (
                                <span
                                    className={clsx(
                                        'absolute top-1/2 left-0 h-8 w-1 -translate-y-1/2 rounded-r-full',
                                        isSocial ? 'bg-amber-400' : 'bg-yellow-300',
                                    )}
                                />
                            )}
                            <i aria-hidden="true" className={`${item.icon} text-lg`} />
                            <span className="text-caption-sm font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
            {children ?? (
                <Link
                    href={route('profile.edit')}
                    onClick={navigate}
                    aria-label="Configurações"
                    className={clsx('rounded-xl p-3 transition-colors', inactiveClassName)}
                >
                    <i aria-hidden="true" className="fa-solid fa-gear text-lg" />
                </Link>
            )}
        </>
    );
    const sidebarClassName = 'h-dvh w-20 shrink-0 flex-col items-center gap-8 overflow-y-auto overscroll-contain bg-lumi-navy py-6';

    return (
        <>
            <aside aria-label="Menu lateral" className={clsx(sidebarClassName, 'sticky top-0 hidden lg:flex', className)}>
                {content}
            </aside>
            <Dialog.Root
                open={isOpen}
                onOpenChange={(open) => {
                    if (!open) onClose?.();
                }}
            >
                <Dialog.Portal>
                    <Dialog.Overlay className={clsx('fixed inset-0 z-40 lg:hidden', isSocial ? 'bg-slate-900/40 backdrop-blur-xs' : 'bg-black/50')} />
                    <Dialog.Content
                        id={id}
                        aria-describedby={undefined}
                        className={clsx(sidebarClassName, 'fixed top-0 left-0 z-50 flex lg:hidden', className)}
                        onOpenAutoFocus={() => {
                            triggerRef.current = document.activeElement;
                        }}
                        onCloseAutoFocus={(event) => {
                            event.preventDefault();
                            if (triggerRef.current?.isConnected && triggerRef.current.getClientRects().length) triggerRef.current.focus();
                        }}
                    >
                        <Dialog.Title className="sr-only">Navegação principal</Dialog.Title>
                        <Dialog.Close
                            aria-label="Fechar navegação"
                            className="-my-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-300 hover:bg-white/5 hover:text-white"
                        >
                            <i aria-hidden="true" className="fa-solid fa-xmark text-lg" />
                        </Dialog.Close>
                        {content}
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    );
}
