import assert from 'node:assert/strict';
import test from 'node:test';
import subscribeToChat from '../../resources/js/features/social/subscribeToChat.js';

function setup() {
    const handlers = {};
    const requests = [];
    const updates = [];
    const left = [];
    const echo = {
        private(name) {
            assert.equal(name, 'chat.user.7');
            return {
                listen(event, handler) {
                    handlers[event] = handler;
                },
                subscribed(handler) {
                    handlers.subscribed = handler;
                },
            };
        },
        leave(name) {
            left.push(name);
        },
    };
    const stop = subscribeToChat({ echo, viewerId: 7, reload: (options) => requests.push(options), onUpdate: (event) => updates.push(event) });
    return { handlers, requests, updates, left, stop };
}

test('new conversations and invitations refresh the inbox without an open dialog', () => {
    const state = setup();
    state.handlers.ConversationUpdated({ conversationId: 12 });
    assert.deepEqual(state.updates, [{ conversationId: 12 }]);
    assert.deepEqual(state.requests[0].only, ['directMessages', 'groupConversations', 'conversationUsers']);
    assert.equal(state.requests[0].async, true);
});

test('subscription and reconnection fetch messages missed while disconnected', () => {
    const state = setup();
    state.handlers.subscribed();
    state.requests[0].onFinish();
    state.handlers.subscribed();
    assert.equal(state.requests.length, 2);
});

test('events received during a refresh trigger a subsequent refresh instead of being lost', () => {
    const state = setup();
    state.handlers.subscribed();
    state.handlers.ConversationUpdated({ conversationId: 12 });
    state.handlers.ConversationUpdated({ conversationId: 13 });
    assert.equal(state.requests.length, 1);
    state.requests[0].onFinish();
    assert.equal(state.requests.length, 2);
    state.requests[1].onFinish();
    assert.equal(state.requests.length, 2);
});

test('leaving the page stops updates and any queued refresh', () => {
    const state = setup();
    state.handlers.subscribed();
    state.handlers.ConversationUpdated({ conversationId: 12, deleted: true });
    state.stop();
    state.requests[0].onFinish();
    state.handlers.ConversationUpdated({ conversationId: 13 });
    state.handlers.subscribed();
    assert.deepEqual(state.left, ['chat.user.7']);
    assert.equal(state.requests.length, 1);
    assert.equal(state.updates.length, 1);
});

test('missing realtime configuration does not prevent mounting', () => {
    assert.equal(typeof subscribeToChat({ viewerId: 7 }), 'function');
});
