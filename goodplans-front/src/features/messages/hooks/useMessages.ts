// src/features/messages/hooks/useMessages.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchConversations,
  searchConversations,
  fetchUnreadCount,
  fetchConversationHistory,
  sendMessage,
  markConversationAsRead,
} from "../apiMessage";
import type {
  Conversation,
  ConversationHistory,
  Message,
  UnreadCountResponse,
  MarkAsReadResponse,
} from "../types";

/* ------------- KEYS (mêmes noms que le mobile) ------------- */

export const MESSAGE_KEYS = {
  all: ["messages"] as const,
  conversations: () => [...MESSAGE_KEYS.all, "conversations"] as const,
  conversationsSearch: (query: string) =>
    [...MESSAGE_KEYS.conversations(), "search", query] as const,
  unreadCount: () => [...MESSAGE_KEYS.all, "unread-count"] as const,
  conversation: (listingId: string, otherUserId?: string) =>
    [...MESSAGE_KEYS.all, "conversation", listingId, ...(otherUserId ? [otherUserId] : [])] as const,
};

const DEFAULT_STALE_TIME = 30_000;
const DEFAULT_CACHE_TIME = 5 * 60_000;
const CONVERSATION_STALE_TIME = 10_000;

/* ---------------- LISTE DES CONVERSATIONS ---------------- */

export function useConversations() {
  return useQuery<Conversation[]>({
    queryKey: MESSAGE_KEYS.conversations(),
    queryFn: fetchConversations,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_CACHE_TIME,
    placeholderData: (old) => old,
  });
}

export function useSearchConversations(query: string, enabled = true) {
  return useQuery<Conversation[]>({
    queryKey: MESSAGE_KEYS.conversationsSearch(query),
    queryFn: () => searchConversations(query),
    enabled: enabled && query.trim().length > 0,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_CACHE_TIME,
    placeholderData: (old) => old,
  });
}

/* ---------------- COMPTEUR UNREAD ---------------- */

export function useUnreadCountQuery(enabled = true) {
  return useQuery<UnreadCountResponse>({
    queryKey: MESSAGE_KEYS.unreadCount(),
    queryFn: fetchUnreadCount,
    enabled,
    staleTime: 20_000,
    gcTime: DEFAULT_CACHE_TIME,
  });
}

/* ---------------- HISTORIQUE CONVERSATION ---------------- */

export function useConversationHistory(
  listingId: string | null,
  otherUserId?: string,
  enabled = true,
) {
  return useQuery<ConversationHistory>({
    queryKey: listingId
      ? MESSAGE_KEYS.conversation(listingId, otherUserId)
      : MESSAGE_KEYS.conversation("none"),
    queryFn: () => {
      if (!listingId) throw new Error("listingId manquant");
      return fetchConversationHistory(listingId, otherUserId);
    },
    enabled: enabled && !!listingId,
    staleTime: CONVERSATION_STALE_TIME,
    gcTime: 10 * 60_000,
    placeholderData: (old) => old,
  });
}

/* ---------------- ENVOI MESSAGE ---------------- */

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation<Message, Error, { listingId: string; receiverId: string; text: string }>({
    mutationFn: (payload) => sendMessage(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: MESSAGE_KEYS.conversation(variables.listingId),
      });
      queryClient.invalidateQueries({
        queryKey: MESSAGE_KEYS.conversations(),
      });
      queryClient.invalidateQueries({
        queryKey: MESSAGE_KEYS.unreadCount(),
      });
    },
  });
}

/* ---------------- MARQUER COMME LU ---------------- */

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation<
    MarkAsReadResponse,
    Error,
    { listingId: string; userId: string }
  >({
    mutationFn: ({ listingId, userId }) =>
      markConversationAsRead(listingId, userId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: MESSAGE_KEYS.conversation(variables.listingId),
      });
      queryClient.invalidateQueries({
        queryKey: MESSAGE_KEYS.conversations(),
      });
      queryClient.invalidateQueries({
        queryKey: MESSAGE_KEYS.unreadCount(),
      });
    },
  });
}
