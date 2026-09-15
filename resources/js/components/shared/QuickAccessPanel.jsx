import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

function QuickAccessItem({ item }) {
    const content = (
        <>
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#1A2332]/5 transition-colors group-hover:bg-yellow-300/10">
                <i className={`${item.icon} text-sm text-gray-500 transition-colors group-hover:text-yellow-600`} aria-hidden="true" />
            </span>
            <span className="text-sm font-medium text-gray-600 transition-colors group-hover:text-gray-900">{item.label}</span>
            <i
                className="fa-solid fa-chevron-right ml-auto text-[10px] text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-gray-400"
                aria-hidden="true"
            />
        </>
    );
    const className = 'group flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all hover:bg-gray-50';

    if (item.dialog) {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <button type="button" disabled={item.disabled} className={className}>
                        {content}
                    </button>
                </DialogTrigger>
                <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl bg-white text-slate-800">
                    <DialogTitle className="pr-6">{item.label}</DialogTitle>
                    <DialogDescription>{item.dialog.description}</DialogDescription>
                    {item.dialog.content}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Link href={item.href} onClick={item.onClick} className={className}>
            {content}
        </Link>
    );
}

export default function QuickAccessPanel({ title, items, className }) {
    return (
        <div className={cn('rounded-2xl border border-gray-200 bg-[#FFFFFF] p-5 shadow-sm', className)}>
            <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-gray-800">
                <span className="h-5 w-1 rounded-full bg-yellow-300" />
                {title}
            </h3>
            <div className="flex flex-col gap-2">
                {items.map((item) => (
                    <QuickAccessItem key={item.id ?? item.label} item={item} />
                ))}
            </div>
        </div>
    );
}
