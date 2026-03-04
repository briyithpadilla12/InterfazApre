import { PerfilAprendiz } from "@/src/models/perfil";

/** Campos obligatorios para considerar el perfil completo (para usar la app) */
const CAMPOS_OBLIGATORIOS: (keyof PerfilAprendiz)[] = [
  "direccion",
  "telefono",
  "acudienteNombre",
  "acudienteTelefono",
  "nombreCompleto",
];

function tieneValor(valor: unknown): boolean {
  return valor != null && String(valor).trim() !== "" && String(valor) !== "—";
}

/** Retorna true si el perfil requiere completar datos obligatorios */
export function perfilRequiereCompletar(perfil: PerfilAprendiz | null): boolean {
  if (!perfil) return true;
  return CAMPOS_OBLIGATORIOS.some((campo) => !tieneValor(perfil[campo]));
}
