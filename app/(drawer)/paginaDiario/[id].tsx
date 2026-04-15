import ModalEmociones from "@/src/components/ModalEmociones";
import { EMOCION_ID } from "@/src/constants/emocionesDiario";
import { useEmociones } from "@/src/context/emocionesContext";
import { useDiarioViewModel } from "@/src/viewModels/diarioViewModel";
import { usePaginaDiarioViewModel } from "@/src/viewModels/paginaDiarioViewModel";
import PaginaDiarioService from "@/src/services/paginaDiarioService";
import type { PaginaDiarioListaItem } from "@/src/models/paginaDiario";
import Feather from "@expo/vector-icons/Feather";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLOR_PRINCIPAL = "#085394";

function formatearFechaLista(fechaStr: string): string {
  if (!fechaStr) return "Sin fecha";
  const [y, m, d] = fechaStr.split("-");
  if (d && m && y) return `${d}/${m}/${y}`;
  return fechaStr;
}

function parametroUnico(v: string | string[] | undefined): string {
  if (v == null) return "";
  return Array.isArray(v) ? v[0] ?? "" : v;
}

export default function PaginaDiarioDetalleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const idStr = parametroUnico(params.id);
  const modoRaw = parametroUnico(params.modo);
  const idNum = Number(idStr);
  const esEdicion = modoRaw === "editar";

  const { diario, asegurarDiario, error: errorDiario } = useDiarioViewModel();
  const { emociones: emocionesAPI } = useEmociones();
  const { actualizarPagina, cargando, error: errorGuardar, reset } =
    usePaginaDiarioViewModel();

  const [cargandoPagina, setCargandoPagina] = useState(true);
  const [pagina, setPagina] = useState<PaginaDiarioListaItem | null>(null);
  const [pagTitulo, setPagTitulo] = useState("");
  const [contenidoDiario, setContenidoDiario] = useState("");
  const [emocionesSeleccionadas, setEmocionesSeleccionadas] = useState<string[]>([]);
  const [modalEmocionesVisible, setModalEmocionesVisible] = useState(false);

  const cargarPagina = useCallback(async () => {
    setCargandoPagina(true);
    try {
      const d = diario ?? (await asegurarDiario());
      if (!d?.diaId || !Number.isFinite(idNum)) {
        setPagina(null);
        return;
      }
      const lista = await PaginaDiarioService.listarPorDiarioCompleto(d.diaId);
      const encontrada = lista.find((p) => p.id === idNum);
      setPagina(encontrada ?? null);
      if (encontrada) {
        setPagTitulo(encontrada.titulo === "Sin título" ? "" : encontrada.titulo);
        setContenidoDiario(encontrada.pagContenido);
        setEmocionesSeleccionadas(
          encontrada.emociones.length ? [encontrada.emociones[0]] : []
        );
      }
    } catch {
      setPagina(null);
    } finally {
      setCargandoPagina(false);
    }
  }, [diario, asegurarDiario, idNum]);

  useEffect(() => {
    cargarPagina();
  }, [cargarPagina]);

  /** Si las emociones cargan después de la página, alinear selección con pagEmocionFk. */
  useEffect(() => {
    if (!pagina || !esEdicion || emocionesAPI.length === 0) return;
    const emo = emocionesAPI.find((e) => e.emoCodigo === pagina.pagEmocionFk);
    if (emo) {
      setEmocionesSeleccionadas((prev) =>
        prev.length === 0 ? [emo.emoNombre] : prev
      );
    }
  }, [pagina, esEdicion, emocionesAPI]);

  const alternarEmocion = (emocion: string) => {
    setEmocionesSeleccionadas((prev) =>
      prev.includes(emocion)
        ? prev.filter((e) => e !== emocion)
        : [...prev, emocion]
    );
  };

  const fechaMostrar = useMemo(
    () => (pagina ? formatearFechaLista(pagina.fecha) : ""),
    [pagina]
  );

  const manejarGuardarEdicion = async () => {
    if (!pagina || !diario?.diaId) return;
    reset();
    const primeraEmocion = emocionesSeleccionadas[0];
    const emocionAPI = primeraEmocion
      ? emocionesAPI.find((e) => e.emoNombre === primeraEmocion)
      : undefined;
    const pagEmocionFk = emocionAPI
      ? emocionAPI.emoCodigo
      : primeraEmocion
        ? (EMOCION_ID[primeraEmocion] ?? pagina.pagEmocionFk)
        : 0;

    const payload = {
      pagTitulo: pagTitulo.trim(),
      pagContenido: contenidoDiario.trim(),
      pagDiarioFk: diario.diaId,
      pagEmocionFk,
    };

    const res = await actualizarPagina(pagina.id, payload);
    if (res.ok) {
      router.replace("/(drawer)/diarioScreen");
    } else {
      Alert.alert("Error al guardar", res.error);
    }
  };

  if (!Number.isFinite(idNum) || idNum <= 0) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <Text style={styles.errorCentro}>Identificador no válido</Text>
        <Pressable style={styles.botonVolver} onPress={() => router.back()}>
          <Text style={styles.botonVolverTexto}>Volver</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (cargandoPagina) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <View style={styles.centrado}>
          <ActivityIndicator size="large" color={COLOR_PRINCIPAL} />
        </View>
      </SafeAreaView>
    );
  }

  if (!pagina) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <Pressable style={styles.barraSuperior} onPress={() => router.back()} hitSlop={12}>
          <Feather name="chevron-left" size={28} color={COLOR_PRINCIPAL} />
          <Text style={styles.barraTitulo}>Página</Text>
        </Pressable>
        <View style={styles.centrado}>
          <Text style={styles.errorCentro}>
            No se encontró esta página o no pertenece a tu diario.
          </Text>
          {errorDiario ? <Text style={styles.errorSub}>{errorDiario}</Text> : null}
        </View>
      </SafeAreaView>
    );
  }

  if (!esEdicion) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <Pressable style={styles.barraSuperior} onPress={() => router.back()} hitSlop={12}>
          <Feather name="chevron-left" size={28} color={COLOR_PRINCIPAL} />
          <Text style={styles.barraTitulo} numberOfLines={1}>
            {pagina.titulo}
          </Text>
        </Pressable>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.metaFecha}>{fechaMostrar}</Text>
          {pagina.emociones.length > 0 && (
            <View style={styles.filaChips}>
              {pagina.emociones.map((e) => (
                <View key={e} style={styles.chip}>
                  <Text style={styles.chipTexto}>{e}</Text>
                </View>
              ))}
            </View>
          )}
          <Text style={styles.tituloLectura}>{pagina.titulo}</Text>
          <Text style={styles.cuerpoLectura}>{pagina.pagContenido || "Sin contenido."}</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <Pressable style={styles.barraSuperior} onPress={() => router.back()} hitSlop={12}>
          <Feather name="chevron-left" size={28} color={COLOR_PRINCIPAL} />
          <Text style={styles.barraTitulo}>Editar página</Text>
        </Pressable>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.filaFecha}>
            <Text style={styles.etiquetaFecha}>Fecha</Text>
            <Text style={styles.fecha}>{fechaMostrar}</Text>
          </View>

          <Text style={styles.subtitulo}>Cómo te sientes</Text>
          <Pressable
            style={styles.botonSeleccionarEmocion}
            onPress={() => setModalEmocionesVisible(true)}
          >
            <Text style={styles.botonSeleccionarEmocionTexto}>😊 Seleccionar emoción</Text>
          </Pressable>

          <Text style={styles.subtitulo}>Título de esta página</Text>
          <TextInput
            style={styles.inputTitulo}
            placeholder="Título"
            placeholderTextColor="#9ca3af"
            value={pagTitulo}
            onChangeText={setPagTitulo}
          />

          <Text style={styles.etiquetaContenido}>Tu reflexión</Text>
          <TextInput
            style={styles.areaTexto}
            placeholder="Contenido de la página..."
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={8}
            textAlignVertical="top"
            value={contenidoDiario}
            onChangeText={setContenidoDiario}
          />

          {(errorDiario || errorGuardar) && (
            <Text style={styles.textoError}>{errorDiario || errorGuardar}</Text>
          )}

          <Pressable
            style={[styles.botonGuardar, cargando && styles.botonGuardarDisabled]}
            onPress={manejarGuardarEdicion}
            disabled={cargando}
          >
            <Text style={styles.textoBotonGuardar}>
              {cargando ? "Guardando…" : "Guardar cambios"}
            </Text>
          </Pressable>
        </ScrollView>

        <ModalEmociones
          visible={modalEmocionesVisible}
          onClose={() => setModalEmocionesVisible(false)}
          seleccionadas={emocionesSeleccionadas}
          onToggle={alternarEmocion}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F4F7FF",
  },
  keyboardAvoid: {
    flex: 1,
  },
  centrado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  barraSuperior: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  barraTitulo: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: COLOR_PRINCIPAL,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  metaFecha: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 10,
  },
  filaChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  chipTexto: {
    fontSize: 13,
    color: "#3730a3",
  },
  tituloLectura: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
  },
  cuerpoLectura: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
  },
  filaFecha: {
    marginBottom: 16,
  },
  etiquetaFecha: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  fecha: {
    fontSize: 15,
    color: "#6b7280",
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 10,
    marginTop: 6,
  },
  inputTitulo: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: "#111",
    marginBottom: 12,
  },
  botonSeleccionarEmocion: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  botonSeleccionarEmocionTexto: {
    color: COLOR_PRINCIPAL,
    fontSize: 15,
    fontWeight: "600",
  },
  etiquetaContenido: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginTop: 8,
    marginBottom: 8,
  },
  areaTexto: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    padding: 18,
    fontSize: 15,
    color: "#111",
    minHeight: 220,
  },
  botonGuardar: {
    backgroundColor: COLOR_PRINCIPAL,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  textoBotonGuardar: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  botonGuardarDisabled: {
    opacity: 0.7,
  },
  textoError: {
    color: "#b91c1c",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  errorCentro: {
    fontSize: 16,
    color: "#4b5563",
    textAlign: "center",
  },
  errorSub: {
    marginTop: 8,
    fontSize: 14,
    color: "#b91c1c",
    textAlign: "center",
  },
  botonVolver: {
    marginTop: 20,
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: COLOR_PRINCIPAL,
    borderRadius: 10,
  },
  botonVolverTexto: {
    color: "#fff",
    fontWeight: "600",
  },
});
