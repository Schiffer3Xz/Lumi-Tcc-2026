export default function AdminTable({ caption, columns, children, empty = false }) {
    if (empty)
        return (
            <p role="status" className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                Nenhum registro encontrado.
            </p>
        );
    return (
        <div role="region" aria-label={caption} tabIndex={0} className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[560px] text-left text-sm">
                <caption className="sr-only">{caption}</caption>
                <thead className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500">
                    <tr>
                        {columns.map((column) => (
                            <th key={column} scope="col" className="px-5 py-4">
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">{children}</tbody>
            </table>
        </div>
    );
}
