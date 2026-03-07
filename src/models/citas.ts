export interface SolicitarCita {
   
    tipoCita : String
    motivoSolicitud : string
 
}

export interface Citas{
    citFechaProgramada : string 
    citEstadoCita : string
    psicologo : { 
    psiNombre : string
   }
}