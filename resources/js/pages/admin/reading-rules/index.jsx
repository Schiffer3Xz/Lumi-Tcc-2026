import AdminField from '@/features/admin/AdminField';
import AdminForm from '@/features/admin/AdminForm';
import AdminPageHeader from '@/features/admin/AdminPageHeader';
import DeleteConfirmation from '@/features/admin/DeleteConfirmation';
import ReadingRules from '@/features/profile/ReadingRules';
import AdminLayout from '@/layouts/admin-layout';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

function RuleForm({ rule, onCancel }) {
    const form = useForm({ text: rule?.text ?? '' });

    function submit() {
        if (rule) {
            form.patch(route('admin.reading-rules.update', rule.id), { preserveScroll: true, onSuccess: onCancel });
        } else {
            form.post(route('admin.reading-rules.store'), { preserveScroll: true, onSuccess: () => form.reset() });
        }
    }

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="mb-4 font-bold text-slate-900">{rule ? 'Editar regra' : 'Cadastrar regra'}</h2>
            <AdminForm form={form} onSubmit={submit} submitLabel={rule ? 'Salvar alterações' : 'Cadastrar regra'}>
                <AdminField form={form} name="text" label="Texto da regra" as="textarea" rows={4} maxLength={1000} required />
                {rule && (
                    <button type="button" className="admin-button-secondary" disabled={form.processing} onClick={onCancel}>
                        Cancelar edição
                    </button>
                )}
            </AdminForm>
        </section>
    );
}

export default function ReadingRulesAdmin({ rules }) {
    const [editing, setEditing] = useState(null);
    const [target, setTarget] = useState(null);
    const selectedRule = rules.find((rule) => rule.id === editing);

    return (
        <AdminLayout title="Regras da Sala de Leitura" section="reading-rules">
            <AdminPageHeader title="Regras da Sala de Leitura" description="Gerencie as orientações exibidas aos leitores." />
            <div className="grid items-start gap-6 lg:grid-cols-2">
                <div className="min-w-0 space-y-5">
                    <RuleForm key={selectedRule?.id ?? 'new'} rule={selectedRule} onCancel={() => setEditing(null)} />
                    {rules.length > 0 && (
                        <ol className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white px-5">
                            {rules.map((rule, index) => (
                                <li key={rule.id} className="space-y-3 py-4">
                                    <p className="break-words whitespace-pre-line text-sm text-slate-800">
                                        <span className="mr-2 font-bold">{index + 1}.</span>
                                        {rule.text}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <button type="button" className="admin-button-secondary" onClick={() => setEditing(rule.id)}>
                                            Editar
                                        </button>
                                        <button
                                            type="button"
                                            className="rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                                            onClick={() => setTarget({ label: rule.text, href: route('admin.reading-rules.destroy', rule.id) })}
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    )}
                </div>
                <section className="min-w-0 space-y-3" aria-labelledby="reading-rules-preview">
                    <h2 id="reading-rules-preview" className="text-sm font-bold text-slate-700">
                        Como os leitores veem
                    </h2>
                    <ReadingRules rules={rules} />
                </section>
            </div>
            <DeleteConfirmation target={target} onClose={() => setTarget(null)} />
        </AdminLayout>
    );
}
