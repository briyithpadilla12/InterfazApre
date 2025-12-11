import { useState, useEffect } from "react";
import CitasService from "../../src/services/citasService";
import { Citas } from "../../src/models/citas";

export function useCitasViewModel() {
  const [citas, setCitas] = useState<Citas | null>(null);
  const [colorEstado, setColorEstado] = useState("green");
  const [cargando, setCargando] = useState(true);

  const cargarCita = async () => {
    try {
      setCargando(true);

      const data = await CitasService.ObtenerCitas();
      setCitas(data);
     

      switch (data.estado) {
        case "Pendiente":
          setColorEstado("#facc15");
          break;
        case "cancelada":
          setColorEstado("#ff0000ff");
          break;
        case "completada":
          setColorEstado("#3ccd25ff");
          break;
        case "programada":
          setColorEstado("#0004daff");
          break;
      }

      setCargando(false);
    } catch (error) {
      console.log("error al cargar las citas");
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCita();
  }, []);

  return { citas, colorEstado, cargando };
}
