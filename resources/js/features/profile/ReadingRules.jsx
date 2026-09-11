export default function ReadingRules({ rules }) {
    return (
        <div className="space-y-4 rounded-2xl border border-[#E3DCCE] bg-[#EFEAE1] p-6 text-slate-800">
            <div className="flex items-center gap-3">
                <div className="rounded-xl bg-yellow-400/30 p-2 text-yellow-800">
                    <i className="fa-solid fa-circle-info text-lg" />
                </div>
                <div>
                    <h4 className="text-sm font-bold">Regras da Sala de Leitura</h4>
                    <p className="text-xs text-slate-500">Normas vigentes — Ano letivo 2026</p>
                </div>
            </div>

            <ol className="space-y-2 text-xs text-slate-700">
                {rules.map((rule, idx) => (
                    <li key={rule} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-yellow-400/40 text-[10px] font-bold text-yellow-900">
                            {idx + 1}
                        </span>
                        <span>{rule}</span>
                    </li>
                ))}
            </ol>
        </div>
    );
}
