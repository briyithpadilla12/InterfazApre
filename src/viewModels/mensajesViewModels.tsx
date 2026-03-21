import { useEffect, useState } from "react";
import { Mensajes } from "../models/mensajes";
import mensajesServices from "../services/mensajesServices";


export default function useMensajesViewModels() {
   
    const [mensajes, setMensajes ] = useState<Mensajes | null>()
    const [cargar, setCargar] = useState(true)
    

    const CargarMensaje = async () =>{
       try{
        setCargar(true)
         const data = await mensajesServices.ObtenerMensajes()
        setMensajes(data)
        setCargar(false)
       }
       catch{
        setCargar(false)
       }
    }


    useEffect(() =>{
       CargarMensaje()

    }, [])

  return{
    mensajes, cargar
  }
}