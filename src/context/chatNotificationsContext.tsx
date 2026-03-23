import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useAuth } from "./authContext";
import { getSocketConfig } from "../services/chatService";
import { io, type Socket } from "socket.io-client";

export interface ChatNotification {
  id: string;
  type: "NEW_CHAT" | "NEW_MESSAGE";
  title: string;
  message: string;
  appointmentId?: number;
  createdAt: Date;
}

interface ChatNotificationsContextType {
  notifications: ChatNotification[];
  clearAll: () => void;
  removeNotification: (id: string) => void;
}

const ChatNotificationsContext = createContext<ChatNotificationsContextType | null>(null);

function makeId() {
  return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function ChatNotificationsProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<ChatNotification[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const clearAll = useCallback(() => setNotifications([]), []);
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  useEffect(() => {
    if (!token) {
      setNotifications([]);
      return;
    }

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

      socket.on("notification", (data: {
        type?: string;
        title?: string;
        message?: string;
        appointmentId?: number;
      }) => {
        const type = data.type === "NEW_CHAT" ? "NEW_CHAT" : "NEW_MESSAGE";
        setNotifications((prev) => [
          {
            id: makeId(),
            type,
            title: data.title ?? "Nuevo mensaje",
            message: data.message ?? "",
            appointmentId: data.appointmentId,
            createdAt: new Date(),
          },
          ...prev.slice(0, 49),
        ]);
      });

      socketRef.current = socket;
    };

    setup();

    return () => {
      if (socket) socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  return (
    <ChatNotificationsContext.Provider
      value={{ notifications, clearAll, removeNotification }}
    >
      {children}
    </ChatNotificationsContext.Provider>
  );
}

export function useChatNotifications() {
  const ctx = useContext(ChatNotificationsContext);
  if (!ctx) {
    return {
      notifications: [] as ChatNotification[],
      clearAll: () => {},
      removeNotification: () => {},
    };
  }
  return ctx;
}
