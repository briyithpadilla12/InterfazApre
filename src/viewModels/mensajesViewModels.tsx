import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "../context/authContext";
import { obtenerUserIdDesdeToken } from "../utils/jwt";
import { getConversations, getSocketConfig } from "../services/chatService";
import type { Conversation } from "../models/chat";
import { io, type Socket } from "socket.io-client";

/** Formato de conversación para la lista */
export interface ChatListItem {
  appointmentId: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  ficha?: string;
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 60000) return "Ahora";
  if (diff < 86400000)
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });
}

function conversationToItem(c: Conversation): ChatListItem {
  const created = new Date(c.createdAt);
  return {
    appointmentId: c.appointmentId,
    name: "Psicólogo" + (c.area ? ` - ${c.area}` : ""),
    lastMessage: "Nueva conversación",
    timestamp: formatTimestamp(created),
    ficha: c.ficha,
  };
}

export default function useMensajesViewModels() {
  const { token } = useAuth();
  const [conversaciones, setConversaciones] = useState<ChatListItem[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const cargarConversaciones = useCallback(async () => {
    if (!token) return;
    setCargando(true);
    setError(null);
    try {
      const convos = await getConversations();
      setConversaciones(convos.map(conversationToItem));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar mensajes");
      setConversaciones([]);
    } finally {
      setCargando(false);
    }
  }, [token]);

  // Cargar conversaciones al montar y cuando hay token
  useEffect(() => {
    if (token) {
      cargarConversaciones();
    } else {
      setConversaciones([]);
      setCargando(false);
    }
  }, [token, cargarConversaciones]);

  // Socket para notificación de nueva conversación
  useEffect(() => {
    if (!token) return;
    let socket: Socket | null = null;
    const setup = async () => {
      const config = getSocketConfig();
      const t = await config.getToken();
      if (!t) return;
      socket = io(config.url, {
        auth: { token: t },
        transports: ["polling", "websocket"],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
        timeout: 20000,
      });
      socket.on("notification", (payload: { type?: string }) => {
        if (payload.type === "NEW_CHAT" || payload.type === "NEW_MESSAGE") {
          cargarConversaciones();
        }
      });
      socketRef.current = socket;
    };
    setup();
    return () => {
      if (socket) {
        socket.disconnect();
      }
      socketRef.current = null;
    };
  }, [token, cargarConversaciones]);

  return {
    conversaciones,
    cargando,
    error,
    recargar: cargarConversaciones,
  };
}
