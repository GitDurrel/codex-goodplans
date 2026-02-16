import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io, type Socket } from "socket.io-client";
import { useAuth } from "../../auth/AuthContext";
import { MESSAGE_KEYS } from "./useMessages";

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace("/api", "") 
  ?? "http://localhost:3000";

export function useMessagesWebSocket() {
  const { accessToken } = useAuth() as any;
  const queryClient = useQueryClient();
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
      // console.log("WS connected");
    });

    // ↪ même logique que le mobile

    socket.on("conversation:updated", () => {
      // refetch liste des conversations
      queryClient.refetchQueries({
        queryKey: MESSAGE_KEYS.conversations(),
      });

      // refetch compteur unread
      queryClient.refetchQueries({
        queryKey: MESSAGE_KEYS.unreadCount(),
      });
    });

    socket.on("message:new", (message: any) => {
      // refetch conversation
      if (message.listing_id) {
        queryClient.refetchQueries({
          queryKey: MESSAGE_KEYS.conversation(message.listing_id),
        });
      }
      // refetch liste + unread
      queryClient.refetchQueries({ queryKey: MESSAGE_KEYS.conversations() });
      queryClient.refetchQueries({ queryKey: MESSAGE_KEYS.unreadCount() });
    });

    socket.on("messages:read", (data: any) => {
      if (data.listingId) {
        queryClient.refetchQueries({
          queryKey: MESSAGE_KEYS.conversation(data.listingId),
        });
      }
      queryClient.refetchQueries({ queryKey: MESSAGE_KEYS.conversations() });
      queryClient.refetchQueries({ queryKey: MESSAGE_KEYS.unreadCount() });
    });

    socket.on("message:deleted", () => {
      queryClient.refetchQueries({ queryKey: MESSAGE_KEYS.all });
    });

    socket.on("user:online", () => {
      queryClient.refetchQueries({ queryKey: MESSAGE_KEYS.conversations() });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [accessToken, queryClient]);

  return socketRef.current;
}
