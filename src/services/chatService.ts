/**
 * Servicio para el chat con el psicólogo (API Chat-HM).
 * Usa REST para listar conversaciones y cargar historial.
 * Socket.io se maneja en el viewModel para tiempo real.
 */
import * as SecureStore from "expo-secure-store";
import {
  type Conversation,
  type ChatMessage,
  type DisplayMessage,
} from "../models/chat";
import { tryRefreshToken } from "./apiCliente";

// URL de la API del chat (sin barra final)
const CHAT_API_URL = (
  process.env.EXPO_PUBLIC_CHAT_API_URL || "https://chat-healthy-mind.onrender.com"
).replace(/\/+$/, "");

const TOKEN_KEY = "token";

async function getToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

async function chatFetch(
  path: string,
  options: RequestInit = {},
  retried = false
): Promise<Response> {
  const token = await getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${CHAT_API_URL}${path}`, { ...options, headers });

  if (res.status === 401 && !retried) {
    const ok = await tryRefreshToken();
    if (ok) return chatFetch(path, options, true);
  }

  return res;
}

export async function getConversations(): Promise<Conversation[]> {
  const res = await chatFetch("/api/chat/conversations");
  if (!res.ok) {
    throw new Error("Error al obtener conversaciones");
  }
  return res.json();
}

export async function getChatHistory(
  appointmentId: number
): Promise<ChatMessage[]> {
  const res = await chatFetch(`/api/chat/history/${appointmentId}`);
  if (!res.ok) {
    if (res.status === 404) return [];
    throw new Error("Error al obtener historial");
  }
  return res.json();
}

export function getSocketConfig() {
  return {
    url: CHAT_API_URL,
    getToken,
  };
}

/** Convierte ChatMessage a DisplayMessage según si el sender es el aprendiz */
export function toDisplayMessage(
  m: ChatMessage,
  apprenticeId: number
): DisplayMessage {
  const isMe = m.senderId === apprenticeId;
  const date = new Date(m.timestamp);
  return {
    id: m._id,
    text: m.content,
    sender: isMe ? "me" : "psychologist",
    timestamp: formatTimestamp(date),
  };
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
    hour: "2-digit",
    minute: "2-digit",
  });
}
