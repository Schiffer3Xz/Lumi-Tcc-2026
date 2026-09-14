import useFocusTrap from '@/hooks/use-focus-trap';
import { useState } from 'react';
import PreferenceToggle from './PreferenceToggle';

export default function PreferencesPanel({ isOpen, onClose }) {
    const panelRef = useFocusTrap(isOpen, onClose);
    const [privacy, setPrivacy] = useState(false);
    const [social, setSocial] = useState(true);
    const [recommendations, setRecommendations] = useState(true);
    const [friendRequests, setFriendRequests] = useState(false);

    return (
        <aside
            ref={panelRef}
            tabIndex={-1}
            aria-label="Preferências"
            className={`fixed inset-y-0 right-0 z-50 h-screen w-80 space-y-6 overflow-y-auto border-l border-slate-200/80 bg-white p-6 transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : 'pointer-events-none translate-x-full'
            }`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">CONTA</span>
                    <h3 className="text-base font-bold text-slate-900">Preferências</h3>
                </div>
                <button onClick={onClose} aria-label="Fechar preferências" className="p-2 text-slate-400 hover:text-slate-600">
                    <i className="fa-solid fa-xmark text-lg" />
                </button>
            </div>

            {/* PRIVACIDADE */}
            <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-400 uppercase">
                    <i className="fa-solid fa-lock text-[10px]" />
                    <span>Privacidade</span>
                </div>

                <PreferenceToggle
                    title="Avaliações Públicas"
                    description="Suas avaliações são privadas."
                    enabled={privacy}
                    onChange={() => setPrivacy(!privacy)}
                />
                <PreferenceToggle
                    title="Ativar Recursos Sociais"
                    description="Chat, seguidores e feed de atividades."
                    enabled={social}
                    onChange={() => setSocial(!social)}
                />
            </div>

            {/* NOTIFICAÇÕES */}
            <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-400 uppercase">
                    <i className="fa-solid fa-bell text-[10px]" />
                    <span>Notificações</span>
                </div>

                <PreferenceToggle
                    title="Recomendações de Livros"
                    description="Receba sugestões personalizadas semanalmente."
                    enabled={recommendations}
                    onChange={() => setRecommendations(!recommendations)}
                />
                <PreferenceToggle
                    title="Solicitações de Amizade"
                    description="Alertas quando alguém quiser seguir você."
                    enabled={friendRequests}
                    onChange={() => setFriendRequests(!friendRequests)}
                />
            </div>

            {/* SESSÃO ATUAL */}
            <div className="space-y-1 border-t border-slate-100 pt-4">
                <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">Sessão Atual</span>
                <p className="text-xs text-slate-500">Última atividade: hoje</p>
                <p className="text-xs text-slate-400">Dispositivo: Navegador Web</p>
            </div>
        </aside>
    );
}
