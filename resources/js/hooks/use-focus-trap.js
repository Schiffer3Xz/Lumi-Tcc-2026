import { useEffect, useRef } from 'react';

export default function useFocusTrap(isOpen, onClose) {
    const ref = useRef(null);
    const closeRef = useRef(onClose);

    useEffect(() => {
        closeRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (!isOpen || !ref.current) return;

        const previousFocus = document.activeElement;
        const container = ref.current;
        const getFocusable = () =>
            [...container.querySelectorAll('a[href], button, input, select, textarea, [tabindex]')].filter(
                (element) => !element.disabled && element.tabIndex >= 0 && element.getClientRects().length > 0,
            );

        (getFocusable()[0] ?? container).focus();

        function handleKeyDown(event) {
            if (event.key === 'Escape') {
                event.preventDefault();
                closeRef.current?.();
            }
            if (event.key !== 'Tab') return;

            const elements = getFocusable();
            const first = elements[0];
            const last = elements.at(-1);
            if (!first) {
                event.preventDefault();
                container.focus();
            } else if (event.shiftKey && (document.activeElement === first || !container.contains(document.activeElement))) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && (document.activeElement === last || !container.contains(document.activeElement))) {
                event.preventDefault();
                first.focus();
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            if (previousFocus?.isConnected) previousFocus.focus();
        };
    }, [isOpen]);

    return ref;
}
