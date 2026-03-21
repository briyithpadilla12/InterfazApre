import { PerfilAprendiz } from "@/src/models/perfil";
import api from "./apiCliente";
import { ActualizarPerfilAprendiz } from "../models/editardatos";

function safeStr(v: unknown): string {
  return v != null && typeof v === "string" ? v : "";
}

/**
 * Soporta dos estructuras del API:
 * 1) Plana (PascalCase): aprNombre, aprApellido, aprCorreoPersonal, aprNroDocumento, etc.
 * 2) Anidada: nombres.primerNombre, apellidos.primerApellido, contacto.telefono, etc.
 */
function mapearAprendiz(aprendiz: any): PerfilAprendiz {
  const a = aprendiz ?? {};

  // Estructura plana (apr*) - según Postman /api/Aprendiz
  const nombre1 = safeStr(a.aprNombre ?? a.primerNombre);
  const nombre2 = safeStr(a.aprSegundoNombre ?? a.segundoNombre);
  const apellido1 = safeStr(a.aprApellido ?? a.primerApellido);
  const apellido2 = safeStr(a.aprSegundoApellido ?? a.segundoApellido);

  // Estructura anidada (fallback)
  const nombres = a.nombres ?? {};
  const apellidos = a.apellidos ?? {};
  const contacto = a.contacto ?? {};
  const acudiente = contacto.acudiente ?? {};
  const ubicacion = a.ubicacion ?? {};
  const estadoApr = a.estadoAprendiz ?? {};

  const p1 = nombre1 || safeStr(nombres.primerNombre);
  const p2 = nombre2 || safeStr(nombres.segundoNombre);
  const a1 = apellido1 || safeStr(apellidos.primerApellido);
  const a2 = apellido2 || safeStr(apellidos.segundoApellido);
  const nombreCompleto = [p1, p2, a1, a2].filter(Boolean).join(" ") || "—";

  return {
    codigo: a.codigo ?? a.aprCodigo ?? a.id ?? 0,
    fechaCreacion: safeStr(a.fechaCreacion),
    tipoDocumento: safeStr(a.aprTipoDocumento ?? a.tipoDocumento),
    numeroDocumento: safeStr(a.aprNroDocumento ?? a.nroDocumento ?? a.numeroDocumento),
    fechaNacimiento: safeStr(a.aprFechaNac ?? a.fechaNacimiento ?? a.fechaNac),

    nombreCompleto,
    direccion: safeStr(a.aprDireccion ?? ubicacion.direccion ?? a.direccion),

    telefono: safeStr(a.aprTelefono ?? contacto.telefono ?? a.telefono),
    correoInstitucional: safeStr(a.aprCorreoInstitucional ?? contacto.correoInstitucional ?? a.correoInstitucional),
    correoPersonal: safeStr(a.aprCorreoPersonal ?? contacto.correoPersonal ?? a.correoPersonal),

    acudienteNombre: safeStr(a.aprAcudNombre ?? acudiente.acudienteNombre ?? acudiente.acudNombre),
    acudienteApellido: safeStr(a.aprAcudApellido ?? acudiente.acudienteApellido ?? acudiente.acudApellido),
    acudienteTelefono: safeStr(a.aprTelefonoAcudiente ?? acudiente.acudienteTelefono ?? acudiente.acudTelefono),

    estadoAprendiz: safeStr(estadoApr.estAprNombre ?? estadoApr.estadoAprendiz ?? a.estadoAprendiz),

    eps: safeStr(a.aprEps ?? a.eps),
    patologia: safeStr(a.aprPatologia ?? a.patologia),
    tipoPoblacion: safeStr(a.aprTipoPoblacion ?? a.tipoPoblacion),
    estadoRegistro: safeStr(a.estadoRegistro),
  };
}

const perfilAprendizServicio = {
  /** Obtiene el perfil del aprendiz por ID (según API: GET /api/Aprendiz/:id) */
  async obtenerPerfil(userId: string): Promise<PerfilAprendiz> {
    const { data } = await api.get(`/Aprendiz/${userId}`);

    // La API puede devolver: 1) Array [{...}], 2) Objeto directo {...}, 3) Envuelto { data: {...} }
    let raw: any;
    if (Array.isArray(data) && data.length > 0) {
      raw = data[0];
    } else {
      raw = data?.data ?? data?.aprendiz ?? data;
    }

    const mapeado = mapearAprendiz(raw ?? {});
    return mapeado;
  },
  
  async actualizarPerfil(
   id : string,
    perfil: ActualizarPerfilAprendiz
  ): Promise<void> {
   try {
        await api.put(`/Aprendiz/editar/${id}`, perfil);
   } catch (error : any) {
       void error;
   }
  }

};

export default perfilAprendizServicio;
