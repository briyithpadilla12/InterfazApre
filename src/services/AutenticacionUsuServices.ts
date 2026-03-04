import { InicioSesion } from "../models/inicioSesion";
import api from "./apiCliente";

interface Token {
  token: string;
}

const AutenticacionUsuServices = {
  async InicioSesion(credenciales: InicioSesion): Promise<string> {
    const payload = {
      correoPersonal: credenciales.correoPersonal.trim(),
      password: credenciales.password,
    };
    const respuesta = await api.post<Token>(
      "/Autenticacion/ValidarAprendiz",
      payload
    );
    const token = respuesta.data?.token;
    if (!token) {
      throw new Error("El servidor no devolvió un token");
    }
    return token;
  },

  async RecuperarContraCorreo(correo: string): Promise<string> {
    const respuesta = await api.post("/Aprendiz/recuperar-password", {
      correo,
    });
    return respuesta.data;
  },
};

export default AutenticacionUsuServices;