import { Citas, SolicitarCita } from "../models/citas";
import api from "./apiCliente";

function mapearCita(raw: Record<string, unknown>): Citas {
  const c = raw ?? {};
  return {
    citId: (c.citId ?? c.citaId ?? c.id) as number | undefined,
    citFechaProgramada: String(c.citFechaProgramada ?? c.fechaProgramada ?? c.citFecha ?? ""),
    citEstadoCita: String(c.citEstadoCita ?? c.estadoCita ?? c.estado ?? ""),
    psicologo: c.psicologo
      ? { psiNombre: String((c.psicologo as any).psiNombre ?? (c.psicologo as any).nombre ?? "") }
      : undefined,
  };
}

const CitasServices = {
  /** POST /api/Citas/solicitar-cita - usa JWT, body: tipoCita, motivoSolicitud */
  async CrearCita(cita: SolicitarCita): Promise<unknown> {
    console.log("[DEBUG CitasService] CrearCita - payload:", JSON.stringify(cita));
    try {
      const response = await api.post("Citas/solicitar-cita", cita);
      console.log("[DEBUG CitasService] CrearCita OK - status:", response.status);
      return response.data;
    } catch (err: unknown) {
      const axErr = err as { response?: { status?: number; data?: unknown }; message?: string };
      console.log("[DEBUG CitasService] CrearCita ERROR - status:", axErr.response?.status);
      console.log("[DEBUG CitasService] CrearCita ERROR - response.data:", JSON.stringify(axErr.response?.data, null, 2));
      console.log("[DEBUG CitasService] CrearCita ERROR - message:", axErr.message);
      throw err;
    }
  },

  /** GET /api/Citas/mis-citas - usa nameid del JWT */
  async ObtenerMisCitas(): Promise<Citas[]> {
    const { data } = await api.get("Citas/mis-citas");
    const arr = Array.isArray(data) ? data : [];
    return arr.map((item: Record<string, unknown>) => mapearCita(item));
  },

  /** PUT /api/Citas/cancelar-mi-solicitud/{id} - solo citas en estado pendiente */
  async CancelarSolicitud(id: number): Promise<void> {
    await api.put(`Citas/cancelar-mi-solicitud/${id}`);
  },
};

export default CitasServices;