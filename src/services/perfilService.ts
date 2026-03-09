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
  console.log("[DEBUG PerfilService] mapearAprendiz - a.nombres:", a.nombres, "| a.contacto:", !!a.contacto, "| a.ubicacion:", !!a.ubicacion);

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
    console.log("[DEBUG PerfilService] obtenerPerfil llamado con userId:", userId);
    const { data } = await api.get(`/Aprendiz/${userId}`);
    const IDUsuario = userId
    console.log("este es el id del usuario ",IDUsuario)
    console.log("[DEBUG PerfilService] Respuesta cruda - es Array?", Array.isArray(data), "| tipo:", typeof data);
    console.log("[DEBUG PerfilService] data (primeros 500 chars):", JSON.stringify(data)?.substring(0, 500));

    // La API puede devolver: 1) Array [{...}], 2) Objeto directo {...}, 3) Envuelto { data: {...} }
    let raw: any;
    if (Array.isArray(data) && data.length > 0) {
      raw = data[0];
      console.log("[DEBUG PerfilService] Usando data[0] del array");
    } else {
      raw = data?.data ?? data?.aprendiz ?? data;
      console.log("[DEBUG PerfilService] Usando data directo o envuelto");
    }
    console.log("[DEBUG PerfilService] raw para mapear:", raw ? "objeto presente" : "null/undefined");

    const mapeado = mapearAprendiz(raw ?? {});
    console.log("[DEBUG PerfilService] Mapeado nombreCompleto:", mapeado.nombreCompleto, "| correo:", mapeado.correoPersonal);
    return mapeado;
  },
  
  async actualizarPerfil(
   id : string,
    perfil: ActualizarPerfilAprendiz
  ): Promise<void> {
    console.log("datos actualizados que se envian" )
  
   try {
        await api.put(`/Aprendiz/editar/${id}`, perfil);
   } catch (error : any) {
       console.log("no se pudo actaulizar el perfil", error.message)
   }
  }

};

export default perfilAprendizServicio;
