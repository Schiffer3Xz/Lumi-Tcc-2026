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
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogTitle>Preferências</DialogTitle>
                <DialogDescription>Controle a privacidade das avaliações e os avisos da conta.</DialogDescription>
                <PrivacySettings />
            </DialogContent>
        </Dialog>
    );
}
