/** Payload para restablecer contraseña según API: POST /api/Aprendiz/reset-password */
export interface RestablecerContra {
  token: string;
  nuevaPassword: string;
}
