// src/features/notifications/useNotificationsWebSocket.ts
import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import { useAuth } from "../../auth/AuthContext";

const SOCKET_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") ?? "http://localhost:3000";

type NotificationPayload = {
  id: number;
  message: string;
  is_read: boolean;
  created_at: string;
};

export function useNotificationsWebSocket(
  onNewNotification: (notif: NotificationPayload) => void,
) {
  const { accessToken } = useAuth() as any;
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    const socket = io(`${SOCKET_URL}/chat`, {
      auth: { token: accessToken },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connection:success", () => {
      // console.log("WS notifications connecté");
    });

    socket.on("notification:new", (notif: NotificationPayload) => {
      onNewNotification(notif);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [accessToken, onNewNotification]);

  return socketRef.current;
}
