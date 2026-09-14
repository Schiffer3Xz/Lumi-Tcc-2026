import UserAvatar from '@/components/shared/UserAvatar';
import { Link } from '@inertiajs/react';
import clsx from 'clsx';
import { useEffect, useId, useRef, useState } from 'react';

export default function ProfileMenu({ user, items, variant = 'social', showPhoto = false, className }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);
    const triggerRef = useRef(null);
    const id = useId();
    const isLibrary = variant === 'library';
    const isProfile = variant === 'profile';
    const isStatic = variant === 'composer';
    const displayName = user.nickname?.replace(/^@/, '') || user.name;

    useEffect(() => {
        function handleOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
        }
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, []);

    const Trigger = isStatic ? 'div' : 'button';
    return (
        <div
            ref={ref}
            className={clsx(!isStatic && 'relative', className)}
            onKeyDown={(event) => {
                if (event.key === 'Escape' && isOpen) {
                    setIsOpen(false);
                    triggerRef.current?.focus();
                }
            }}
        >
            <Trigger
                ref={triggerRef}
                {...(!isStatic && { type: 'button', onClick: () => setIsOpen(!isOpen), 'aria-expanded': isOpen, 'aria-controls': id })}
                className={clsx(
                    isLibrary &&
                        'flex items-center gap-2 rounded-xl p-1 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400',
                    isProfile &&
                        'flex items-center gap-2.5 rounded-full border border-transparent p-1.5 pr-3 transition-colors hover:border-slate-200 hover:bg-slate-100',
                    variant === 'social' &&
                        'flex items-center gap-2.5 rounded-full border border-slate-200/60 p-1 pr-3 transition-colors hover:bg-slate-50',
                    isStatic && 'flex items-center gap-2 rounded-full border border-slate-200/60 p-1 pr-2 sm:gap-2.5 sm:pr-3',
                )}
            >
                <UserAvatar
                    name={user.name}
                    src={showPhoto ? user.profile_photo : undefined}
                    className={clsx(
                        isLibrary
                            ? 'flex h-9 w-9 items-center justify-center rounded-full bg-[#1A2332] text-sm font-bold text-yellow-300'
                            : 'flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white',
                        isProfile && 'shadow-xs',
                        showPhoto && 'overflow-hidden',
                    )}
                >
                    {isLibrary ? <i aria-hidden="true" className="fa-solid fa-user text-xs" /> : undefined}
                </UserAvatar>
                <span
                    className={clsx(
                        isLibrary ? 'hidden text-sm font-medium text-gray-700 sm:block' : 'hidden text-xs font-semibold text-slate-700 sm:block',
                        isStatic && 'max-w-[120px] truncate',
                    )}
                >
                    {displayName}
                </span>
                <i
                    aria-hidden="true"
                    className={clsx(
                        'fa-solid fa-chevron-down',
                        isLibrary
                            ? 'text-[10px] text-gray-400 transition-transform duration-200'
                            : isStatic
                              ? 'text-[9px] text-slate-400'
                              : 'text-[10px] text-slate-400',
                        isLibrary && isOpen && 'rotate-180',
                    )}
                />
            </Trigger>
            {!isStatic && isOpen && (
                <div
                    id={id}
                    className={
                        isLibrary
                            ? 'animate-in fade-in slide-in-from-top-2 absolute right-0 z-50 mt-2 w-48 rounded-xl border border-gray-100 bg-white py-1 shadow-lg duration-150'
                            : 'absolute right-0 z-50 mt-2 w-52 rounded-2xl border border-slate-100 bg-white py-1.5 shadow-xl'
                    }
                >
                    <div className={isLibrary ? 'border-b border-gray-100 px-4 py-2' : 'border-b border-slate-100 px-4 py-2.5'}>
                        <p className={isLibrary ? 'text-xs text-gray-400' : 'text-[10px] font-bold tracking-wider text-slate-400 uppercase'}>
                            {isLibrary ? 'Logado como' : 'Conta'}
                        </p>
                        <p className={isLibrary ? 'truncate text-sm font-semibold text-gray-800' : 'truncate text-xs font-bold text-slate-800'}>
                            {displayName}
                        </p>
                    </div>
                    {items.map((item) => (
                        <Link
                            key={item.id}
                            href={item.href}
                            method={item.method}
                            as={item.as}
                            className={
                                isLibrary
                                    ? item.id === 'logout'
                                        ? 'flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50'
                                        : 'flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100'
                                    : item.id === 'logout'
                                      ? clsx(
                                            'flex w-full items-center gap-2.5 px-4 py-2 text-left text-xs font-medium transition-colors',
                                            isProfile ? 'text-red-600 hover:bg-red-50' : 'text-rose-600 hover:bg-rose-50',
                                        )
                                      : 'flex w-full items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50'
                            }
                        >
                            <i
                                aria-hidden="true"
                                className={clsx(
                                    item.icon,
                                    isLibrary
                                        ? item.id === 'settings'
                                            ? 'text-xs text-slate-500'
                                            : 'text-xs'
                                        : item.id === 'settings' && 'text-slate-400',
                                )}
                            />
                            {item.label}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
