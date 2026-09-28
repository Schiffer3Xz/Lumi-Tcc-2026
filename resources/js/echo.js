import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Realtime is optional: missing configuration must not prevent React from mounting.
if (typeof window !== 'undefined' && import.meta.env.VITE_REVERB_APP_KEY) {
    window.Pusher = Pusher;
    window.Echo = new Echo({
        broadcaster: 'reverb',

        key: import.meta.env.VITE_REVERB_APP_KEY,

        wsHost: import.meta.env.VITE_REVERB_HOST,

        wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,

        wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,

        forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',

        enabledTransports: ['ws', 'wss'],
    });
}
