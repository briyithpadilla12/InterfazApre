export interface PaginaDiario {
  pagTitulo: string;
  pagContenido: string;
  pagDiarioFk: number;
  pagEmocionFk: number;
}

/** Resumen de una página para la lista del diario (fecha, título, emociones). */
export interface PaginaDiarioResumen {
  id: number;
  titulo: string;
  fecha: string;
  emociones: string[];
}

