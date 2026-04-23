import { useEffect, useMemo, useState } from "react";
import completarInformacionService, {
  CompletarInformacionPayload,
} from "@/src/services/completarInformacionService";
import ciudadService, { type CiudadApi } from "@/src/services/ciudadService";

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
  aprTipoPoblacion: "",
  aprTelefonoAcudiente: "",
  aprAcudNombre: "",
  aprAcudApellido: "",
};

export function useCompletarDatosViewModel(documento: string) {
  const [formulario, setFormulario] = useState<FormularioCompletarDatos>(VALORES_INICIALES);
  const [ciudades, setCiudades] = useState<CiudadApi[]>([]);
  const [cargandoCiudades, setCargandoCiudades] = useState(false);
  const [errorCiudades, setErrorCiudades] = useState<string | null>(null);
  const [busquedaCiudad, setBusquedaCiudad] = useState("");
  const [mostrarResultadosCiudad, setMostrarResultadosCiudad] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const actualizarCampo = (campo: keyof FormularioCompletarDatos, valor: string) => {
    setFormulario((prev) => ({ ...prev, [campo]: valor }));
    setError(null);
  };

  const esValido = (): boolean => {
    const requeridos: (keyof FormularioCompletarDatos)[] = [
      "aprFechaNac", "aprNombre", "aprApellido", "aprCorreoInstitucional",
      "aprDireccion", "aprTelefono", "aprAcudNombre", "aprTelefonoAcudiente", "aprCiudadFk",
    ];
    return requeridos.every((c) => formulario[c]?.trim());
  };

  useEffect(() => {
    let activo = true;
    const cargarCiudades = async () => {
      setCargandoCiudades(true);
      setErrorCiudades(null);
      try {
        const lista = await ciudadService.obtenerTodas();
        if (!activo) return;
        setCiudades(lista);
      } catch {
        if (!activo) return;
        setErrorCiudades("No se pudieron cargar las ciudades. Intenta de nuevo.");
      } finally {
        if (activo) setCargandoCiudades(false);
      }
    };
    void cargarCiudades();
    return () => {
      activo = false;
    };
  }, []);

  const normalizar = (txt: string) =>
    txt
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const ciudadesFiltradas = useMemo(() => {
    const term = normalizar(busquedaCiudad);
    if (term.length < 3) return [];
    return ciudades.filter((c) => normalizar(c.ciuNombre).includes(term)).slice(0, 40);
  }, [busquedaCiudad, ciudades]);

  const ciudadSeleccionada = useMemo(() => {
    const id = Number(formulario.aprCiudadFk);
    if (!id) return null;
    return ciudades.find((c) => c.ciuCodigo === id) ?? null;
  }, [formulario.aprCiudadFk, ciudades]);

  const seleccionarCiudad = (ciudad: CiudadApi) => {
    setFormulario((prev) => ({ ...prev, aprCiudadFk: String(ciudad.ciuCodigo) }));
    setBusquedaCiudad(ciudad.ciuNombre);
    setMostrarResultadosCiudad(false);
    setError(null);
  };

  const cambiarBusquedaCiudad = (texto: string) => {
    setBusquedaCiudad(texto);
    setMostrarResultadosCiudad(true);
    setError(null);
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
        aprEstadoAprFk: 1,
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

  return {
    formulario,
    actualizarCampo,
    cargando,
    error,
    guardar,
    esValido,
    busquedaCiudad,
    setBusquedaCiudad,
    cambiarBusquedaCiudad,
    mostrarResultadosCiudad,
    ciudadesFiltradas,
    ciudadSeleccionada,
    seleccionarCiudad,
    cargandoCiudades,
    errorCiudades,
  };
}
