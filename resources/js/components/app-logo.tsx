import { Sparkles } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div className="bg-lumi-navy flex aspect-square size-8 items-center justify-center rounded-lg text-amber-300">
                <Sparkles aria-hidden="true" className="size-5" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">Lumi</span>
            </div>
        </>
    );
}
