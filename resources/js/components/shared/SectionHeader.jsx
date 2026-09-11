import { cn } from '@/lib/utils';

export default function SectionHeader({ title, className, titleClassName, children }) {
    return (
        <div className={cn('mb-4 flex items-center justify-between', className)}>
            <h3 className={cn('text-lg font-bold text-gray-800', titleClassName)}>{title}</h3>
            {children}
        </div>
    );
}
