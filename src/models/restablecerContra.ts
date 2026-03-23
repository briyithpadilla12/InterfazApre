/** Payload para restablecer contraseña según API: POST /api/Aprendiz/reset-password */
export interface RestablecerContra {
  aprendizId: number;
  codigo: string;
  nuevaPassword: string;
}
