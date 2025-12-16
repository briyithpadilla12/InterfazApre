import { useEffect, useState } from "react";
import { Notificacion } from "../models/notificaciones";
import notificacionService from "../services/notificacionesServices";

export function useNotificacionesViewModel() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarNotificaciones();
  }, []);

  const cargarNotificaciones = async () => {
    const data = await notificacionService.obtenerNotificaciones();
    setNotificaciones(data);
    setCargando(false);
  };

  const eliminarNotificacion = (id: number) => {
    setNotificaciones((prev) =>
      prev.filter((noti) => noti.id !== id)
    );
  };

  const eliminarTodas = () => {
    setNotificaciones([]);
  };

  return {
    notificaciones,
    cargando,
    eliminarNotificacion,
    eliminarTodas,
  };
}
