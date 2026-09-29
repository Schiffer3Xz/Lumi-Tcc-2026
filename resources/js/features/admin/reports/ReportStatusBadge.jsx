import { reportStatuses } from './report-utils';

export default function ReportStatusBadge({ status }) {
    const option = reportStatuses.find((item) => item.value === status);
    return (
        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${option?.color ?? 'bg-slate-100'}`}>
            {option?.singular ?? status}
        </span>
    );
}
