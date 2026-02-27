import { InicioSesion } from "../models/inicioSesion";
import api from "./apiCliente";

interface Token {
  token: string;
}

const AutenticacionUsuServices = {
  async InicioSesion(credenciales: InicioSesion): Promise<string> {

    console.log("Credenciales que se envían:", credenciales);

    try {

      const respuesta = await api.post<Token>(
        "/Autenticacion/ValidarAprendiz",
        credenciales
      );  

      return respuesta.data.token;

    } catch (error: any) {

      console.log("ERROR COMPLETO:", error.response?.data);
      throw error;

    }
  },


 async RecuperarContraCorreo(Correo: string): Promise<string> {
  console.log("el correo que se envia es", Correo);

  try {
    const respuesta = await api.post("/Aprendiz/recuperar-password", {
      correo: Correo
    });

    return respuesta.data;

  } catch (error: any) {
    console.log("ERROR COMPLETO:", error.response?.data || error.message);
    throw error;
  }
}
}

export default AutenticacionUsuServices;