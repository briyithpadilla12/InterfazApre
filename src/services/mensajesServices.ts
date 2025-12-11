import { Mensajes } from "../models/mensajes";

class MensajesServices {
   async ObtenerMensajes() : Promise<Mensajes>{
       return{
         fecha: "12-Dic-2025",
         id: 2, 
         nombre: "Psicologa maria ",
         mensaje : "Hola Jean, espero te encuentres bien. La cita queda pendiente para el otro viernes porque me surgieron algunos imprevistos"
       }
   }
}

export default new MensajesServices()