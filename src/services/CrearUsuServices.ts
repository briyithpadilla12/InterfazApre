import axios from "axios";
import { registro } from "../models/registro";
import api from "./apiCliente";
import { Codigo } from "../models/confirmarcodigo";
import { InicioSesion } from "../models/inicioSesion";



const CreaciónUsuarioServices = {
  async CrearPerfil(datos: registro): Promise<void> {
    console.log("DATOS QUE SE ENVÍAN:", datos);
    try {
      await api.post("/Aprendiz/registro-inicial", datos)

    }
    catch (error: any) {
      console.log("ERROR COMPLETO:", error.response?.data);
      throw error;
    }
  },

  async ConfirmarCod(codigo: Codigo): Promise<string> {
    try {
      const response = await api.post("/Aprendiz/verificar-codigo", codigo);
      return response.data;
    }
    catch (error: any) {
      console.log("ERROR COMPLETO:", error.response?.data);
      throw error;
    }
  },

  async ReenviarCod(AprNroDocumento : string) : Promise<void>{
    console.log("DATOS QUE SE ENVÍAN:", AprNroDocumento);
    try{
        await api.post("/Aprendiz/reenviar-codigo", {AprNroDocumento})

    } catch (error: any) {
      console.log("ERROR COMPLETO:", error.response?.data);
      throw error;
    }
  },

 




}

export default CreaciónUsuarioServices