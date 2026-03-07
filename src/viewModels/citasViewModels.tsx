import { useState, useEffect } from "react";
import CitasService from "../../src/services/citasService";
import { Citas, SolicitarCita } from "../../src/models/citas";
import CitasServices from "../../src/services/citasService";

export function useCitasViewModel() {

  const [citas, setCitas] = useState<Citas[]>([]);
  
  const [cargando, setCargando] = useState(true);
  const [cargandoEnvioCita, setCargandoEnvioCita] = useState(false);
  const [errorEnvioCita, setErrorEnvioCita] = useState<string | null>(null);
  const [exitoEnvioCita, setExitoEnvioCita] = useState<string | null>(null);


  const obtenerColorEstado = (estado: string) => {

    switch (estado.toLowerCase()) {

      case "pendiente":
        return "#f58600";

      case "cancelada":
        return "#ff0000";

      case "completada":
        return "#3ccd25";

      case "programada":
        return "#0004da";

      default:
        return "#808080";
    }

  };

  const cargarCita = async () => {

  try {

    setCargando(true);

    const data = await CitasService.ObtenerCita();

    setCitas(data);


  } catch (error) {

    console.log("error al cargar las citas", error);

  } finally {

    setCargando(false);

  }

};
  useEffect(() => {
    cargarCita();
  }, []);



  const SolicitarCita = async(cita : SolicitarCita) : Promise<boolean> =>{
    setCargandoEnvioCita(true);
    setErrorEnvioCita(null);
    setExitoEnvioCita(null);

    try{
       await CitasServices.CrearCita(cita)
       setExitoEnvioCita("se envio correctamente la cita")
       return true 
    } catch (err: any) {
      const mensaje =
        err.response?.data || "No se pudo enviar la cita ";
      setErrorEnvioCita(mensaje);
      return false;
    } finally {
      setCargandoEnvioCita(false);
    }

  }


  return { cargarCita,
    citas,
     obtenerColorEstado,
     cargando ,
     SolicitarCita,
     errorEnvioCita,
     exitoEnvioCita,
     cargandoEnvioCita};

}