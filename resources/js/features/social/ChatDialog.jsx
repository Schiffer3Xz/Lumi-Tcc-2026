import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useEffect, useRef, useState } from 'react';

async function requestChat(url, { data, signal } = {}) {
    const token = document.cookie
        .split('; ')
        .find((cookie) => cookie.startsWith('XSRF-TOKEN='))
        ?.slice('XSRF-TOKEN='.length);
    const response = await fetch(url, {
        method: data ? 'POST' : 'GET',
        credentials: 'same-origin',
        signal,
        headers: {
            Accept: 'application/json',
            ...(data ? { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': decodeURIComponent(token ?? '') } : {}),
        },
        ...(data ? { body: JSON.stringify(data) } : {}),
    });
    if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(
            Object.values(payload.errors ?? {}).flat()[0] ||
                (response.status === 419 || response.status === 401
                    ? 'Sua sessão expirou. Recarregue a página para continuar.'
                    : 'Não foi possível concluir a ação. Tente novamente.'),
        );
    }
    return response.status === 204 ? null : response.json();
}

function Conversation({ recipient, viewerId }) {
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [loadingOlder, setLoadingOlder] = useState(false);
    const [hasOlder, setHasOlder] = useState(false);
    const [error, setError] = useState('');
    const scrollRef = useRef(null);
    const inputRef = useRef(null);
    const activeRef = useRef(true);
    const sendingRef = useRef(false);
    const pollRef = useRef(false);

    const merge = (incoming) =>
        setMessages((current) =>
            [...new Map([...current, ...incoming].map((message) => [message.id, message])).values()].sort((a, b) => a.id - b.id),
        );

    useEffect(() => {
        activeRef.current = true;
        const controller = new AbortController();
        let firstLoad = true;
        const load = async () => {
            if (document.hidden || pollRef.current) return;
            pollRef.current = true;
            try {
                const data = await requestChat(route('messages.index', recipient.id), { signal: controller.signal });
                if (controller.signal.aborted) return;
                const container = scrollRef.current;
                const atBottom = !container || container.scrollHeight - container.scrollTop - container.clientHeight < 80;
                merge(data.messages);
                if (firstLoad) setHasOlder(data.hasOlder);
                if (firstLoad || atBottom) requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }));
                firstLoad = false;
                setError('');
                if (!document.hidden && data.messages.some((message) => message.sender_id !== viewerId && !message.read_at)) {
                    await requestChat(route('messages.read', recipient.id), {
                        data: { through: data.messages.at(-1).id },
                        signal: controller.signal,
                    });
                }
            } catch (error) {
                if (!controller.signal.aborted) setError(error.message);
            } finally {
                pollRef.current = false;
                if (!controller.signal.aborted) setLoading(false);
            }
        };
        load();
        const timer = setInterval(load, 10000);
        document.addEventListener('visibilitychange', load);
        return () => {
            activeRef.current = false;
            controller.abort();
            clearInterval(timer);
            document.removeEventListener('visibilitychange', load);
        };
    }, [recipient.id, viewerId]);

    const send = async (event) => {
        event.preventDefault();
        if (!content.trim() || sendingRef.current) return;
        sendingRef.current = true;
        setSending(true);
        setError('');
        try {
            await requestChat(route('messages.store', recipient.id), { data: { content: content.trim() } });
            if (!activeRef.current) return;
            setContent('');
            const data = await requestChat(route('messages.index', recipient.id));
            if (!activeRef.current) return;
            merge(data.messages);
            requestAnimationFrame(() => {
                scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
                inputRef.current?.focus();
            });
        } catch (error) {
            if (activeRef.current) setError(error.message);
        } finally {
            sendingRef.current = false;
            if (activeRef.current) setSending(false);
        }
    };

    const loadOlder = async () => {
        if (loadingOlder || !messages.length) return;
        setLoadingOlder(true);
        try {
            const data = await requestChat(route('messages.index', { id: recipient.id, before: messages[0].id }));
            if (!activeRef.current) return;
            const container = scrollRef.current;
            const previousHeight = container?.scrollHeight ?? 0;
            merge(data.messages);
            setHasOlder(data.hasOlder);
            requestAnimationFrame(() => {
                if (container) container.scrollTop += container.scrollHeight - previousHeight;
            });
        } catch (error) {
            if (activeRef.current) setError(error.message);
        } finally {
            if (activeRef.current) setLoadingOlder(false);
        }
    };

    return (
        <>
            <div
                ref={scrollRef}
                className="h-[45dvh] min-h-48 space-y-3 overflow-y-auto rounded-xl bg-slate-50 p-3"
                aria-label="Mensagens da conversa"
            >
                {hasOlder && (
                    <button type="button" disabled={loadingOlder} onClick={loadOlder} className="block w-full text-center text-xs text-blue-600">
                        {loadingOlder ? 'Carregando...' : 'Carregar mensagens anteriores'}
                    </button>
                )}
                {loading && (
                    <p role="status" className="py-4 text-center text-sm text-slate-500">
                        Carregando conversa...
                    </p>
                )}
                {!loading && !messages.length && <p className="py-6 text-center text-sm text-slate-500">Comece a conversa enviando uma mensagem.</p>}
                {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender_id === viewerId ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`max-w-[85%] rounded-2xl px-3 py-2 ${message.sender_id === viewerId ? 'bg-blue-600 text-white' : 'border border-slate-200 bg-white text-slate-700'}`}
                        >
                            <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>
                            <p className="mt-1 text-right text-[10px] opacity-70">
                                {new Date(message.created_at.replace(' ', 'T') + 'Z').toLocaleString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            {error && (
                <p role="alert" className="text-xs text-red-600">
                    {error}
                </p>
            )}
            <form onSubmit={send} className="flex items-end gap-2">
                <textarea
                    ref={inputRef}
                    value={content}
                    disabled={sending}
                    onChange={(event) => setContent(event.target.value)}
                    maxLength={2000}
                    rows={2}
                    aria-label="Sua mensagem"
                    placeholder="Escreva uma mensagem..."
                    className="min-w-0 flex-1 resize-none rounded-xl border border-slate-200 p-3 text-sm"
                />
                <button
                    type="submit"
                    disabled={sending || !content.trim()}
                    className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
                >
                    {sending ? 'Enviando...' : 'Enviar'}
                </button>
            </form>
        </>
    );
}

export default function ChatDialog({ recipient, viewerId, onClose }) {
    return (
        <Dialog
            open={Boolean(recipient)}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl bg-white text-slate-800">
                <DialogTitle className="pr-6">Conversa com {recipient?.name}</DialogTitle>
                <DialogDescription>Mensagens privadas entre vocês. A conversa é atualizada automaticamente.</DialogDescription>
                {recipient && <Conversation key={recipient.id} recipient={recipient} viewerId={viewerId} />}
            </DialogContent>
        </Dialog>
    );
}
