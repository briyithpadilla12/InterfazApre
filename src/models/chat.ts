/** Modelos para el chat con el psicólogo (API Chat-HM) */

export interface Conversation {
  _id: string;
  appointmentId: number;
  psychologistId: number;
  apprenticeId: number;
  area: string;
  apprenticeName?: string;
  psychologistName?: string;
  ficha?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ChatMessage {
  _id: string;
  conversationId: string;
  senderId: number;
  content: string;
  type: string;
  timestamp: string;
}

export interface DisplayMessage {
  id: string;
  text: string;
  sender: "me" | "psychologist";
  timestamp: string;
}
