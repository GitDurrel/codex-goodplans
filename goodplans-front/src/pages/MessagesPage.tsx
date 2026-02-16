// src/features/messages/MessagesPage.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import { ConversationsList } from "../features/messages/components/ConversationsList";
import { ChatWindow } from "../features/messages/components/ChatWindow";
import { useMessagesWebSocket } from "../features/messages/hooks/useMessagesWebSocket";

export function MessagesPage() {
  useMessagesWebSocket(); // juste pour ouvrir la connexion
  const location = useLocation();
  const navigate = useNavigate();

  const from = (location.state as any)?.from ?? "/";

  return (
    <div className="flex h-[calc(100vh-64px)] w-full flex-col bg-slate-50 px-2 py-4 lg:px-6">
      {/* Barre de retour */}
      <div className="mb-3 flex items-center">
        <button
          type="button"
          onClick={() => navigate(from)}
          className="inline-flex items-center rounded-full bg-white px-3 py-1 text-sm text-slate-700 shadow-sm hover:bg-slate-100"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
        </button>
      </div>

      {/* Contenu messagerie */}
      <div className="flex flex-1 min-h-0 gap-4">
        {/* Colonne gauche */}
        <div className="w-full lg:w-1/3">
          <ConversationsList />
        </div>

        {/* Colonne droite (desktop) */}
        <div className="hidden flex-1 min-h-0 rounded-2xl bg-white shadow-sm lg:block">
          <ChatWindow />
        </div>

        {/* Mobile : chat plein écran */}
        <div className="block w-full min-h-0 rounded-2xl bg-white shadow-sm lg:hidden">
          <ChatWindow />
        </div>
      </div>
    </div>
  );
}
