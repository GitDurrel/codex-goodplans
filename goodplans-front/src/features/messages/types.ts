// src/features/messages/types.ts
export interface ConversationUser {
  id: string;
  username: string;
  avatarUrl: string | null;
  online: boolean;
}

export interface ListingPreview {
  id: string;
  title: string;
  images: string[];
  price?: number | string | null;
  city?: string;
  region?: string;
}

export interface LastMessage {
  id: number;
  text: string;
  date: string; // ISO string
  isRead: boolean;
  isReceived: boolean;
  isSent: boolean;
}

export interface Conversation {
  user: ConversationUser;
  listing: {
    id: string;
    title: string;
    images: string[];
  };
  lastMessage: LastMessage;
  unreadCount: number;
}

export interface Message {
  id: number;
  sender_id: string | null;
  receiver_id: string | null;
  sender_email: string;
  text: string;
  read: boolean | null;
  created_at: string; // ISO string
  listing_id?: string | null;
  listings?: ListingPreview | null;
}

export interface ConversationHistory {
  messages: Message[];
  otherUser: ConversationUser | null;
  listing: ListingPreview;
}

export interface UnreadCountResponse {
  unreadCount: number;
}

export interface MarkAsReadResponse {
  messagesRead: number;
}
