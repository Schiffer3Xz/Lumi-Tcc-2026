import useFocusTrap from '@/hooks/use-focus-trap';
import { Link } from '@inertiajs/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

export default function Sidebar({ id, items, activeItem, isOpen, onClose, onNavigate, variant = 'library', className, children }) {
    const [isDesktop, setIsDesktop] = useState(false);
    const ref = useFocusTrap(isOpen && !isDesktop, onClose);
    const isSocial = variant === 'social';
    const inactiveClassName = isSocial ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white';

    useEffect(() => {
        const media = window.matchMedia('(min-width: 1024px)');
        const update = () => setIsDesktop(media.matches);
        update();
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);

    return (
        <>
            {isOpen && (
                <div
                    aria-hidden="true"
                    className={clsx('fixed inset-0 z-40 lg:hidden', isSocial ? 'bg-slate-900/40 backdrop-blur-xs' : 'bg-black/50')}
                    onClick={onClose}
                />
            )}
            <aside
                id={id}
                ref={ref}
                aria-label="Navegação principal"
                inert={!isOpen && !isDesktop}
                tabIndex={-1}
                className={clsx(
                    'fixed top-0 left-0 z-50 flex h-screen w-20 flex-shrink-0 flex-col items-center gap-8 bg-[#1A2332] py-6 transition-transform duration-300 ease-in-out lg:sticky',
                    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
                    className,
                )}
            >
                <div className="text-yellow-300">
                    <i aria-hidden="true" className="fa-solid fa-feather-pointed text-2xl" />
                </div>
                <nav className="flex flex-1 flex-col gap-3">
                    {items.map((item) => {
                        const isActive = item.id === activeItem;
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                onClick={onNavigate}
                                aria-current={isActive ? 'page' : undefined}
                                className={clsx(
                                    'relative flex flex-col items-center gap-1 rounded-xl p-3 transition-all duration-200',
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
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
                {children ?? (
                    <button type="button" aria-label="Configurações" className={clsx('rounded-xl p-3 transition-all', inactiveClassName)}>
                        <i aria-hidden="true" className="fa-solid fa-gear text-lg" />
                    </button>
                )}
            </aside>
        </>
    );
}
