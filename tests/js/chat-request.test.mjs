import assert from 'node:assert/strict';
import test from 'node:test';
import chatRequest from '../../resources/js/features/social/chatRequest.js';

test('chat uses the renewed cookie after login instead of the stale document token', async (context) => {
    let cookie = 'other=value;XSRF-TOKEN=current%3Dtoken';
    const requests = [];
    context.mock.method(globalThis, 'fetch', async (url, options) => {
        requests.push({ url, options });
        return { ok: true };
    });
    const original = globalThis.document;
    globalThis.document = {
        get cookie() {
            return cookie;
        },
        querySelector() {
            throw new Error('Stale meta must not be read');
        },
    };
    try {
        await chatRequest('/chat/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
        assert.equal(requests[0].options.headers['X-XSRF-TOKEN'], 'current=token');
        assert.equal(requests[0].options.headers['X-CSRF-TOKEN'], undefined);
        assert.equal(requests[0].options.credentials, 'same-origin');
        cookie = 'XSRF-TOKEN=renewed';
        await chatRequest('/chat/groups/1', { method: 'DELETE' });
        assert.equal(requests[1].options.headers['X-XSRF-TOKEN'], 'renewed');
    } finally {
        globalThis.document = original;
    }
});

test('redirects do not become successful sends or JSON parsing errors', async (context) => {
    const original = globalThis.document;
    globalThis.document = { cookie: 'XSRF-TOKEN=test' };
    context.mock.method(globalThis, 'fetch', async () => ({ ok: true, redirected: true }));
    try {
        await assert.rejects(chatRequest('/chat/send'), /conta de leitor/);
    } finally {
        globalThis.document = original;
    }
});

test('expired sessions and lost membership display specific errors', async (context) => {
    const original = globalThis.document;
    globalThis.document = { cookie: 'XSRF-TOKEN=test' };
    let status = 419;
    context.mock.method(globalThis, 'fetch', async () => ({ ok: false, status }));
    try {
        await assert.rejects(chatRequest('/chat/send'), /sessão expirou/);
        status = 403;
        await assert.rejects(chatRequest('/chat/send'), /não tem mais acesso/);
    } finally {
        globalThis.document = original;
    }
});
