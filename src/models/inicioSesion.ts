/** Payload según API: /api/Autenticacion/ValidarAprendiz espera correoPersonal y password (camelCase) */
export interface InicioSesion {
  correoPersonal: string;
  password: string;
}