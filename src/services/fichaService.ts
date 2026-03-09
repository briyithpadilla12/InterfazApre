import api from "./apiCliente";

/** Estructura completa de ficha según GET /api/Ficha */
export interface FichaCompleta {
  ficCodigo: number;
  ficJornada: string;
  ficFechaInicio: string;
  ficFechaFin: string;
  ficEstadoFormacion: string;
  ficEstadoRegistro: string;
  programaFormacion?: {
    progCodigo: number;
    progNombre: string;
    progModalidad: string;
    progFormaModalidad: string;
    nivelFormacion?: {
      nivForCodigo: number;
      nivForNombre: string;
      nivForDescripcion: string;
    };
    area?: {
      areaCodigo: number;
      areaNombre: string;
      areaPsicologo?: {
        psiNombre: string;
        psiApellido: string;
      };
    };
    centro?: {
      cenNombre: string;
      cenDireccion: string;
      regional?: { regNombre: string };
    };
  };
}

function toTitleCase(s: string): string {
  return s
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatearLabel(f: FichaCompleta): string {
  const codigo = f.ficCodigo ?? "";
  const programaRaw = f.programaFormacion?.progNombre ?? "";
  const programa = programaRaw ? toTitleCase(programaRaw) : "";
  const jornada = f.ficJornada
    ? f.ficJornada.charAt(0).toUpperCase() + f.ficJornada.slice(1)
    : "";
  return [codigo, programa, jornada].filter(Boolean).join(" - ");
}

/** GET /api/Ficha - fichas activas (array directo) */
export async function listarFichasActivas(): Promise<FichaCompleta[]> {
  const { data } = await api.get<FichaCompleta[]>("Ficha");
  return Array.isArray(data) ? data : [];
}

/** GET /api/Ficha/busqueda-dinamica?texto=X - búsqueda por código o texto */
export async function buscarFichas(texto: string): Promise<FichaCompleta[]> {
  if (!texto?.trim()) return listarFichasActivas();
  const { data } = await api.get<FichaCompleta[]>("Ficha/busqueda-dinamica", {
    params: { texto: texto.trim() },
  });
  return Array.isArray(data) ? data : [];
}

/** GET /api/AprendizFicha/buscar?AprendizDocumento=X - verifica si tiene ficha asignada */
export async function tieneFichaAsignada(documento: string): Promise<boolean> {
  if (!documento?.trim()) return false;
  try {
    const { data } = await api.get("AprendizFicha/buscar", {
      params: { AprendizDocumento: documento.trim() },
    });
    const arr = Array.isArray(data) ? data : data?.items ?? data?.data ?? [];
    return Array.isArray(arr) && arr.length > 0;
  } catch {
    return false;
  }
}

/** POST /api/AprendizFicha - vincula aprendiz (por documento) con ficha */
export async function crearAprendizFicha(
  documentoAprendiz: string,
  ficCodigo: number
): Promise<void> {
  await api.post("AprendizFicha", {
    aprFicAprendizFk: documentoAprendiz,
    aprFicFichaFk: ficCodigo,
  });
}

export { formatearLabel };
