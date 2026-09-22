import { useEffect, useRef, useState } from 'react';

export default function ChatDialog({
    recipient,
    viewerId,
    messages = [],
    conversationId,
    onClose,
}) {
    const initials = recipient?.name
        ?.split(' ')
        .filter(Boolean)
        .map((name) => name[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const [chatMessages, setChatMessages] = useState(messages);
    const [content, setContent] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const messagesEndRef = useRef(null);

    const sortMessages = (messageList) =>
        [...messageList].sort(
            (first, second) =>
                new Date(first.created_at).getTime() -
                new Date(second.created_at).getTime()
        );

    const conversation = sortMessages(chatMessages);

    useEffect(() => {
        setContent('');
        setError('');
    }, [recipient]);

    useEffect(() => {
        setChatMessages((current) => {
            const merged = [...current];

            messages.forEach((message) => {
                const existingIndex = merged.findIndex(
                    (currentMessage) =>
                        String(currentMessage.id) === String(message.id)
                );

                if (existingIndex >= 0) {
                    merged[existingIndex] = message;
                    return;
                }

                const optimisticIndex = merged.findIndex(
                    (currentMessage) =>
                        String(currentMessage.id).startsWith('pending-') &&
                        Number(currentMessage.user_id) ===
                            Number(message.user_id) &&
                        currentMessage.content === message.content
                );

                if (optimisticIndex >= 0) {
                    merged[optimisticIndex] = message;
                    return;
                }

                merged.push(message);
            });

            return sortMessages(merged);
        });
    }, [messages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth',
        });
    }, [conversation.length]);

    useEffect(() => {
        const closeOnEscape = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', closeOnEscape);

        return () => {
            window.removeEventListener('keydown', closeOnEscape);
        };
    }, [onClose]);

    useEffect(() => {
        if (!conversationId || !window.Echo) {
            return;
        }

        console.log(
            '🟡 Entrando no canal:',
            `conversation.${conversationId}`
        );

        const channel = window.Echo.private(
            `conversation.${conversationId}`
        );

        channel.subscribed(() => {
            console.log(
                '🟢 INSCRITO NO CANAL:',
                `conversation.${conversationId}`
            );
        });

        channel.error((error) => {
            console.log('🔴 ERRO NO CANAL:', error);
        });

        channel.listen('MessageSent', (event) => {
            const receivedMessage = {
                id: event.message.id,
                user_id: event.message.fk_user_id,
                content: event.message.content,
                created_at: event.message.created_at,
            };

            setChatMessages((current) => {
                if (
                    current.some(
                        (message) =>
                            String(message.id) ===
                            String(receivedMessage.id)
                    )
                ) {
                    return current;
                }

                const optimisticIndex = current.findIndex(
                    (message) =>
                        String(message.id).startsWith('pending-') &&
                        Number(message.user_id) ===
                            Number(receivedMessage.user_id) &&
                        message.content === receivedMessage.content
                );

                if (optimisticIndex >= 0) {
                    const updated = [...current];
                    updated[optimisticIndex] = receivedMessage;
                    return sortMessages(updated);
                }

                return sortMessages([...current, receivedMessage]);
            });
        });

        return () => {
            window.Echo.leave(
                `conversation.${conversationId}`
            );

            console.log(
                '⚪ Saiu do canal:',
                `conversation.${conversationId}`
            );
        };
    }, [conversationId]);

    const enviar = (event) => {
        event.preventDefault();

        const messageContent = content.trim();

        if (!messageContent || !recipient || processing) {
            return;
        }

        const temporaryId = `pending-${Date.now()}`;

        setChatMessages((current) => [
            ...current,
            {
                id: temporaryId,
                content: messageContent,
                user_id: viewerId,
                created_at: new Date().toISOString(),
                pending: true,
            },
        ]);

        setContent('');
        setError('');
        setProcessing(true);

        fetch('/chat/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-CSRF-TOKEN':
                    document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute('content') ?? '',
            },
            body: JSON.stringify({
                user_id: recipient.id,
                content: messageContent,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        'Não foi possível enviar a mensagem.'
                    );
                }

                setChatMessages((current) =>
                    current.map((message) =>
                        message.id === temporaryId
                            ? {
                                  ...message,
                                  pending: false,
                              }
                            : message
                    )
                );
            })
            .catch(() => {
                setChatMessages((current) =>
                    current.filter(
                        (message) => message.id !== temporaryId
                    )
                );

                setContent(messageContent);
                setError(
                    'Não foi possível enviar a mensagem.'
                );
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    if (!recipient) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-dialog-title"
            onClick={onClose}
        >
            <div
                className="relative flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-800 shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                {/* Cabeçalho */}
                <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50 via-white to-indigo-50 px-6 py-5 pr-12">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-md shadow-blue-200">
                            {initials}
                        </div>

                        <div className="min-w-0">
                            <h2
                                id="chat-dialog-title"
                                className="truncate text-base font-bold text-slate-800"
                            >
                                {recipient.name}
                            </h2>

                            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                Conversa privada
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar conversa"
                        className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                    >
                        ×
                    </button>
                </div>

                {/* Mensagens */}
                <div className="min-h-0 flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 to-blue-50/40 p-4 sm:p-5">
                    {conversation.length ? (
                        <div className="space-y-3">
                            {conversation.map((message) => {
                                const mine =
                                    Number(message.user_id) ===
                                    Number(viewerId);

                                return (
                                    <div
                                        key={message.id}
                                        className={`flex ${
                                            mine
                                                ? 'justify-end'
                                                : 'justify-start'
                                        }`}
                                    >
                                        <div
                                            className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                                                mine
                                                    ? 'rounded-br-md bg-blue-600 text-white'
                                                    : 'rounded-bl-md border border-slate-100 bg-white text-slate-700'
                                            }`}
                                        >
                                            <p className="break-words whitespace-pre-wrap">
                                                {message.content}
                                            </p>

                                            <p
                                                className={`mt-1 text-[10px] ${
                                                    mine
                                                        ? 'text-blue-100'
                                                        : 'text-slate-400'
                                                }`}
                                            >
                                                {message.pending
                                                    ? 'Enviando...'
                                                    : new Date(
                                                          message.created_at
                                                      ).toLocaleTimeString(
                                                          'pt-BR',
                                                          {
                                                              hour: '2-digit',
                                                              minute: '2-digit',
                                                          }
                                                      )}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}

                            <div ref={messagesEndRef} />
                        </div>
                    ) : (
                        <div className="flex h-full min-h-56 flex-col items-center justify-center px-6 text-center">
                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                                <i
                                    className="fa-regular fa-comment-dots text-lg"
                                    aria-hidden="true"
                                />
                            </div>

                            <p className="text-sm font-semibold text-slate-700">
                                Comece uma conversa
                            </p>

                            <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
                                Envie uma mensagem para{' '}
                                {recipient?.name?.split(' ')[0]}.
                            </p>
                        </div>
                    )}
                </div>

                {/* Campo de mensagem */}
                <form
                    onSubmit={enviar}
                    className="border-t border-slate-100 bg-white p-3 sm:p-4"
                >
                    <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                        <textarea
                            rows={1}
                            value={content}
                            onChange={(event) =>
                                setContent(event.target.value)
                            }
                            onKeyDown={(event) => {
                                if (
                                    event.key === 'Enter' &&
                                    !event.shiftKey
                                ) {
                                    enviar(event);
                                }
                            }}
                            aria-label="Sua mensagem"
                            placeholder="Escreva uma mensagem..."
                            className="min-h-10 max-h-28 flex-1 resize-y bg-transparent px-2 py-2 text-sm leading-5 text-slate-700 outline-none placeholder:text-slate-400"
                        />

                        <button
                            type="submit"
                            disabled={
                                !content.trim() || processing
                            }
                            aria-label="Enviar mensagem"
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-sm text-slate-500 transition-all hover:bg-blue-600 hover:text-white hover:shadow-md hover:shadow-blue-200 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-slate-200 disabled:hover:text-slate-500"
                        >
                            <i
                                className="fa-solid fa-paper-plane"
                                aria-hidden="true"
                            />
                        </button>
                    </div>

                    {error && (
                        <p className="mt-2 px-2 text-xs text-rose-600">
                            {error}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}