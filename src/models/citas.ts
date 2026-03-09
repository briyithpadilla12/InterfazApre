export interface SolicitarCita {
  tipoCita: string;
  motivoSolicitud: string;
}

export interface Citas {
  citId?: number;
  citFechaProgramada: string;
  citEstadoCita: string;
  psicologo?: {
    psiNombre: string;
  };
}