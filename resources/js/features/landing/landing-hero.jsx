import FireflyIcon from '@/components/shared/FireflyIcon';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export default function LandingHero({ badge, title, description, primaryAction, secondaryAction, children }) {
    return (
        <section
            aria-labelledby="landing-title"
            className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-5 py-10 sm:px-8 md:px-16"
        >
            <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12">
                <div className="space-y-6 lg:col-span-7">
                    <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/90 px-4 py-1.5 text-xs font-bold tracking-wider text-amber-300 uppercase shadow-inner">
                        <FireflyIcon className="h-4 w-4 shrink-0" />
                        <span>{badge}</span>
                    </div>
                    <h1 id="landing-title" className="text-4xl leading-[1.08] font-black tracking-tight text-white sm:text-6xl md:text-7xl">
                        {title}
                    </h1>
                    <p className="max-w-lg text-base leading-relaxed font-normal text-slate-300 sm:text-lg">{description}</p>
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                        <Link
                            href={primaryAction.href}
                            className="group text-lumi-landing flex items-center gap-2 rounded-full bg-amber-300 px-7 py-3.5 text-sm font-extrabold shadow-xl shadow-amber-300/20 transition-all duration-200 hover:bg-amber-400 motion-safe:hover:scale-105"
                        >
                            <span>{primaryAction.label}</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href={secondaryAction.href}
                            className="rounded-full border border-slate-700 bg-slate-900/30 px-7 py-3.5 text-sm font-bold text-slate-200 transition-all duration-200 hover:border-slate-500 hover:bg-slate-800/60"
                        >
                            {secondaryAction.label}
                        </Link>
                    </div>
                </div>
                <div className="flex justify-center lg:col-span-5 lg:justify-end">{children}</div>
            </div>
        </section>
    );
}
