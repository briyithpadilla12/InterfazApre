/**
 * Lista de emociones para el diario con emoji y color propio al seleccionar.
 * Cada emoción tiene un color de fondo distinto cuando está activa.
 */
export interface EmocionDiario {
  emoji: string;
  texto: string;
  colorFondo: string;
}

export const EMOCIONES_DIARIO: EmocionDiario[] = [
  { emoji: "😊", texto: "Feliz", colorFondo: "#fef3c7" },
  { emoji: "😌", texto: "Calmado", colorFondo: "#d1fae5" },
  { emoji: "🙏", texto: "Agradecido", colorFondo: "#e0e7ff" },
  { emoji: "💪", texto: "Motivado", colorFondo: "#fce7f3" },
  { emoji: "😢", texto: "Triste", colorFondo: "#dbeafe" },
  { emoji: "😰", texto: "Ansioso", colorFondo: "#fed7aa" },
  { emoji: "😡", texto: "Enojado", colorFondo: "#fecaca" },
  { emoji: "😣", texto: "Estresado", colorFondo: "#e5e7eb" },
  { emoji: "😴", texto: "Cansado", colorFondo: "#f3f4f6" },
  { emoji: "🤔", texto: "Confundido", colorFondo: "#e9d5ff" },
  { emoji: "😐", texto: "Aburrido", colorFondo: "#d6d3d1" },
  { emoji: "🕰", texto: "Nostálgico", colorFondo: "#bfdbfe" },
];

/** Mapeo texto emoción → ID numérico para la API (pagEmocionFk). Ajustar si tu API usa otros IDs. */
export const EMOCION_ID: Record<string, number> = EMOCIONES_DIARIO.reduce(
  (acc, em, i) => ({ ...acc, [em.texto]: i + 1 }),
  {} as Record<string, number>
);
