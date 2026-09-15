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
            <div
                className={clsx(
                    isLibrary
                        ? 'flex min-h-screen bg-[#F9F9F9]'
                        : variant === 'profile'
                          ? 'flex min-h-screen bg-[#F4F6F9] font-sans text-slate-700'
                          : 'flex min-h-screen bg-[#F8FAFC] font-sans text-slate-700',
                    className,
                )}
            >
                <Sidebar
                    id={menuId}
                    items={navigation}
                    activeItem={activeItem}
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                    onNavigate={variant === 'composer' ? () => setIsMenuOpen(false) : undefined}
                    variant={isLibrary || variant === 'profile' ? 'library' : 'social'}
                />
                <div className={isLibrary ? 'flex min-w-0 flex-1 flex-col' : 'flex h-screen min-w-0 flex-1 flex-col overflow-hidden'}>
                    {isLibrary ? (
                        <main className="mx-auto w-full max-w-[1600px] flex-1 p-4 sm:p-6 lg:p-8">
                            {header}
                            {children}
                        </main>
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
