export default function subscribeToChat({ echo, viewerId, reload, onUpdate }) {
    if (!echo || !viewerId) return () => {};

    const channelName = `chat.user.${viewerId}`;
    const channel = echo.private(channelName);
    let stopped = false;
    let loading = false;
    let dirty = false;

    const refresh = () => {
        if (stopped) return;
        if (loading) {
            dirty = true;
            return;
        }
        loading = true;
        reload({
            only: ['directMessages', 'groupConversations', 'conversationUsers'],
            async: true,
            onFinish: () => {
                loading = false;
                if (dirty) {
                    dirty = false;
                    refresh();
                }
            },
        });
    };

    channel.listen('ConversationUpdated', (event) => {
        if (stopped) return;
        onUpdate(event);
        refresh();
    });
    // Subscription success also runs after reconnecting. Fetch anything sent
    // before subscribing or while the WebSocket was disconnected.
    channel.subscribed(refresh);

    return () => {
        stopped = true;
        echo.leave(channelName);
    };
}
