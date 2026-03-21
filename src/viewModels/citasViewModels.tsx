import { useState, useEffect, useCallback } from "react";
import CitasService from "../../src/services/citasService";
import { Citas, SolicitarCita } from "../../src/models/citas";

export function useCitasViewModel() {
  const [citas, setCitas] = useState<Citas[]>([]);
  const [cargando, setCargando] = useState(true);
  const [cargandoEnvioCita, setCargandoEnvioCita] = useState(false);
  const [cargandoCancelar, setCargandoCancelar] = useState<number | null>(null);
  const [errorEnvioCita, setErrorEnvioCita] = useState<string | null>(null);
  const [exitoEnvioCita, setExitoEnvioCita] = useState<string | null>(null);

  const obtenerColorEstado = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case "pendiente":
        return "#f58600";
      case "cancelada":
        return "#ff0000";
      case "completada":
        return "#3ccd25";
      case "programada":
      case "reprogramada":
        return "#0004da";
      default:
        return "#808080";
    }
  };

  const cargarCitas = useCallback(async () => {
    try {
      setCargando(true);
      const data = await CitasService.ObtenerMisCitas();
      setCitas(data);
    } catch (error) {
      void error;
      setCitas([]);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarCitas();
  }, [cargarCitas]);

  const SolicitarCita = async (cita: SolicitarCita): Promise<boolean> => {
    setCargandoEnvioCita(true);
    setErrorEnvioCita(null);
    setExitoEnvioCita(null);
    try {
      await CitasService.CrearCita(cita);
      setExitoEnvioCita("Solicitud enviada correctamente");
      await cargarCitas();
      return true;
    } catch (err: unknown) {
      const axErr = err as {
        response?: {
          status?: number;
          data?: {
            message?: string;
            title?: string;
            detail?: string;
            errors?: Record<string, string[]>;
          };
        };
        message?: string;
      };
      const data = axErr.response?.data;
      let msg = "No se pudo enviar la cita";
      if (data) {
        if (typeof data === "string") msg = data;
        else if (data.message) msg = data.message;
        else if (data.detail) msg = data.detail;
        else if (data.title) msg = data.title;
        else if (data.errors && typeof data.errors === "object") {
          const errList = Object.entries(data.errors).flatMap(([k, v]) =>
            (Array.isArray(v) ? v : [v]).map((e) => `${k}: ${e}`)
          );
          if (errList.length > 0) msg = errList.join("; ");
        }
      }
      setErrorEnvioCita(msg);
      return false;
    } finally {
      setCargandoEnvioCita(false);
    }
  };

  const CancelarSolicitud = async (id: number): Promise<boolean> => {
    try {
      setCargandoCancelar(id);
      await CitasService.CancelarSolicitud(id);
      await cargarCitas();
      return true;
    } catch (err) {
      void err;
      return false;
    } finally {
      setCargandoCancelar(null);
    }
  };

  return {
    cargarCitas,
    citas,
    obtenerColorEstado,
    cargando,
    SolicitarCita,
    CancelarSolicitud,
    cargandoCancelar,
    errorEnvioCita,
    exitoEnvioCita,
    cargandoEnvioCita,
  };
}