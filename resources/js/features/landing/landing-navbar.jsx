import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';

export default function LandingNavbar({ homeHref, links, action, brand = 'Lumi', className }) {
    return (
        <header className={cn('relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-6 md:px-16', className)}>
            <Link href={homeHref} className="group flex items-center gap-2 text-2xl font-black tracking-wide">
                <Sparkles className="h-6 w-6 fill-amber-300 text-amber-300 transition-transform duration-300 group-hover:rotate-12" />
                <span>{brand}</span>
            </Link>
            <nav aria-label="Navegação principal" className="hidden items-center gap-8 text-sm font-semibold text-slate-300 md:flex">
                {links.map(({ id, href, label, isAnchor }) => {
                    const NavigationLink = isAnchor ? 'a' : Link;
                    return (
                        <NavigationLink key={id} href={href} className="transition-colors hover:text-amber-300">
                            {label}
                        </NavigationLink>
                    );
                })}
            </nav>
            <Link
                href={action.href}
                className="rounded-full bg-amber-300 px-6 py-2.5 text-sm font-bold text-[#1b2234] shadow-md shadow-amber-300/10 transition-all duration-200 hover:scale-105 hover:bg-amber-400"
            >
                {action.label}
            </Link>
        </header>
    );
}
