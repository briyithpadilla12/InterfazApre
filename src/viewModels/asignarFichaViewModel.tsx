import { useState, useCallback, useRef } from "react";
import * as fichaService from "@/src/services/fichaService";

const DEBOUNCE_MS = 350;

export function useAsignarFichaViewModel(documento: string) {
  const [fichas, setFichas] = useState<fichaService.FichaCompleta[]>([]);
  const [fichaSeleccionada, setFichaSeleccionada] = useState<fichaService.FichaCompleta | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);
  const [cargandoBusqueda, setCargandoBusqueda] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cargarFichas = useCallback(async (texto?: string) => {
    try {
      setCargandoBusqueda(true);
      const lista =
        texto !== undefined && texto.trim() !== ""
          ? await fichaService.buscarFichas(texto)
          : await fichaService.listarFichasActivas();
      setFichas(lista);
    } catch {
      setFichas([]);
    } finally {
      setCargandoBusqueda(false);
    }
  }, []);

  const buscar = useCallback(
    (texto: string) => {
      setBusqueda(texto);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        cargarFichas(texto);
        debounceRef.current = null;
      }, DEBOUNCE_MS);
    },
    [cargarFichas]
  );

  const asignar = async (): Promise<boolean> => {
    if (!documento?.trim()) {
      setError("Falta el documento del aprendiz");
      return false;
    }
    if (!fichaSeleccionada) {
      setError("Selecciona una ficha");
      return false;
    }

    setCargando(true);
    setError(null);

    try {
      await fichaService.crearAprendizFicha(documento, fichaSeleccionada.ficCodigo);
      return true;
    } catch (err: unknown) {
      const axErr = err as { response?: { data?: { message?: string } } };
      setError(axErr.response?.data?.message ?? "No se pudo asignar la ficha");
      return false;
    } finally {
      setCargando(false);
    }
  };

  return {
    fichas,
    fichaSeleccionada,
    setFichaSeleccionada,
    busqueda,
    buscar,
    cargarFichas,
    cargando,
    cargandoBusqueda,
    error,
    asignar,
  };
}
