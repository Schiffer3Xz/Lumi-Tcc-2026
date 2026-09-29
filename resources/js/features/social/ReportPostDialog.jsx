import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { Flag, Loader2, ShieldCheck } from 'lucide-react';
import { useRef } from 'react';

export default function ReportPostDialog({ postId, open, onClose, onSuccess, returnFocusRef }) {
    const form = useForm({ content: '' });
    const inputRef = useRef(null);
    const close = () => {
        if (form.processing) return;
        form.reset();
        form.clearErrors();
        onClose();
    };
    const submit = (event) => {
        event.preventDefault();
        if (!form.data.content.trim() || form.processing) return;
        form.transform((data) => ({ content: data.content.trim() }));
        form.post(route('posts.report', postId), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                onSuccess();
                onClose();
            },
            onError: () => inputRef.current?.focus(),
        });
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!value) close();
            }}
        >
            <DialogContent
                onCloseAutoFocus={(event) => {
                    event.preventDefault();
                    returnFocusRef.current?.focus();
                }}
                overlayClassName="bg-slate-900/35 backdrop-blur-sm"
                className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-md gap-0 overflow-y-auto rounded-3xl border-slate-200 bg-white p-0 text-slate-800 shadow-2xl sm:rounded-3xl [&>button]:rounded-full [&>button]:text-slate-500 [&>button]:data-[state=open]:bg-slate-100 [&>button]:data-[state=open]:text-slate-500"
            >
                <DialogHeader className="space-y-3 rounded-t-3xl bg-gradient-to-br from-blue-50 via-slate-50 to-white px-6 pt-7 pb-5 text-left">
                    <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-100 bg-rose-50 text-rose-500">
                        <Flag className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">Denunciar publicação</DialogTitle>

                    <DialogDescription className="text-sm leading-relaxed text-slate-500">
                        Ajude a cuidar da comunidade Lumi. Conte o que aconteceu para que possamos analisar a publicação.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} aria-busy={form.processing}>
                    <div className="space-y-3 px-6 py-5">
                        <label htmlFor={`report-content-${postId}`} className="block text-sm font-semibold text-slate-700">
                            Motivo da denúncia
                        </label>
                        <textarea
                            ref={inputRef}
                            required
                            id={`report-content-${postId}`}
                            aria-invalid={Boolean(form.errors.content)}
                            aria-describedby={`report-hint-${postId}${form.errors.content ? ` report-error-${postId}` : ''}`}
                            placeholder="Descreva o motivo da denúncia..."
                            value={form.data.content}
                            onChange={(event) => form.setData('content', event.target.value)}
                            rows={5}
                            maxLength={100}
                            disabled={form.processing}
                            className="block min-h-32 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm leading-relaxed text-slate-700 transition-colors outline-none placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:opacity-60 aria-invalid:border-rose-400"
                        />
                        <div id={`report-hint-${postId}`} className="flex justify-between gap-3 text-xs text-slate-500">
                            <span>Descreva o motivo em até 100 caracteres.</span>
                            <span className="shrink-0 tabular-nums">{form.data.content.length}/100</span>
                        </div>
                        {form.errors.content && (
                            <p id={`report-error-${postId}`} role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600">
                                {form.errors.content}
                            </p>
                        )}
                        <div className="flex items-start gap-2.5 rounded-xl bg-blue-50 px-3 py-3 text-xs leading-relaxed text-blue-700">
                            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                            <p>A equipe administrativa receberá sua denúncia para análise. Obrigado por ajudar a manter um espaço respeitoso.</p>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 border-t border-slate-100 bg-slate-50/80 px-6 py-4 sm:space-x-0">
                        <Button
                            variant="outline"
                            className="h-11 rounded-xl border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-800 focus-visible:ring-blue-400"
                            type="button"
                            disabled={form.processing}
                            onClick={close}
                        >
                            Cancelar
                        </Button>

                        <Button
                            className="h-11 rounded-xl bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus-visible:ring-blue-400"
                            disabled={!form.data.content.trim() || form.processing}
                            type="submit"
                        >
                            {form.processing ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Flag aria-hidden="true" />}
                            {form.processing ? 'Enviando...' : 'Enviar denúncia'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
