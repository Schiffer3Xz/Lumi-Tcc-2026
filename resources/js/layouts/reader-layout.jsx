import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { ACCOUNT_NAVIGATION, READER_NAVIGATION } from '@/constants/navigation';
import BookDetailsProvider from '@/features/books/BookDetailsProvider';
import { Head } from '@inertiajs/react';
import clsx from 'clsx';
import { useId, useState } from 'react';

export default function ReaderLayout({ title, user, activeItem, variant = 'social', topbar, className, children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuId = useId();
    const isLibrary = variant === 'library';
    const navigation = READER_NAVIGATION.map(({ routeName, ...item }) => ({ ...item, href: route(routeName) }));
    const accountItems = ACCOUNT_NAVIGATION.map(({ routeName, ...item }) => ({ ...item, href: route(routeName) }));
    const header = (
        <Topbar
            {...topbar}
            user={user}
            accountItems={accountItems}
            variant={variant}
            menuId={menuId}
            isMenuOpen={isMenuOpen}
            onMenuOpen={() => setIsMenuOpen(true)}
        />
    );

    return (
        <BookDetailsProvider>
            <Head title={title} />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
            <a
                href="#reader-main-content"
                className="text-lumi-navy fixed top-3 left-3 z-[100] -translate-y-[calc(100%+1rem)] rounded-xl bg-white px-4 py-3 font-semibold shadow-lg focus:translate-y-0"
            >
                Pular para o conteúdo principal
            </a>
            <div
                className={clsx(
                    isLibrary
                        ? 'bg-lumi-library flex min-h-dvh'
                        : variant === 'profile'
                          ? 'bg-lumi-profile flex min-h-dvh font-sans text-slate-700'
                          : 'bg-lumi-canvas flex min-h-dvh font-sans text-slate-700',
                    className,
                )}
            >
                <Sidebar
                    id={menuId}
                    items={navigation}
                    activeItem={activeItem}
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                    variant={isLibrary || variant === 'profile' ? 'library' : 'social'}
                />
                <div className={isLibrary ? 'flex min-w-0 flex-1 flex-col' : 'flex h-dvh min-w-0 flex-1 flex-col overflow-hidden'}>
                    {isLibrary ? (
                        <div className="max-w-lumi-page mx-auto w-full flex-1 p-4 sm:p-6 lg:p-8">
                            {header}
                            <main id="reader-main-content" tabIndex={-1}>
                                {children}
                            </main>
                        </div>
                    ) : (
                        <>
                            {header}
                            {children}
                        </>
                    )}
                </div>
            </div>
        </BookDetailsProvider>
    );
}
