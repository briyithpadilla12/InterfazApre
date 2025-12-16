import { Notificacion } from "../models/notificaciones";

class NotificacionService {
  async obtenerNotificaciones(): Promise<Notificacion[]> {
    return [
      {
        id: 1,
        titulo: "Nueva cita",
        mensaje: "Tienes una cita programada mañana",
        fecha: "2025-12-14",
      },
      {
        id: 2,
        titulo: "Mensaje recibido",
        mensaje: "Tu psicólogo te ha enviado un mensaje",
        fecha: "2025-12-13",
      },
    ];
  }
}

export default new NotificacionService();
