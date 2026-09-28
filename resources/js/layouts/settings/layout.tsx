import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Perfil',
        url: '/settings/profile',
        icon: null,
    },
    {
        title: 'Senha',
        url: '/settings/password',
        icon: null,
    },
    {
        title: 'Aparência',
        url: '/settings/appearance',
        icon: null,
    },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const currentPath = usePage().url.split(/[?#]/)[0];

    return (
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
            <Heading title="Configurações" description="Gerencie seu perfil e as preferências da sua conta." />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl shrink-0 lg:w-48">
                    <nav aria-label="Configurações da conta" className="flex flex-wrap gap-1 lg:flex-col">
                        {sidebarNavItems.map((item) => (
                            <Button
                                key={item.url}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('min-h-10 justify-start lg:w-full', {
                                    'bg-muted': currentPath === item.url,
                                })}
                            >
                                <Link href={item.url} aria-current={currentPath === item.url ? 'page' : undefined} prefetch>
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="min-w-0 flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
