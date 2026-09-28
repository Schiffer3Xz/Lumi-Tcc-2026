import { Link } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export default function AdminForm({ form, onSubmit, children, submitLabel = 'Salvar alterações', cancelHref, className = '' }) {
    const formRef = useRef(null);
    useEffect(() => {
        if (Object.keys(form.errors).length) formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
    }, [form.errors]);
    return (
        <form
            ref={formRef}
            onSubmit={(event) => {
                event.preventDefault();
                onSubmit();
            }}
            className={`space-y-6 ${className}`}
            aria-busy={form.processing}
        >
            {Object.keys(form.errors).length > 0 && (
                <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    <p className="font-semibold">Confira os dados informados.</p>
                    <ul className="mt-2 list-inside list-disc">
                        {Object.entries(form.errors).map(([key, message]) => (
                            <li key={key}>{message}</li>
                        ))}
                    </ul>
                </div>
            )}
            <fieldset disabled={form.processing} className="min-w-0 space-y-6 disabled:opacity-70">
                {children}
            </fieldset>
            {form.progress && <progress aria-label="Envio do arquivo" max="100" value={form.progress.percentage} className="w-full" />}
            <div className="flex flex-wrap justify-end gap-3">
                {cancelHref && (
                    <Link href={cancelHref} className="admin-button-secondary">
                        Cancelar
                    </Link>
                )}
                <button type="submit" disabled={form.processing} className="admin-button-primary">
                    {form.processing ? 'Salvando...' : submitLabel}
                </button>
            </div>
        </form>
    );
}
