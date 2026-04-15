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
          data?: unknown;
        };
        message?: string;
        code?: string;
      };
      let msg = "No se pudo enviar la cita";
      const status = axErr.response?.status;
      const data = axErr.response?.data;

      if (data != null) {
        if (typeof data === "string" && data.length > 0 && data.length < 500) {
          msg = data;
        } else if (typeof data === "object") {
          const d = data as Record<string, unknown>;
          const extracted =
            (d.mensaje as string) ??
            (d.message as string) ??
            (d.detail as string) ??
            (d.title as string);
          if (extracted) {
            msg = extracted;
          } else if (d.errors && typeof d.errors === "object") {
            const errList = Object.entries(d.errors as Record<string, string[]>)
              .flatMap(([k, v]) => (Array.isArray(v) ? v : [v]).map((e) => `${k}: ${e}`));
            if (errList.length > 0) msg = errList.join("; ");
          }
        }
      } else if (axErr.code === "ECONNABORTED") {
        msg = "Tiempo de espera agotado. Revisa tu conexión a internet.";
      } else if (axErr.code === "ERR_NETWORK" || !axErr.response) {
        msg = "No se pudo conectar al servidor. Verifica tu conexión.";
      }

      if (status === 404) {
        msg = msg === "No se pudo enviar la cita"
          ? "Tu perfil no tiene una ficha o psicólogo asignado. Contacta a tu instructor."
          : msg;
      }

      console.warn(`[SolicitarCita] HTTP ${status ?? "?"} → ${msg}`);
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