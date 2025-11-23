// src/pages/MessagesPage.tsx
import { useConversations } from "../features/messages/messagesApi";

export function MessagesPage() {
  const { data: conversations, loading, error } = useConversations();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">Chargement des messages...</p>
      </div>
    );
  }

  if (error || !conversations) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-red-500">
          Impossible de charger les conversations.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Messages</h1>

        {conversations.length === 0 ? (
          <p className="text-gray-500 text-sm">
            Aucune conversation pour le moment.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {conversations.map((conv) => (
              <li key={conv.userId} className="py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-900">
                      {conv.username}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {conv.lastMessage}
                    </p>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    {conv.unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-semibold">
                        {conv.unreadCount} non lu(s)
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
