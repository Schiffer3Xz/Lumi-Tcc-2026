import { router, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { reportDate } from './report-utils';

const categoryLabels = {
    harassment: 'Assédio',
    'harassment/threatening': 'Assédio com ameaça',
    hate: 'Discurso de ódio',
    'hate/threatening': 'Discurso de ódio com ameaça',
    illicit: 'Atividade ilícita',
    'illicit/violent': 'Atividade ilícita com violência',
    sexual: 'Conteúdo sexual',
    'sexual/minors': 'Conteúdo sexual envolvendo menores',
    'self-harm': 'Autolesão',
    'self-harm/intent': 'Intenção de autolesão',
    'self-harm/instructions': 'Instruções de autolesão',
    violence: 'Violência',
    'violence/graphic': 'Violência gráfica',
};

const statusLabels = {
    pending: 'Aguardando análise automática.',
    unavailable: 'Análise automática indisponível. A equipe pode revisar manualmente.',
    unsupported: 'Não há texto registrado para análise automática.',
    failed: 'Não foi possível concluir a análise. Você pode tentar novamente ou revisar manualmente.',
};

export default function ReportModerationPanel({ report }) {
    const form = useForm({});
    const moderation = report.moderation;
    const pending = moderation?.status === 'pending';

    useEffect(() => {
        if (!pending) return;
        const timer = window.setInterval(() => router.reload({ only: ['reports'], preserveScroll: true }), 5000);
        return () => window.clearInterval(timer);
    }, [pending]);

    if (!moderation) return null;
    const completed = moderation.status === 'completed';
    const flagged = moderation.result?.flagged;
    const categories = Object.entries(moderation.result?.categories ?? {}).filter(([, value]) => value === true);

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-4" aria-label="Análise automática do texto">
            <h3 className="mb-2 text-sm font-semibold text-slate-900">Análise automática do texto</h3>
            <p role="status" className={`text-sm ${completed && flagged ? 'font-semibold text-rose-700' : 'text-slate-600'}`}>
                {completed
                    ? flagged
                        ? 'Conteúdo sinalizado para revisão.'
                        : 'Nenhuma sinalização automática encontrada.'
                    : (statusLabels[moderation.status] ?? 'Análise ainda não realizada.')}
            </p>
            {categories.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2" aria-label="Categorias sinalizadas">
                    {categories.map(([category]) => (
                        <li key={category} className="rounded-lg bg-rose-50 px-2 py-1 text-xs text-rose-700">
                            {categoryLabels[category] ?? category}
                        </li>
                    ))}
                </ul>
            )}
            {moderation.analyzed_at && <p className="mt-2 text-xs text-slate-500">Analisado em {reportDate(moderation.analyzed_at)}.</p>}
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
                Este resultado é um apoio à revisão da equipe e pode conter erros. Imagens não estão incluídas na análise. A decisão final continua
                sendo administrativa.
            </p>
            {!pending && moderation.status !== 'unsupported' && (
                <button
                    type="button"
                    disabled={form.processing}
                    onClick={() => form.post(route('admin.reports.moderate', report.id), { preserveScroll: true })}
                    className="admin-button-secondary mt-3"
                >
                    {form.processing ? 'Solicitando...' : completed ? 'Analisar novamente' : 'Solicitar análise automática'}
                </button>
            )}
            {Object.values(form.errors).map((error) => (
                <p key={error} role="alert" className="mt-2 text-xs text-rose-700">
                    {error}
                </p>
            ))}
        </section>
    );
}
