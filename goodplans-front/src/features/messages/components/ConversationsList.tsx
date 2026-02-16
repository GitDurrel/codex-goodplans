// src/features/messages/components/ConversationsList.tsx
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  MessageCircle,
  Search,
  User,
  Check,
  CheckCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { useAuth } from "../../auth/AuthContext";
import type { Conversation } from "../types";

// hooks React Query + clés de cache
import {
  useConversations,
  useSearchConversations,
} from "../hooks/useMessages";

// WebSocket messages
import { useMessagesWebSocket } from "../hooks/useMessagesWebSocket";
import { useLanguage } from "../../../lib/language/LanguageContext";

export function ConversationsList() {

  const { t } = useLanguage();

  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams] = useSearchParams();

  // on monte le WebSocket (écoute des events, invalidation de cache, etc.)
  useMessagesWebSocket();

  const activeListingId = searchParams.get("listingId");
  const usingSearch = searchTerm.trim().length > 0;

  // ====== DATA VIA REACT QUERY ======

  // Liste "normale" des conversations
  const {
    data: baseConversations,
    isLoading: isLoadingBase,
    isError: isErrorBase,
    refetch: refetchBase,
  } = useConversations();

  // Résultats de recherche
  const {
    data: searchConversationsData,
    isLoading: isLoadingSearch,
    isError: isErrorSearch,
    refetch: refetchSearch,
  } = useSearchConversations(searchTerm, usingSearch);

  const conversations: Conversation[] = usingSearch
    ? searchConversationsData || []
    : baseConversations || [];

  const isLoading = usingSearch ? isLoadingSearch : isLoadingBase;
  const hasError = usingSearch ? isErrorSearch : isErrorBase;

  const hasConversations = conversations.length > 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
    return date.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isActiveConversation = (conv: Conversation) =>
    !conv.lastMessage.isRead || conv.unreadCount > 0;

  // Si pas connecté → message friendly
  if (!user) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-white/60 rounded-2xl">
        <MessageCircle className="mb-3 h-10 w-10 text-blue-300" />
        <p className="text-sm text-slate-500 text-center px-4">
          {t("conversationList.notConnected.title")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-white to-blue-50 rounded-2xl overflow-hidden shadow-sm">
      {/* Header + search */}
      <div className="sticky top-0 z-10 border-b border-blue-100 bg-white p-4 shadow-sm">
        <h2 className="mb-3 flex items-center text-lg font-semibold text-blue-800">
          <MessageCircle className="mr-2 h-5 w-5" />
          {t("conversationList.title")}
        </h2>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-blue-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-full border border-blue-100 bg-blue-50/50 py-2.5 pl-10 pr-4 text-sm placeholder-blue-300 transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500"
            placeholder={t("conversationList.placeholderSearch")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : hasError ? (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            <AlertCircle className="mb-3 h-12 w-12 text-red-500" />
            <p className="font-medium text-red-600">
              {t("conversationList.errorLoading")}
            </p>
            <button
              onClick={() => {
                if (usingSearch) refetchSearch();
                else refetchBase();
              }}
              className="mt-4 rounded-full bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
            >
              {t("conversationList.refreshButton")}
            </button>
          </div>
        ) : !hasConversations ? (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            <MessageCircle className="mb-3 h-12 w-12 text-blue-300" />
            <p className="font-medium text-blue-400">
              {searchTerm
                ? t("conversationList.notConversations")
                : t("conversationList.nullConversations")}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 rounded-full bg-blue-100 px-4 py-2 text-sm text-blue-600 hover:bg-blue-200"
              >
                {t("conversationList.resetButton")}
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-blue-50">
            {conversations.map((conversation) => {
              const active = activeListingId === conversation.listing.id;
              const highlight = isActiveConversation(conversation) || active;

              return (
                <Link
                  key={`${conversation.user.id}-${conversation.listing.id}`}
                  // ⬇⬇⬇ ICI : userId au lieu de otherUserId
                  to={`/messages?listingId=${conversation.listing.id}&userId=${conversation.user.id}`}
                  className={`block transition-all duration-200 ${highlight ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-blue-50"
                    }`}
                >
                  <div className="flex items-center p-4 sm:p-5">
                    {/* Avatar */}
                    <div className="relative mr-3 flex-shrink-0">
                      {conversation.user.avatarUrl ? (
                        <img
                          src={conversation.user.avatarUrl}
                          alt={conversation.user.username}
                          className="h-12 w-12 sm:h-14 sm:w-14 rounded-full border-2 border-white object-cover shadow-sm"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-white shadow-sm sm:h-14 sm:w-14">
                          <User className="h-6 w-6 text-blue-500" />
                        </div>
                      )}
                      {conversation.user.online && (
                        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white sm:h-4 sm:w-4" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`truncate text-sm sm:text-base font-medium ${highlight ? "text-blue-900" : "text-gray-800"
                            }`}
                        >
                          {conversation.user.username}
                        </h4>
                        <span
                          className={`ml-2 whitespace-nowrap text-xs ${highlight ? "text-blue-700" : "text-gray-500"
                            }`}
                        >
                          {formatDate(conversation.lastMessage.date)}
                        </span>
                      </div>

                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {conversation.listing.title}
                      </p>

                      <div className="mt-1 flex items-center justify-between sm:mt-2">
                        <div className="flex max-w-[80%] items-center">
                          {conversation.lastMessage.isSent && (
                            <span className="mr-1 flex-shrink-0">
                              {conversation.lastMessage.isRead ? (
                                <CheckCheck className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                              ) : (
                                <Check className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                              )}
                            </span>
                          )}
                          <p
                            className={`truncate text-xs sm:text-sm ${highlight
                              ? "font-semibold text-blue-900"
                              : "text-gray-500"
                              }`}
                          >
                            {conversation.lastMessage.text || t("conversationList.newMessageButton")}
                          </p>
                        </div>

                        {conversation.unreadCount > 0 && (
                          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white shadow-sm sm:h-6 sm:w-6">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
