import useFocusTrap from '@/hooks/use-focus-trap';

export default function Modal({ isOpen, onClose, label, labelledBy, className, overlayClassName, closeOnBackdrop = false, children }) {
    const ref = useFocusTrap(isOpen, onClose);
    if (!isOpen) return null;

    return (
        <div
            className={overlayClassName}
            onClick={(event) => {
                if (closeOnBackdrop && event.target === event.currentTarget) onClose?.();
            }}
        >
            <div ref={ref} role="dialog" aria-modal="true" aria-label={label} aria-labelledby={labelledBy} tabIndex={-1} className={className}>
                {children}
            </div>
        </div>
    );
}
