import FireflyIcon from '@/components/shared/FireflyIcon';
import LibraryDrawer from './LibraryDrawer';
import { ArrowUp, BookOpen, Compass, RotateCcw, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const suggestions = [
    { icon: BookOpen, title: 'Uma história para começar', text: 'Quero um livro leve para voltar a ler.' },
    { icon: Sparkles, title: 'Algo que me surpreenda', text: 'Quero sair da minha zona de conforto. Por onde começo?' },
    { icon: Compass, title: 'Uma nova aventura', text: 'Gosto de fantasia e aventura. O que posso ler?' },
];

export default function ReadingAssistant({ isOpen, onClose }) {
    const [messages, setMessages] = useState([]);
    const [draft, setDraft] = useState('');
    const [sending, setSending] = useState(false);
    const [newChat, setNewChat] = useState(false);
    const endRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' });
    }, [messages]);

   
    async function send(text = draft) {
        const content = text.trim();
        if (!content || sending) return;

        setSending(true);
        setMessages((current) => [...current, { role: 'user', text: content }]);
        setDraft('');

        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content ?? '',
                },
                body: JSON.stringify({ message: content, reset: newChat }),
            });

            if (!response.ok) throw new Error('Erro ao consultar Gemini');

            const data = await response.json();
            setNewChat(false);
            setMessages((current) => [...current, { role: 'assistant', text: data.response }]);
        } catch {
            setMessages((current) => [...current, {
                role: 'assistant',
                text: 'Não consegui responder agora. Tente novamente!',
            }]);
        } finally {
            setSending(false);
            inputRef.current?.focus();
        }
    }
    return (
        <LibraryDrawer isOpen={isOpen} onClose={onClose} title="Sua próxima leitura" eyebrow="Converse com Lumi" className="max-w-md">
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <header className="flex items-center gap-3 shrink-0 border-b border-slate-100 pb-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-lumi-navy text-yellow-300"><FireflyIcon className="size-7" /></span>
                    <div className="min-w-0 flex-1">
                        <h3  className="font-bold text-slate-900">Lumi, sua companhia de leitura</h3>
                        <p className="mt-0.5 text-xs text-slate-500">Uma boa conversa pode virar uma ótima história.</p>
                    </div>
                    <button type="button" onClick={() => { setMessages([]); setDraft(''); setNewChat(true); inputRef.current?.focus(); }} disabled={sending || !messages.length} aria-label="Começar nova conversa" title="Nova conversa" className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-600 disabled:opacity-30"><RotateCcw size={18} /></button>
                </header>
                <div className="flex min-h-0 flex-1 flex-col">
                    {messages.length === 0 ? (
                        <div className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto bg-gradient-to-b from-blue-50/60 to-white px-2 py-6 text-center">
                            <span className="mb-5 flex size-16 items-center justify-center rounded-3xl border border-blue-100 bg-white text-blue-600 shadow-sm"><Sparkles size={28} strokeWidth={1.5} /></span>
                            <p className="mb-3 text-xs font-semibold tracking-widest text-blue-600 uppercase">Sua próxima descoberta</p>
                            <h2 className="max-w-md text-2xl font-bold tracking-tight text-slate-900">Qual história combina<br className="hidden sm:block" /> com você hoje?</h2>
                            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-500">Conte o que você gosta, seu humor ou um livro que te marcou. Vamos encontrar uma leitura para chamar de sua.</p>
                            <div className="mt-5 grid w-full gap-2 text-left">
                                {suggestions.map(({ icon: Icon, title, text }) => (
                                    <button type="button" key={title} disabled={sending} onClick={() => send(text)} className="group rounded-2xl border border-slate-200 bg-white p-3 text-left transition-colors hover:border-blue-300 hover:bg-blue-50/50 focus-visible:outline-2 focus-visible:outline-blue-600">
                                        <Icon size={19} className="mb-2 text-blue-500" />
                                        <span className="block text-sm font-semibold text-slate-800">{title}</span>
                                        <span className="mt-2 block text-xs leading-relaxed text-slate-500">{text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div role="log" aria-label="Conversa de recomendação de leitura" aria-live="polite" aria-relevant="additions" className="min-h-0 flex-1 space-y-5 overflow-y-auto px-1 py-5">
                            {messages.map((message, index) => (
                                <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                                    {message.role === 'assistant' && <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Sparkles size={16} /></span>}
                                    <div className={`max-w-[88%] rounded-2xl px-4 py-3  ${message.role === 'user' ? 'rounded-tr-sm bg-lumi-navy text-white' : 'rounded-tl-sm bg-slate-50 text-slate-700'}`}>
                                        <p className={`mb-1 text-xs font-semibold ${message.role === 'user' ? 'text-blue-200' : 'text-blue-600'}`}>{message.role === 'user' ? 'Você' : 'Lumi'}</p>
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.text}</p>
                                    </div>
                                </div>
                            ))}
                            {sending && <p role="status" className="text-sm text-blue-600 motion-safe:animate-pulse">Lumi está pensando na sua próxima leitura...</p>}
                            <div ref={endRef} />
                        </div>
                    )}
                    <div className="shrink-0 border-t border-slate-100 pt-3 pb-1">
                        <form onSubmit={(event) => { event.preventDefault(); send(); }} className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
                            <label htmlFor="reading-message" className="sr-only">Sua mensagem para Lumi</label>
                            <textarea ref={inputRef} id="reading-message" rows={2} maxLength={2000} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); send(); } }} placeholder="Me conta: o que você está com vontade de ler?" className="max-h-40 min-h-14 flex-1 resize-y border-0 bg-transparent px-2 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-0 focus:outline-none" />
                            <button type="submit" disabled={sending || !draft.trim()} aria-label="Enviar mensagem" className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-lumi-navy text-yellow-300 transition-colors hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-30"><ArrowUp size={19} /></button>
                        </form>
                        <p className="mt-3 text-center text-xs text-slate-400">Lumi usa IA e pode cometer erros. Confira a disponibilidade do livro na biblioteca.</p>
                    </div>
                </div>
            </div>
        </LibraryDrawer>
    );
}
