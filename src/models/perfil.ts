export interface PerfilAprendiz {
  codigo: number;
  fechaCreacion: string;
  tipoDocumento: string;
  numeroDocumento: string;
  fechaNacimiento: string;

  nombreCompleto: string;
  direccion: string;

  telefono: string;
  correoInstitucional: string;
  correoPersonal: string;

  acudienteNombre: string;
  acudienteApellido: string;
  acudienteTelefono: string;

  estadoAprendiz: string;

  eps: string;
  patologia: string;
  tipoPoblacion: string;
  estadoRegistro: string;
}
