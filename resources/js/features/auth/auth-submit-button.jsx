import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LoaderCircle } from 'lucide-react';

export default function AuthSubmitButton({ processing, disabled, icon: Icon, children, className, ...props }) {
    return (
        <Button
            {...props}
            type="submit"
            disabled={processing || disabled}
            aria-busy={processing}
            aria-label={processing && typeof children === 'string' ? children : undefined}
            className={cn(
                'flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber-300 font-semibold text-slate-900 shadow-[0_4px_20px_rgba(252,211,77,0.4)] transition-all hover:bg-amber-400',
                className,
            )}
        >
            {processing ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
                <>
                    {Icon && <Icon className="h-4 w-4" />}
                    {children}
                </>
            )}
        </Button>
    );
}
