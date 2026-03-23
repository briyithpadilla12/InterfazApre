import { InicioSesion } from "../models/inicioSesion";
import { RestablecerContra } from "../models/restablecerContra";
import api, { API_BASE_URL } from "./apiCliente";

interface LoginResponse {
  token?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface LoginResult {
  token: string;
  refreshToken: string;
}

const AutenticacionUsuServices = {
  async InicioSesion(credenciales: InicioSesion): Promise<LoginResult> {
    const payload = {
      correoPersonal: credenciales.correoPersonal.trim(),
      password: credenciales.password,
    };
    const respuesta = await api.post<LoginResponse>(
      "/Autenticacion/ValidarAprendiz",
      payload
    );
    const data = respuesta.data;
    const token = data?.accessToken ?? data?.token;
    const refreshToken = data?.refreshToken;
    if (!token) {
      throw new Error("El servidor no devolvió un token");
    }
    if (!refreshToken) {
      throw new Error("El servidor no devolvió refreshToken. Actualiza la API.");
    }
    return { token, refreshToken };
  },

  async RecuperarContraCorreo(correo: string): Promise<{ mensaje: string; aprendizId: number }> {
    const respuesta = await api.post<{ mensaje: string; aprendizId: number }>(
      "/Aprendiz/recuperar-password",
      { correo: correo.trim() }
    );
    return respuesta.data;
  },

  async RestablecerContra(datos: RestablecerContra): Promise<void> {
    await api.post("/Aprendiz/reset-password", {
      aprendizId: datos.aprendizId,
      codigo: datos.codigo.trim(),
      nuevaPassword: datos.nuevaPassword,
    });
  },

  async CambiarPassword(passwordActual: string, passwordNueva: string): Promise<void> {
    await api.put("/Aprendiz/cambiar-password", {
      passwordActual,
      passwordNueva,
    });
  },

  /**
   * Renueva accessToken y refreshToken usando el refreshToken actual.
   * Usa fetch para no pasar por el interceptor axios (evitar loops en 401).
   */
  async RefrescarToken(refreshToken: string): Promise<LoginResult> {
    const res = await fetch(`${API_BASE_URL}/Autenticacion/refrescar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(
        (err as { message?: string })?.message ?? "refresh_token_invalido_o_expirado"
      );
    }
    const data = (await res.json()) as LoginResponse;
    const token = data?.accessToken ?? data?.token;
    const nextRefresh = data?.refreshToken;
    if (!token || !nextRefresh) {
      throw new Error("La API no devolvió tokens válidos al refrescar");
    }
    return { token, refreshToken: nextRefresh };
  },
};

export default AutenticacionUsuServices;