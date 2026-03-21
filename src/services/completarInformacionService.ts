import api from "./apiCliente";


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

    try {
      await api.put(url, payload);
    } catch (err: unknown) {
      throw err;
    }
  },
};

export default completarInformacionService;
