import Modal from '@/components/shared/Modal';
import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import GroupManagement from './GroupManagement';
import chatRequest from './chatRequest';

export default function ChatDialog({ recipient, viewerId, messages = [], conversationId, onClose }) {
    const initials = recipient?.name
        ?.split(' ')
        .filter(Boolean)
        .map((name) => name[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const [chatMessages, setChatMessages] = useState(messages);
    const [activeConversationId, setActiveConversationId] = useState(conversationId);
    const [content, setContent] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const messagesEndRef = useRef(null);
    const sendingRef = useRef(false);
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (conversationId) setActiveConversationId(conversationId);
    }, [conversationId]);

    const sortMessages = (messageList) =>
        [...messageList].sort((first, second) => new Date(first.created_at).getTime() - new Date(second.created_at).getTime());

    const conversation = sortMessages(chatMessages);

    useEffect(() => {
        setContent('');
        setError('');
    }, [recipient.id, recipient.is_group]);

    useEffect(() => {
        setChatMessages((current) => {
            const merged = [...current];

            messages.forEach((message) => {
                const existingIndex = merged.findIndex((currentMessage) => String(currentMessage.id) === String(message.id));

                if (existingIndex >= 0) {
                    merged[existingIndex] = message;
                    return;
                }

                const optimisticIndex = merged.findIndex(
                    (currentMessage) =>
                        String(currentMessage.id).startsWith('pending-') &&
                        Number(currentMessage.user_id) === Number(message.user_id) &&
                        currentMessage.content === message.content,
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
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        });
    }, [conversation.length]);

    useEffect(() => {
        if (!activeConversationId || !window.Echo) {
            return;
        }

        const channelName = recipient.is_group ? `conversation.${activeConversationId}.user.${viewerId}` : `conversation.${activeConversationId}`;
        const channel = window.Echo.private(channelName);

        channel.listen('GroupUpdated', (event) => {
            if (event.deleted || Number(event.removedUserId) === Number(viewerId)) {
                onCloseRef.current();
                return;
            }
            router.reload({ only: ['groupConversations'] });
        });

        channel.listen('MessageSent', (event) => {
            const receivedMessage = {
                id: event.message.id,
                user_id: event.message.fk_user_id,
                user_name: event.message.user_name,
                content: event.message.content,
                created_at: event.message.created_at,
            };

            setChatMessages((current) => {
                if (current.some((message) => String(message.id) === String(receivedMessage.id))) {
                    return current;
                }

                const optimisticIndex = current.findIndex(
                    (message) =>
                        String(message.id).startsWith('pending-') &&
                        Number(message.user_id) === Number(receivedMessage.user_id) &&
                        message.content === receivedMessage.content,
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
            window.Echo.leave(channelName);
        };
    }, [activeConversationId, recipient.is_group, viewerId]);

    const enviar = (event) => {
        event.preventDefault();

        const messageContent = content.trim();

        if (!messageContent || !recipient || sendingRef.current) {
            return;
        }

        const temporaryId = `pending-${Date.now()}`;
        sendingRef.current = true;

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

        chatRequest(recipient.is_group ? route('chat.groups.messages.store', recipient.id, false) : route('chat', undefined, false), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...(recipient.is_group ? {} : { user_id: recipient.id }),
                content: messageContent,
            }),
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setActiveConversationId(data.conversation_id);
                setChatMessages((current) =>
                    sortMessages([
                        ...current.filter((message) => message.id !== temporaryId && String(message.id) !== String(data.message.id)),
                        data.message,
                    ]),
                );
            })
            .catch((failure) => {
                setChatMessages((current) => current.filter((message) => message.id !== temporaryId));

                setContent(messageContent);
                setError(
                    failure.message === 'Failed to fetch'
                        ? 'Não foi possível conectar ao chat. Verifique sua conexão e tente novamente.'
                        : failure.message || 'Não foi possível enviar a mensagem.',
                );
            })
            .finally(() => {
                sendingRef.current = false;
                setProcessing(false);
            });
    };

    if (!recipient) {
        return null;
    }

    return (
        <Modal
            isOpen={Boolean(recipient)}
            onClose={onClose}
            closeOnBackdrop
            labelledBy="chat-dialog-title"
            overlayClassName="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-4"
            className="relative flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-800 shadow-2xl"
        >
            {/* Cabeçalho */}
            <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50 via-white to-indigo-50 px-6 py-5 pr-12">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-md shadow-blue-200">
                        {initials}
                    </div>

                    <div className="min-w-0">
                        <h2 id="chat-dialog-title" className="truncate text-base font-bold text-slate-800">
                            {recipient.name}
                        </h2>

                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            {recipient.is_group ? `${recipient.participants.length} participantes` : 'Conversa privada'}
                        </p>
                    </div>
                </div>

                {recipient.is_group && (
                    <>
                        <p className="mt-3 max-h-12 overflow-y-auto text-xs text-slate-500">
                            {recipient.participants.map((member) => member.name).join(', ')}
                        </p>
                        <GroupManagement group={recipient} onDeleted={onClose} />
                    </>
                )}

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Fechar conversa"
                    className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:ring-4 focus:ring-blue-100 focus:outline-none"
                >
                    ×
                </button>
            </div>

            {/* Mensagens */}
            <div
                role="log"
                aria-label="Mensagens da conversa"
                aria-relevant="additions text"
                className="min-h-0 flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 to-blue-50/40 p-4 sm:p-5"
            >
                {conversation.length ? (
                    <div className="space-y-3">
                        {conversation.map((message) => {
                            const mine = Number(message.user_id) === Number(viewerId);

                            return (
                                <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                                            mine
                                                ? 'rounded-br-md bg-blue-600 text-white'
                                                : 'rounded-bl-md border border-slate-100 bg-white text-slate-700'
                                        }`}
                                    >
                                        {recipient.is_group && !mine && (
                                            <p className="mb-1 text-xs font-semibold text-blue-600">
                                                {message.user_name ??
                                                    recipient.participants.find((member) => Number(member.id) === Number(message.user_id))?.name ??
                                                    'Participante'}
                                            </p>
                                        )}
                                        <p className="break-words whitespace-pre-wrap">{message.content}</p>

                                        <p className={`text-caption-sm mt-1 ${mine ? 'text-blue-100' : 'text-slate-400'}`}>
                                            {message.pending
                                                ? 'Enviando...'
                                                : new Date(message.created_at).toLocaleTimeString('pt-BR', {
                                                      hour: '2-digit',
                                                      minute: '2-digit',
                                                  })}
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
                            <i className="fa-regular fa-comment-dots text-lg" aria-hidden="true" />
                        </div>

                        <p className="text-sm font-semibold text-slate-700">Comece uma conversa</p>

                        <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
                            Envie uma mensagem para {recipient?.name?.split(' ')[0]}.
                        </p>
                    </div>
                )}
            </div>

            {/* Campo de mensagem */}
            <form onSubmit={enviar} className="border-t border-slate-100 bg-white p-3 sm:p-4">
                <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                    <textarea
                        rows={1}
                        maxLength={5000}
                        disabled={processing}
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                                enviar(event);
                            }
                        }}
                        aria-label="Sua mensagem"
                        placeholder="Escreva uma mensagem..."
                        className="max-h-28 min-h-10 flex-1 resize-y bg-transparent px-2 py-2 text-sm leading-5 text-slate-700 outline-none placeholder:text-slate-400"
                    />

                    <button
                        type="submit"
                        disabled={!content.trim() || processing}
                        aria-label="Enviar mensagem"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-sm text-slate-500 transition-all hover:bg-blue-600 hover:text-white hover:shadow-md hover:shadow-blue-200 focus:ring-4 focus:ring-blue-100 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-slate-200 disabled:hover:text-slate-500"
                    >
                        <i className="fa-solid fa-paper-plane" aria-hidden="true" />
                    </button>
                </div>

                {error && (
                    <p role="alert" className="mt-2 px-2 text-xs text-rose-600">
                        {error}
                    </p>
                )}
            </form>
        </Modal>
    );
}
