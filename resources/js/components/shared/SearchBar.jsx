import clsx from 'clsx';
import { useId } from 'react';

export default function SearchBar({
    id,
    label = 'Buscar livros, autores ou gêneros',
    className,
    inputClassName,
    iconClassName,
    variant = 'library',
    children,
    ...inputProps
}) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
        <div className={clsx(variant === 'library' && 'relative flex-1', className)}>
            <label className="sr-only" htmlFor={inputId}>
                {label}
            </label>
            <i
                aria-hidden="true"
                className={clsx(
                    variant === 'library' && 'fa-solid fa-magnifying-glass absolute top-1/2 left-4 -translate-y-1/2 text-sm text-gray-400',
                    iconClassName,
                )}
            />
            <input
                id={inputId}
                type="text"
                className={clsx(
                    variant === 'library' &&
                        'w-full rounded-xl border border-gray-200 bg-white py-3 pr-4 pl-12 text-sm text-gray-700 shadow-sm transition-all placeholder:text-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 focus:outline-none',
                    inputClassName,
                )}
                {...inputProps}
            />
            {children}
        </div>
    );
}
