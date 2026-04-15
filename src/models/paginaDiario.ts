export interface PaginaDiario {
  pagTitulo: string;
  pagContenido: string;
  pagDiarioFk: number;
  pagEmocionFk: number;
}

/** Payload para PUT /PaginaDiario/editar/:id (pagImagenUrl opcional cuando se defina). */
export interface PaginaDiarioEditarPayload {
  pagTitulo: string;
  pagContenido: string;
  pagDiarioFk: number;
  pagEmocionFk: number;
  pagImagenUrl?: string;
}

/** Resumen de una página para la lista del diario (fecha, título, emociones). */
export interface PaginaDiarioResumen {
  id: number;
  titulo: string;
  fecha: string;
  emociones: string[];
}

/**
 * Datos de una página para la lista y detalle (GET /api/PaginaDiario).
 * Incluye contenido y FKs para ver/editar sin GET por id.
 */
export interface PaginaDiarioListaItem extends PaginaDiarioResumen {
  pagContenido: string;
  pagDiarioFk: number;
  pagEmocionFk: number;
  pagImagenUrl?: string;
}

