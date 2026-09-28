import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import PrivacySettings from './PrivacySettings';

export default function PreferencesPanel({ isOpen, onClose }) {
    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <DialogContent className="max-h-[90dvh] overflow-y-auto border-slate-200 bg-white text-slate-800">
                <DialogTitle>Preferências</DialogTitle>
                <DialogDescription>Controle a privacidade das avaliações e os avisos da conta.</DialogDescription>
                <PrivacySettings />
            </DialogContent>
        </Dialog>
    );
}
