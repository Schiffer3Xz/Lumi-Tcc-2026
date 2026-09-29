import Modal from '@/components/shared/Modal';
import { useForm } from '@inertiajs/react';
import AdminField from '../AdminField';
import AdminForm from '../AdminForm';
import ReportStatusBadge from './ReportStatusBadge';
import { reportDate, reportStatuses } from './report-utils';

export default function ReportReviewDialog({ report, onClose }) {
    const form = useForm({ status: report?.status ?? 'pending', review_note: report?.review_note ?? '' });
    return (
        <Modal
            isOpen={Boolean(report)}
            onClose={() => {
                if (!form.processing) onClose();
            }}
            label={`Analisar denúncia #${report?.id}`}
            overlayClassName="bg-slate-900/50"
            className="admin-app admin-content w-full max-w-2xl rounded-2xl bg-white p-5 text-slate-700 shadow-xl sm:p-8"
        >
            {report && (
                <>
                    <header className="mb-6 flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Denúncia #{report.id}</h2>
                            <p className="mt-1 text-xs text-slate-500">Recebida em {reportDate(report.created_at)}</p>
                        </div>
                        <button
                            type="button"
                            disabled={form.processing}
                            aria-label="Fechar análise"
                            onClick={onClose}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                        >
                            <i className="fa-solid fa-xmark" aria-hidden="true" />
                        </button>
                    </header>
                    <div className="mb-6 space-y-5">
                        <ReportStatusBadge status={report.status} />
                        <section>
                            <h3 className="text-xs font-bold tracking-wide text-slate-500 uppercase">Motivo informado por {report.reporter}</h3>
                            <p className="mt-2 text-sm break-words whitespace-pre-wrap">{report.content}</p>
                        </section>
                        <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <h3 className="text-sm font-semibold text-slate-900">
                                {report.target.type === 'comment' ? 'Comentário' : 'Publicação'} de {report.target.author}
                            </h3>
                            <p className="mt-2 text-xs text-slate-500">
                                {report.target.deleted
                                    ? 'O conteúdo original foi removido. Registro disponível para análise:'
                                    : 'Conteúdo registrado na denúncia:'}
                            </p>
                            <p className="mt-3 text-sm break-words whitespace-pre-wrap">{report.target.content || 'Sem texto disponível.'}</p>
                            {report.target.image && (
                                <img
                                    src={report.target.image}
                                    alt="Imagem da publicação denunciada"
                                    className="mt-4 max-h-64 w-full rounded-lg object-contain"
                                    loading="lazy"
                                />
                            )}
                        </section>
                        {report.reviewed_at && (
                            <p className="text-xs text-slate-500">
                                Última revisão: {report.reviewer ?? 'Conta removida'}, em {reportDate(report.reviewed_at)}.
                            </p>
                        )}
                    </div>
                    <AdminForm
                        form={form}
                        submitLabel="Salvar análise"
                        onSubmit={() => form.patch(route('admin.reports.update', report.id), { preserveScroll: true, onSuccess: onClose })}
                    >
                        <AdminField form={form} name="status" label="Situação" as="select" required>
                            {reportStatuses.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.singular}
                                </option>
                            ))}
                        </AdminField>
                        <AdminField
                            form={form}
                            name="review_note"
                            label="Observações da equipe"
                            as="textarea"
                            rows={4}
                            maxLength={2000}
                            hint="Registro interno, visível somente para administradores. Até 2.000 caracteres."
                        />
                        <p className="text-xs text-slate-500">
                            A análise registra a decisão da equipe. Alterar a situação da denúncia mantém a publicação no feed.
                        </p>
                    </AdminForm>
                </>
            )}
        </Modal>
    );
}
