import api from "./apiCliente";

/** Payload para PUT /api/Aprendiz/completar-informacion según la API */
export interface CompletarInformacionPayload {
  aprFechaNac: string;
  aprNombre: string;
  aprSegundoNombre: string;
  aprApellido: string;
  aprSegundoApellido: string;
  aprCorreoInstitucional: string;
  aprDireccion: string;
  aprCiudadFk: number;
  aprTelefono: string;
  aprEps: string;
  aprPatologia: string;
  aprEstadoAprFk: number;
  aprTipoPoblacion: string;
  aprTelefonoAcudiente: string;
  aprAcudNombre: string;
  aprAcudApellido: string;
}

const completarInformacionService = {
  /** Completa la información del aprendiz usando su número de documento */
  async completar(documento: string, payload: CompletarInformacionPayload): Promise<void> {
    const url = `/Aprendiz/completar-informacion?documento=${encodeURIComponent(documento)}`;
    console.log("[DEBUG CompletarInfo] URL:", url);
    console.log("[DEBUG CompletarInfo] documento (query):", documento);
    console.log("[DEBUG CompletarInfo] Payload enviado:", JSON.stringify(payload, null, 2));

    try {
      const response = await api.put(url, payload);
      console.log("[DEBUG CompletarInfo] Respuesta OK - status:", response.status);
    } catch (err: unknown) {
      const axErr = err as { response?: { status?: number; data?: unknown }; message?: string };
      console.log("[DEBUG CompletarInfo] ERROR - status:", axErr.response?.status);
      console.log("[DEBUG CompletarInfo] ERROR - response.data:", JSON.stringify(axErr.response?.data, null, 2));
      console.log("[DEBUG CompletarInfo] ERROR - message:", axErr.message);
      throw err;
    }
  },
};

export default completarInformacionService;
