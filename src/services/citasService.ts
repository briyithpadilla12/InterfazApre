import { Citas } from "../models/citas"

class CitasServices {
    async ObtenerCitas(): Promise<Citas> {
        return {
            fecha: "13 de noviembre",
            psicologo: "camilo",
            estado: "Pendiente"
        }
    }
}
export default new CitasServices()