import InputError from '@/components/input-error';

export default function AdminField({ form, name, label, as: Component = 'input', hint, children, ...props }) {
    const id = `admin-${name}`;
    const error = form.errors[name];
    return (
        <div className="min-w-0">
            <label htmlFor={id} className="mb-2 block text-xs font-bold text-slate-700">
                {label}
                {props.required && (
                    <span aria-hidden="true" className="text-red-600">
                        {' '}
                        *
                    </span>
                )}
            </label>
            <Component
                id={id}
                name={name}
                value={form.data[name]}
                onChange={(event) => form.setData(name, event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={[hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                {...props}
            >
                {children}
            </Component>
            {hint && (
                <p id={`${id}-hint`} className="mt-2 text-xs text-slate-500">
                    {hint}
                </p>
            )}
            <InputError id={`${id}-error`} message={error} className="mt-2" />
        </div>
    );
}
