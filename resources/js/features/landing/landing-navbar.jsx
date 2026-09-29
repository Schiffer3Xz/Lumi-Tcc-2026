import FireflyIcon from '@/components/shared/FireflyIcon';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

export default function LandingNavbar({ homeHref, links, action, brand = 'Lumi', className }) {
    return (
        <header
            className={cn(
                'relative z-10 mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-y-5 px-5 py-6 sm:px-8 md:px-16',
                className,
            )}
        >
            <Link href={homeHref} className="group flex items-center gap-2 text-2xl font-black tracking-wide">
                <FireflyIcon className="h-7 w-7 text-amber-300 transition-transform duration-300 motion-safe:group-hover:rotate-12" />
                <span>{brand}</span>
            </Link>
            <nav
                aria-label="Navegação principal"
                className="order-3 flex w-full flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs font-semibold text-slate-300 md:order-none md:w-auto md:gap-8 md:text-sm"
            >
                {links.map(({ id, href, label, isAnchor }) => {
                    const NavigationLink = isAnchor ? 'a' : Link;
                    return (
                        <NavigationLink key={id} href={href} className="rounded py-2 transition-colors hover:text-amber-300">
                            {label}
                        </NavigationLink>
                    );
                })}
            </nav>
            <Link
                href={action.href}
                className="text-lumi-landing rounded-full bg-amber-300 px-6 py-2.5 text-sm font-bold shadow-md shadow-amber-300/10 transition-all duration-200 hover:bg-amber-400 motion-safe:hover:scale-105"
            >
                {action.label}
            </Link>
        </header>
    );
}
