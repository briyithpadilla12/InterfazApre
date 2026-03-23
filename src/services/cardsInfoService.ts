import api from "./apiCliente";
import { CardInfo } from "../models/cardInfo";

/**
 * Obtiene las cards activas desde la API.
 * El psicólogo puede activar/desactivar cards; solo se muestran las activas.
 */
export async function obtenerCardsActivas(): Promise<CardInfo[]> {
  try {
    const res = await api.get<CardInfo[]>("/CardsInfo/activos");
    const data = res.data;
    return Array.isArray(data) ? data : [];
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status;
    if (status === 404) {
      return [];
    }
    throw err;
  }
}

/**
 * Obtiene una card por ID (opcional, para refrescar detalle).
 */
export async function obtenerCardPorId(id: number): Promise<CardInfo | null> {
  try {
    const res = await api.get<CardInfo>(`/CardsInfo/${id}`);
    return res.data ?? null;
  } catch {
    return null;
  }
}
