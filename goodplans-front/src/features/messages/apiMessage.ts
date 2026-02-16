// src/features/messages/apiMessage.ts
import { useQuery } from "@tanstack/react-query";
import type {
  Conversation,
  ConversationHistory,
  Message,
  UnreadCountResponse,
  MarkAsReadResponse,
} from "./types";
import { authFetchJson } from "../listings/apiListings";

/* -------------------- FONCTIONS HTTP PURES -------------------- */

export async function fetchConversations(): Promise<Conversation[]> {
  return authFetchJson<Conversation[]>("/messages/conversations");
}

export async function searchConversations(q: string): Promise<Conversation[]> {
  return authFetchJson<Conversation[]>(
    `/messages/conversations/search?q=${encodeURIComponent(q)}`
  );
}

export async function fetchUnreadCount(): Promise<UnreadCountResponse> {
  return authFetchJson<UnreadCountResponse>("/messages/unread-count");
}

export async function fetchConversationHistory(
  listingId: string,
  otherUserId?: string
): Promise<ConversationHistory> {
  let url = `/messages/${listingId}`;

  if (otherUserId) {
    url += `?userId=${encodeURIComponent(otherUserId)}`;
  }

  return authFetchJson<ConversationHistory>(url);
}

export interface SendMessagePayload {
  listingId: string;
  receiverId: string;
  text: string;
}

export async function sendMessage(payload: SendMessagePayload): Promise<Message> {
  return authFetchJson<Message>("/messages", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function markConversationAsRead(
  listingId: string,
  otherUserId: string
): Promise<MarkAsReadResponse> {
  return authFetchJson<MarkAsReadResponse>(
    `/messages/${listingId}/${otherUserId}/mark-read`,
    {
      method: "PATCH",
    }
  );
}

export async function deleteMessage(
  messageId: number
): Promise<{ message: string }> {
  return authFetchJson<{ message: string }>(`/messages/${messageId}`, {
    method: "DELETE",
  });
}

/* ------------------------- HOOKS REACT ------------------------- */

// skip = true -> désactive l’appel (ex: user non connecté)
export function useUnreadCount(skip: boolean = false) {
  return useQuery({
    queryKey: ["messages", "unread-count"],
    queryFn: fetchUnreadCount,
    enabled: !skip,
    staleTime: 30_000, // 30 secondes
  });
}
