import clsx from 'clsx';
import ProfileMenu from './ProfileMenu';

export default function Topbar({
    title = 'Sala de Leitura',
    subtitle = 'Plataforma Escolar Web',
    user,
    accountItems,
    variant = 'social',
    isMenuOpen,
    menuId,
    onMenuOpen,
    showPhoto = false,
    actions,
    className,
}) {
    const isLibrary = variant === 'library';
    const isProfile = variant === 'profile';
    const isComposer = variant === 'composer';

    return (
        <header
            className={clsx(
                isLibrary
                    ? 'mb-6 flex items-center justify-between gap-4'
                    : 'sticky top-0 z-30 flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200/80',
                !isLibrary &&
                    (isProfile ? 'bg-white px-6' : isComposer ? 'bg-white/90 px-4 backdrop-blur-md sm:px-6' : 'bg-white/90 px-6 backdrop-blur-md'),
                className,
            )}
        >
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onMenuOpen}
                    aria-label="Abrir navegação"
                    aria-controls={menuId}
                    aria-expanded={isMenuOpen}
                    className={
                        isLibrary
                            ? 'rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden'
                            : 'rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden'
                    }
                >
                    <i aria-hidden="true" className="fa-solid fa-bars text-xl" />
                </button>
                {isLibrary ? (
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">{title}</h1>
                        <p className="hidden text-xs text-gray-400 sm:block sm:text-sm">{subtitle}</p>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <div
                            className={clsx(
                                'flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-base font-bold text-white shadow-xs',
                                isProfile && 'shadow-blue-200',
                            )}
                        >
                            <i aria-hidden="true" className="fa-solid fa-book-open" />
                        </div>
                        <div>
                            <h1 className="text-sm leading-tight font-bold text-slate-800">{title}</h1>
                            <p className={clsx('text-[11px] font-medium text-slate-400', isComposer && 'hidden sm:block')}>{subtitle}</p>
                        </div>
                    </div>
                )}
            </div>
            <div className={clsx('flex items-center', isLibrary ? 'gap-3 sm:gap-4' : actions ? 'gap-3' : isComposer ? 'gap-2 sm:gap-4' : 'gap-4')}>
                {actions}
                <button
                    type="button"
                    aria-label="Notificações"
                    className={
                        isLibrary
                            ? 'relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100'
                            : clsx('relative rounded-full text-slate-600 transition-colors hover:bg-slate-100', isComposer ? 'p-2 sm:p-2.5' : 'p-2.5')
                    }
                >
                    <i
                        aria-hidden="true"
                        className={clsx(isLibrary ? 'fa-solid fa-bell' : 'fa-regular fa-bell', isComposer ? 'text-base sm:text-lg' : 'text-lg')}
                    />
                    <span
                        className={
                            isLibrary
                                ? 'absolute top-1.5 right-1.5 h-2 w-2 rounded-full border-2 border-white bg-red-500'
                                : clsx(
                                      'absolute h-2 w-2 rounded-full ring-2 ring-white',
                                      isProfile
                                          ? 'top-1.5 right-1.5 bg-red-500'
                                          : isComposer
                                            ? 'top-1.5 right-1.5 bg-rose-500 sm:top-2 sm:right-2'
                                            : 'top-2 right-2 bg-rose-500',
                                  )
                        }
                    />
                </button>
                <ProfileMenu user={user} items={accountItems} variant={variant} showPhoto={showPhoto} />
            </div>
        </header>
    );
}
