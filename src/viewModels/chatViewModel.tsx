import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "../context/authContext";
import { obtenerUserIdDesdeToken } from "../utils/jwt";
import {
  getChatHistory,
  getSocketConfig,
  toDisplayMessage,
} from "../services/chatService";
import type { DisplayMessage } from "../models/chat";
import { io, type Socket } from "socket.io-client";

export default function useChatViewModel(appointmentId: number | null) {
  const { token } = useAuth();
  const apprenticeId = obtenerUserIdDesdeToken(token)
    ? parseInt(obtenerUserIdDesdeToken(token)!, 10)
    : null;

  const [mensajes, setMensajes] = useState<DisplayMessage[]>([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const cargarHistorial = useCallback(async () => {
    if (!appointmentId || !apprenticeId) return;
    setCargando(true);
    setError(null);
    try {
      const msgs = await getChatHistory(appointmentId);
      setMensajes(msgs.map((m) => toDisplayMessage(m, apprenticeId)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar mensajes");
      setMensajes([]);
    } finally {
      setCargando(false);
    }
  }, [appointmentId, apprenticeId]);

  // Cargar historial al montar
  useEffect(() => {
    if (appointmentId && apprenticeId) {
      cargarHistorial();
    } else {
      setMensajes([]);
      setCargando(false);
    }
  }, [appointmentId, apprenticeId, cargarHistorial]);

  // Socket: conectar, join_chat, receive_message
  useEffect(() => {
    if (!token || !appointmentId || !apprenticeId) return;
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
      socket.on("connect", () => {
        socket?.emit("join_chat", { appointmentId });
      });
      socket.on("receive_message", (msg: { appointmentId?: number; senderId?: number; content?: string; _id?: string; timestamp?: string }) => {
        const aptId = msg.appointmentId ?? appointmentId;
        if (aptId !== appointmentId) return;
        // No añadir nuestros propios mensajes: ya los mostramos con el optimistic update
        if (msg.senderId === apprenticeId) return;
        const m = toDisplayMessage(
          {
            _id: msg._id ?? "",
            conversationId: "",
            senderId: msg.senderId ?? 0,
            content: msg.content ?? "",
            type: "text",
            timestamp: msg.timestamp ?? new Date().toISOString(),
          },
          apprenticeId
        );
        setMensajes((prev) => {
          if (prev.some((p) => p.id === m.id)) return prev;
          return [...prev, m];
        });
      });
      socketRef.current = socket;
      socket.emit("join_chat", { appointmentId });
    };
    setup();
    return () => {
      if (socket) socket.disconnect();
      socketRef.current = null;
    };
  }, [token, appointmentId, apprenticeId]);

  const enviarMensaje = useCallback(
    async (texto: string) => {
      const text = texto.trim();
      if (!text || !appointmentId || !socketRef.current || !apprenticeId)
        return;
      setEnviando(true);
      socketRef.current.emit("send_message", {
        appointmentId,
        content: text,
        type: "text",
      });
      // Optimistic update
      const optimista: DisplayMessage = {
        id: `temp-${Date.now()}`,
        text,
        sender: "me",
        timestamp: "Ahora",
      };
      setMensajes((prev) => [...prev, optimista]);
      setEnviando(false);
    },
    [appointmentId, apprenticeId]
  );

  return {
    mensajes,
    cargando,
    enviando,
    error,
    recargar: cargarHistorial,
    enviarMensaje,
  };
}
