import axios from "axios";
import { PerfilAprendiz } from "@/src/models/perfil";

const api = axios.create({
  baseURL: "http://healthymind10.runasp.net/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const perfilAprendizServicio = {
  // 🔹 GET PERFIL
  async obtenerPerfil(): Promise<PerfilAprendiz> {
    const { data } = await api.get("/Aprendiz");

    const aprendiz = data[0]; // temporal, sin auth

    return {
      codigo: aprendiz.codigo,
      fechaCreacion: aprendiz.fechaCreacion,
      tipoDocumento: aprendiz.tipoDocumento,
      numeroDocumento: aprendiz.nroDocumento,
      fechaNacimiento: aprendiz.fechaNacimiento,

      nombreCompleto: `${aprendiz.nombres.primerNombre} ${aprendiz.nombres.segundoNombre} ${aprendiz.apellidos.primerApellido} ${aprendiz.apellidos.segundoApellido}`,
      direccion: aprendiz.ubicacion.direccion,

      telefono: aprendiz.contacto.telefono,
      correoInstitucional: aprendiz.contacto.correoInstitucional,
      correoPersonal: aprendiz.contacto.correoPersonal,

      acudienteNombre: aprendiz.contacto.acudiente.acudienteNombre,
      acudienteApellido: aprendiz.contacto.acudiente.acudienteApellido,
      acudienteTelefono: aprendiz.contacto.acudiente.acudienteTelefono,

      estadoAprendiz: aprendiz.estadoAprendiz.estAprNombre,

      eps: aprendiz.eps,
      patologia: aprendiz.patologia,
      tipoPoblacion: aprendiz.tipoPoblacion,
      estadoRegistro: aprendiz.estadoRegistro,
    };
  },

  // 🔹 PUT PERFIL (CORRECTO)
  async actualizarPerfil(
    idEditar: number,
    perfil: PerfilAprendiz
  ): Promise<void> {
    const payload = {
      telefono: perfil.telefono,
      correoPersonal: perfil.correoPersonal,
      direccion: perfil.direccion,
      eps: perfil.eps,
      patologia: perfil.patologia,
      tipoPoblacion: perfil.tipoPoblacion,

      acudiente: {
        nombre: perfil.acudienteNombre,
        apellido: perfil.acudienteApellido,
        telefono: perfil.acudienteTelefono,
      },
    };

    await api.put(`/Aprendiz/editar/${idEditar}`, payload);
  },
};

export default perfilAprendizServicio;
