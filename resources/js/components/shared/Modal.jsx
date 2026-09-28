import { cn } from '@/lib/utils';
import * as Dialog from '@radix-ui/react-dialog';
import { useRef } from 'react';

export default function Modal({ isOpen, onClose, label, labelledBy, className, overlayClassName, closeOnBackdrop = false, children }) {
    const triggerRef = useRef(null);

    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) onClose?.();
            }}
        >
            <Dialog.Portal>
                <Dialog.Overlay
                    className={cn('fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto overscroll-contain p-4', overlayClassName)}
                >
                    <Dialog.Content
                        {...(labelledBy && { 'aria-labelledby': labelledBy })}
                        aria-describedby={undefined}
                        aria-label={label}
                        className={cn('max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain', className)}
                        onOpenAutoFocus={() => {
                            triggerRef.current = document.activeElement;
                        }}
                        onCloseAutoFocus={(event) => {
                            event.preventDefault();
                            if (triggerRef.current?.isConnected) triggerRef.current.focus();
                        }}
                        onPointerDownOutside={(event) => {
                            if (!closeOnBackdrop) event.preventDefault();
                        }}
                    >
                        <Dialog.Title className="sr-only">{label ?? 'Janela de diálogo'}</Dialog.Title>
                        {children}
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
