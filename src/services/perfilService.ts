import { PerfilAprendiz } from "@/src/models/perfil";

import api from "./apiCliente";


const perfilAprendizServicio = {

  async obtenerPerfil(): Promise<PerfilAprendiz> {
    try {console.log("HEADERS:", api.defaults.headers.common); 
      // Se asume que el token ya está en el header Authorization gracias a setAuthToken
      const { data } = await api.get("/Aprendiz"); // si tu backend tiene /Aprendiz/me, mejor usar eso
      const aprendiz = data; // aquí data ya debería ser solo el aprendiz logueado

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
    } catch (error: any) {
      console.log("Error al obtener los datos:", error.response?.data || error.message);
      throw error;
    }
  },

  async actualizarPerfil(
    idEditar: number,
    perfil: PerfilAprendiz
  ): Promise<void> {
    console.log("ID QUE ENVÍAS:", idEditar);
    console.log("PERFIL QUE EDITAS:", perfil);

    const payload = {
      AprTipoDocumento: perfil.tipoDocumento,
      AprNroDocumento: perfil.numeroDocumento,
      AprTelefono: perfil.telefono,
      AprCorreoPersonal: perfil.correoPersonal,
      AprDireccion: perfil.direccion,
      AprEps: perfil.eps,
      AprPatologia: perfil.patologia,
      AprTipoPoblacion: perfil.tipoPoblacion,

      AprAcudNombre: perfil.acudienteNombre,
      AprAcudApellido: perfil.acudienteApellido,
      AprTelefonoAcudiente: perfil.acudienteTelefono,
    };

    try {
      await api.put(`/Aprendiz/editar/${idEditar}`, payload);
    } catch (error: any) {
      console.log("ERROR BACKEND:", error.response?.data);
      throw error;
    }
  }

};

export default perfilAprendizServicio;
