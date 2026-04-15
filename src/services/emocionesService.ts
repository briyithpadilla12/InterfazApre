import api from "./apiCliente";

export interface EmocionAPI {
  emoCodigo: number;
  emoNombre: string;
  emoEmoji: string | null;
  emoEscala: number;
  emoColorFondo: string | null;
  emoDescripcion: string | null;
  emoImage: string | null;
  emoEstadoRegistro: string;
  categoria: string;
}

function normalizar(raw: Record<string, unknown>): EmocionAPI {
  return {
    emoCodigo: Number(raw.emoCodigo ?? raw.EmoCodigo ?? 0),
    emoNombre: String(raw.emoNombre ?? raw.EmoNombre ?? "").trim(),
    emoEmoji: (raw.emoEmoji ?? raw.EmoEmoji ?? null) as string | null,
    emoEscala: Number(raw.emoEscala ?? raw.EmoEscala ?? 5),
    emoColorFondo: (raw.emoColorFondo ?? raw.EmoColorFondo ?? null) as string | null,
    emoDescripcion: (raw.emoDescripcion ?? raw.EmoDescripcion ?? null) as string | null,
    emoImage: (raw.emoImage ?? raw.EmoImage ?? null) as string | null,
    emoEstadoRegistro: String(raw.emoEstadoRegistro ?? raw.EmoEstadoRegistro ?? "activo"),
    categoria: String(raw.categoria ?? raw.Categoria ?? ""),
  };
}

const EmocionesService = {
  async obtenerTodas(): Promise<EmocionAPI[]> {
    const { data } = await api.get<unknown>("/Emociones");
    if (!Array.isArray(data)) return [];
    return data
      .map((item) => normalizar(item as Record<string, unknown>))
      .filter((e) => (e.emoEstadoRegistro || "").toLowerCase() === "activo");
  },
};

export default EmocionesService;
