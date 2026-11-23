const messages = {
    like: 'curtiu sua publicação',
    comment: 'comentou na sua publicação',
    follow: 'começou a seguir você',
    message: 'enviou uma mensagem no chat',
};

export default function NotificationMessage({ notification }) {
    if (notification.kind === 'library_notice') {
        return <>📚 A biblioteca publicou um novo comunicado{notification.excerpt ? `: ${notification.excerpt}` : '.'}</>;
    }

    return <><strong>{notification.actor}</strong> {messages[notification.kind]}.</>;
}
