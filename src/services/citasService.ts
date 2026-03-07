import { Citas, SolicitarCita } from "../models/citas"
import api from "./apiCliente"

const CitasServices = {
    async CrearCita(cita : SolicitarCita): Promise<void> {
        console.log("cita que se solicita" , cita)
         try {
            await api.post("Citas/solicitar-cita" , cita)
           
            
         } catch (error : any) {
            console.log("error al enviar la cita", error.response || error.message)
         }
    },

  async ObtenerCita(): Promise<Citas[]> {

  try {

    const response = await api.get(
      "Citas/buscar?DocumentoAprendiz=383"
    );

    return response.data;

  } catch (error: any) {

    console.log("error al obtener la cita", error.message);
    throw error;

  }

}

}
export default  CitasServices