import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import LoginRequiredDialog from './LoginRequiredDialog';

export default function GuestAccessPrompt() {
    const { auth, loginRequiredPaths = [] } = usePage().props;
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (auth?.user) return;
        const patterns = loginRequiredPaths.map(
            (path) =>
                new RegExp(
                    `^/${path
                        .split('/')
                        .map((part) => (part.startsWith('{') ? '[^/]+' : part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
                        .join('/')}/?$`,
                ),
        );
        const protectedUrl = (href) => {
            const url = new URL(href, window.location.href);
            return url.origin === window.location.origin && patterns.some((pattern) => pattern.test(url.pathname));
        };
        const removeBefore = router.on('before', (event) => {
            if (protectedUrl(event.detail.visit.url)) {
                event.preventDefault();
                setOpen(true);
            }
        });
        const onClick = (event) => {
            if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
            const link = event.target.closest?.('a[href]');
            if (!link || link.target === '_blank' || link.hasAttribute('download') || !protectedUrl(link.href)) return;
            event.preventDefault();
            event.stopPropagation();
            setOpen(true);
        };
        document.addEventListener('click', onClick, true);
        return () => {
            removeBefore();
            document.removeEventListener('click', onClick, true);
        };
    }, [auth?.user, loginRequiredPaths]);

    return <LoginRequiredDialog open={open && !auth?.user} onClose={() => setOpen(false)} />;
}
