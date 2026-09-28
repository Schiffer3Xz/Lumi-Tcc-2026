import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/**
 * @param {import('react').ComponentProps<typeof Input> & { id: string, label: string, icon?: import('lucide-react').LucideIcon, error?: string, labelAction?: import('react').ReactNode, endAdornment?: import('react').ReactNode, inputClassName?: string }} props
 */
export default function AuthField({ id, label, icon: Icon, error, labelAction, endAdornment, className, inputClassName, ...inputProps }) {
    const fieldLabel = (
        <Label htmlFor={id} className="text-xs font-semibold text-slate-700">
            {label}
        </Label>
    );

    return (
        <div className={cn('grid gap-1.5', className)}>
            {labelAction !== undefined ? (
                <div className="flex flex-wrap items-center justify-between gap-2">
                    {fieldLabel}
                    {labelAction}
                </div>
            ) : (
                fieldLabel
            )}
            <div className="relative">
                {Icon && (
                    <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Icon className="h-4 w-4" />
                    </span>
                )}
                <Input
                    {...inputProps}
                    id={id}
                    name={inputProps.name ?? id}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? `${id}-error` : inputProps['aria-describedby']}
                    className={cn(
                        'h-11 rounded-xl border-slate-200 bg-slate-50/50 text-sm transition-all focus:bg-white',
                        Icon && 'pl-10',
                        endAdornment && 'pr-10',
                        inputClassName,
                    )}
                />
                {endAdornment}
            </div>
            <InputError id={`${id}-error`} message={error} />
        </div>
    );
}
