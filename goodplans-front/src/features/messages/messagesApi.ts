// src/features/messages/messagesApi.ts
import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";

/* ----------------------------- Types backend ----------------------------- */

export interface ConversationSummary {
  userId: string;          // id de l'autre utilisateur
  username: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

/* ----------------------------- Hooks de lecture -------------------------- */

/**
 * GET /api/messages/conversations
 */
export function useConversations() {
  return useFetch<ConversationSummary[]>("/messages/conversations");
}

/**
 * GET /api/messages/unread-count
 */
export function useUnreadCount(skip = false) {
  return useFetch<{ unreadCount?: number; unread_count?: number; count?: number }>(
    "/messages/unread-count",
    { skip }
  );
}

/**
 * GET /api/messages/{userId}
 */
export function useConversation(userId: string | null) {
  return useFetch<Message[]>(
    userId ? `/messages/${userId}` : "/messages", // path quelconque si skip
    { skip: !userId }
  );
}

/* ----------------------------- Hooks de mutation ------------------------- */

type SendMessagePayload = {
  receiverId: string;
  content: string;
};

/**
 * POST /api/messages
 */
export function useSendMessage() {
  const [payload, setPayload] = useState<SendMessagePayload | null>(null);

  const fetchResult = useFetch<Message>("/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload
      ? JSON.stringify({
          receiver_id: payload.receiverId,
          content: payload.content,
        })
      : undefined,
    skip: !payload,
  });

  function sendMessage(data: SendMessagePayload) {
    setPayload(data);
  }

  return {
    ...fetchResult,
    sendMessage,
  };
}

/**
 * PATCH /api/messages/{userId}/mark-read
 */
export function useMarkConversationRead() {
  const [userId, setUserId] = useState<string | null>(null);

  const fetchResult = useFetch<void>(
    userId ? `/messages/${userId}/mark-read` : "/messages",
    {
      method: "PATCH",
      skip: !userId,
    }
  );

  function markConversationRead(targetUserId: string) {
    setUserId(targetUserId);
  }

  return {
    ...fetchResult,
    markConversationRead,
  };
}

/**
 * DELETE /api/messages/{messageId}
 */
export function useDeleteMessage() {
  const [messageId, setMessageId] = useState<string | null>(null);

  const fetchResult = useFetch<void>(
    messageId ? `/messages/${messageId}` : "/messages",
    {
      method: "DELETE",
      skip: !messageId,
    }
  );

  function deleteMessage(id: string) {
    setMessageId(id);
  }

  return {
    ...fetchResult,
    deleteMessage,
  };
}
