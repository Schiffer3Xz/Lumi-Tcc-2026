import AdminTable from '../AdminTable';
import ReportStatusBadge from './ReportStatusBadge';
import { reportDate } from './report-utils';

export default function ReportTable({ reports, onReview }) {
    return (
        <AdminTable caption="Denúncias recebidas" columns={['Denúncia', 'Denunciante', 'Situação', 'Recebida em', 'Ações']} empty={!reports.length}>
            {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/60">
                    <th scope="row" className="max-w-sm px-5 py-4 text-left font-normal">
                        <p className="text-xs font-semibold text-blue-600">
                            #{report.id} · {report.target.type === 'comment' ? 'Comentário' : 'Publicação'}
                        </p>
                        <p className="mt-2 line-clamp-2 font-medium break-words text-slate-900">{report.content}</p>
                        <p className="mt-1 text-xs text-slate-500">Autor: {report.target.author}</p>
                    </th>
                    <td className="px-5 py-4">{report.reporter}</td>
                    <td className="px-5 py-4">
                        <ReportStatusBadge status={report.status} />
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500">
                        <time dateTime={report.created_at}>{reportDate(report.created_at)}</time>
                    </td>
                    <td className="px-5 py-4">
                        <button
                            type="button"
                            onClick={() => onReview(report.id)}
                            className="admin-button-secondary"
                            aria-label={`Analisar denúncia ${report.id}`}
                        >
                            Analisar
                        </button>
                    </td>
                </tr>
            ))}
        </AdminTable>
    );
}
