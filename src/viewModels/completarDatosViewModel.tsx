import { useState } from "react";
import completarInformacionService, {
  CompletarInformacionPayload,
} from "@/src/services/completarInformacionService";

export interface FormularioCompletarDatos {
  aprFechaNac: string;
  aprNombre: string;
  aprSegundoNombre: string;
  aprApellido: string;
  aprSegundoApellido: string;
  aprCorreoInstitucional: string;
  aprDireccion: string;
  aprCiudadFk: string;
  aprTelefono: string;
  aprEps: string;
  aprPatologia: string;
  aprEstadoAprFk: string;
  aprTipoPoblacion: string;
  aprTelefonoAcudiente: string;
  aprAcudNombre: string;
  aprAcudApellido: string;
}

const VALORES_INICIALES: FormularioCompletarDatos = {
  aprFechaNac: "",
  aprNombre: "",
  aprSegundoNombre: "",
  aprApellido: "",
  aprSegundoApellido: "",
  aprCorreoInstitucional: "",
  aprDireccion: "",
  aprCiudadFk: "",
  aprTelefono: "",
  aprEps: "",
  aprPatologia: "",
  aprEstadoAprFk: "",
  aprTipoPoblacion: "",
  aprTelefonoAcudiente: "",
  aprAcudNombre: "",
  aprAcudApellido: "",
};

export function useCompletarDatosViewModel(documento: string) {
  const [formulario, setFormulario] = useState<FormularioCompletarDatos>(VALORES_INICIALES);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const actualizarCampo = (campo: keyof FormularioCompletarDatos, valor: string) => {
    setFormulario((prev) => ({ ...prev, [campo]: valor }));
    setError(null);
  };

  const esValido = (): boolean => {
    const requeridos: (keyof FormularioCompletarDatos)[] = [
      "aprFechaNac", "aprNombre", "aprApellido", "aprCorreoInstitucional",
      "aprDireccion", "aprTelefono", "aprAcudNombre", "aprTelefonoAcudiente",
    ];
    return requeridos.every((c) => formulario[c]?.trim());
  };

  const guardar = async (): Promise<boolean> => {
    if (!documento?.trim()) {
      setError("Falta el número de documento");
      return false;
    }
    if (!esValido()) {
      setError("Completa todos los campos obligatorios");
      return false;
    }

    setCargando(true);
    setError(null);

    try {
      const payload: CompletarInformacionPayload = {
        aprFechaNac: formulario.aprFechaNac,
        aprNombre: formulario.aprNombre.trim(),
        aprSegundoNombre: formulario.aprSegundoNombre.trim(),
        aprApellido: formulario.aprApellido.trim(),
        aprSegundoApellido: formulario.aprSegundoApellido.trim(),
        aprCorreoInstitucional: formulario.aprCorreoInstitucional.trim(),
        aprDireccion: formulario.aprDireccion.trim(),
        aprCiudadFk: parseInt(formulario.aprCiudadFk, 10) || 0,
        aprTelefono: formulario.aprTelefono.trim(),
        aprEps: formulario.aprEps.trim(),
        aprPatologia: formulario.aprPatologia.trim(),
        aprEstadoAprFk: parseInt(formulario.aprEstadoAprFk, 10) || 0,
        aprTipoPoblacion: formulario.aprTipoPoblacion.trim(),
        aprTelefonoAcudiente: formulario.aprTelefonoAcudiente.trim(),
        aprAcudNombre: formulario.aprAcudNombre.trim(),
        aprAcudApellido: formulario.aprAcudApellido.trim(),
      };
      await completarInformacionService.completar(documento, payload);
      return true;
    } catch (err: unknown) {
      const axErr = err as { response?: { status?: number; data?: { message?: string; errors?: Record<string, string[]> } }; message?: string };
      const data = axErr.response?.data;
      let msg = data?.message ?? axErr.message ?? "No se pudo guardar. Intenta de nuevo.";
      if (data?.errors && typeof data.errors === "object") {
        const errList = Object.entries(data.errors).flatMap(([k, v]) => (v || []).map((e) => `${k}: ${e}`));
        if (errList.length > 0) msg = errList.join("; ");
      }
      setError(String(msg));
      return false;
    } finally {
      setCargando(false);
    }
  };

  return { formulario, actualizarCampo, cargando, error, guardar, esValido };
}
