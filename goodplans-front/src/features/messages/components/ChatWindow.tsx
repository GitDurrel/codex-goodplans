// src/features/messages/components/ChatWindow.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, MessageCircle, Send } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import type { Message } from "../types";
import {
  useConversationHistory,
  useSendMessage,
  useMarkAsRead,
} from "../hooks/useMessages";
import { useLanguage } from "../../../lib/language/LanguageContext";

export function ChatWindow() {

  const { t } = useLanguage();

  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const listingId = searchParams.get("listingId");
  const otherUserIdFromParams = searchParams.get("userId");

  const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (!containerRef.current || !messagesEndRef.current) return;
    const container = containerRef.current;
    const last = messagesEndRef.current;
    const offset = last.offsetTop - container.offsetTop;
    container.scrollTo({ top: offset, behavior: "smooth" });
  };

  // DEBUG temporaire si tu veux vérifier :
  // console.log("listingId", listingId, "otherUserIdFromParams", otherUserIdFromParams);

  const {
    data: conversation,
    isLoading,
    error,
  } = useConversationHistory(
    listingId,
    otherUserIdFromParams || undefined,   // ⬅️ ça part dans fetchConversationHistory → ?userId=...
    !!listingId && !!user
  );

  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkAsRead();

  // 🔹 mémorise la dernière conversation pour laquelle on a déjà appelé markAsRead
  const lastMarkedRef = useRef<{ listingId: string; otherUserId: string } | null>(null);

  // marquer comme lu quand la convo se charge
  useEffect(() => {
    if (!listingId || !conversation?.otherUser || !user) return;

    const hasUnreadForMe = conversation.messages?.some(
      (m) => m.receiver_id === user.id && !m.read
    );

    if (!hasUnreadForMe) return;

    const currentKey = {
      listingId,
      otherUserId: conversation.otherUser.id,
    };

    const last = lastMarkedRef.current;

    if (
      last &&
      last.listingId === currentKey.listingId &&
      last.otherUserId === currentKey.otherUserId
    ) {
      return;
    }

    lastMarkedRef.current = currentKey;

    markAsReadMutation.mutate({
      listingId,
      userId: conversation.otherUser.id,
    });
  }, [listingId, conversation?.otherUser?.id, conversation?.messages?.length, user?.id, markAsReadMutation]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages?.length]);

  if (!listingId) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-slate-50 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 shadow-md">
          <MessageCircle className="h-8 w-8 text-blue-500" />
        </div>
        <p className="text-sm text-slate-500">
          {t("chatWindow.notExistingListing.title")} <br />
          <span className="font-semibold">{t("chatWindow.notExistingListing.contactSeller")}</span> {t("chatWindow.notExistingListing.from")}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-4 border-t-4 border-blue-500" />
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <p className="text-sm font-medium text-red-600">
          {error ? t("chatWindow.error.errorMsg") : t("chatWindow.error.notFound")}
        </p>
        <button
          onClick={() => navigate(0)}
          className="mt-4 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {t("chatWindow.error.errorMsg")}
        </button>
      </div>
    );
  }

  const otherUserName = conversation.otherUser?.username ?? "Utilisateur";
  const messages: Message[] = conversation.messages ?? [];

  const handleSend = async () => {
    if (!newMessage.trim() || !listingId || !user || !conversation.otherUser) return;

    const receiverId = conversation.otherUser.id;
    if (!receiverId || receiverId === user.id) return;

    const text = newMessage.trim();
    setNewMessage("");

    try {
      await sendMessageMutation.mutateAsync({
        listingId,
        receiverId,
        text,
      });
    } catch (e) {
      console.error(e);
      setNewMessage(text); // on remet le texte si erreur
    }
  };

  return (
    <div className="flex h-full flex-col bg-gray-50 rounded-2xl">
      {/* Header */}
      <div className="z-10 flex items-center border-b border-gray-200 bg-white p-4 shadow-sm rounded-t-2xl">
        <button
          onClick={() => navigate(-1)}
          className="mr-2 rounded-full p-2 hover:bg-gray-100 lg:hidden"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h2 className="text-sm font-semibold text-gray-900 sm:text-base">
            {otherUserName}
          </h2>
          {conversation.listing && (
            <p className="truncate text-xs text-gray-500 sm:text-sm">
              {conversation.listing.title}
            </p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        className="scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent flex-1 overflow-y-auto px-4 pb-4 pt-4"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-4 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 shadow-md">
              <MessageCircle className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-sm text-gray-500">
              {t("chatWindow.title")}
            </p>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {messages.map((m) => {
              const isUserMessage =
                (user && m.sender_id === user.id) ||
                (user && m.sender_email === user.email);

              return (
                <div
                  key={m.id}
                  className={`flex ${isUserMessage ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs rounded-2xl px-4 py-3 text-sm shadow-sm lg:max-w-md ${isUserMessage
                      ? "rounded-br-none bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                      : "rounded-bl-none border border-blue-100 bg-white"
                      }`}
                  >
                    <p className="break-words leading-relaxed">{m.text}</p>
                    <p
                      className={`mt-1 text-right text-[11px] ${isUserMessage ? "text-blue-100" : "text-gray-400"
                        }`}
                    >
                      {new Date(m.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="sticky bottom-0 border-t border-gray-200 bg-white p-4 rounded-b-2xl">
        <div className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="shadow-inner flex-1 rounded-full border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Écrire un message..."
            disabled={sendMessageMutation.isPending || !conversation.otherUser}
          />
          <button
            onClick={handleSend}
            disabled={
              !newMessage.trim() ||
              sendMessageMutation.isPending ||
              !conversation.otherUser
            }
            className={`ml-3 rounded-full p-3 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${!newMessage.trim() ||
              sendMessageMutation.isPending ||
              !conversation.otherUser
              ? "bg-gray-300"
              : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              }`}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
