// src/components/notifications/notificationsFab.tsx
import { useState, useEffect, useCallback } from "react";
import { Bell, X } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  apiGetMyNotifications,
  apiMarkMyNotificationRead,
  apiMarkMyNotificationsReadAll,
  type Notification,
} from "../../features/notifications/notificationsApi";
import { useNotificationsWebSocket } from "../../features/notifications/hooks/useNotificationsWebSocket";

const NotificationsFab = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiGetMyNotifications();
      setNotifications(data || []);
      setUnreadCount(data?.filter((n) => !n.is_read).length || 0);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      toast.error("Erreur lors du chargement des notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  // Chargement initial
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // WebSocket : nouvelle notification en live
  useNotificationsWebSocket((notif) => {
    setNotifications((prev) => [notif, ...prev]);
    setUnreadCount((prev) => prev + 1);
  });

  const markAsRead = async (notificationId: number) => {
    try {
      await apiMarkMyNotificationRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
      toast.error("Erreur lors de la mise à jour de la notification");
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiMarkMyNotificationsReadAll();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      toast.error("Erreur lors de la mise à jour des notifications");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="relative p-3 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50"
      >
        <Bell className="h-5 w-5 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-bold leading-none text-white bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-14 right-0 w-80 bg-white rounded-lg shadow-xl border border-gray-200">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="font-semibold text-gray-900 text-sm">
              Notifications
            </h3>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Tout marquer comme lu
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-sm text-gray-500">
                Chargement des notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">
                Aucune notification
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 border-b text-sm ${
                    !n.is_read ? "bg-blue-50" : "bg-white"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="text-gray-900">{n.message}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(n.created_at).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {!n.is_read && (
                      <button
                        onClick={() => markAsRead(n.id)}
                        className="text-[11px] text-blue-600 hover:text-blue-700"
                      >
                        Marquer lu
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsFab;
