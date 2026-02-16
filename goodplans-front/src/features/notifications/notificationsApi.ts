import { apiRequest } from "../../lib/apiRequest";

export type Notification = {
  id: number;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type UnreadCountResponse = {
  unreadCount: number;
};

// Notifications "personnelles" /me/...
export function apiGetMyNotifications() {
  return apiRequest<Notification[]>("GET", "/me/notifications");
}

export function apiGetMyUnreadCount() {
  return apiRequest<UnreadCountResponse>(
    "GET",
    "/me/notifications/unread-count"
  );
}

export function apiMarkMyNotificationRead(id: number) {
  return apiRequest<Notification>(
    "PATCH",
    `/me/notifications/${id}/read`
  );
}

export function apiMarkMyNotificationsReadAll() {
  return apiRequest<{ updated: number }>(
    "PATCH",
    "/me/notifications/read-all"
  );
}
