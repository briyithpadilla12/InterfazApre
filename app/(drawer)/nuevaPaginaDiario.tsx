import ModalEmociones from "@/src/components/ModalEmociones";
import { EMOCION_ID } from "@/src/constants/emocionesDiario";
import { useEmociones } from "@/src/context/emocionesContext";
import { useDiarioViewModel } from "@/src/viewModels/diarioViewModel";
import { usePaginaDiarioViewModel } from "@/src/viewModels/paginaDiarioViewModel";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
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

// Mismo formato que la barra de búsqueda (ej: 12/03/2026). Reutilizable luego en búsqueda si se desea.
function formatearFecha(fecha: Date): string {
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const año = fecha.getFullYear();
  return `${dia}/${mes}/${año}`;
}

export default function NuevaPaginaDiarioScreen() {
  const router = useRouter();
  const { diario, asegurarDiario, error: errorDiario } = useDiarioViewModel();
  const { guardarPagina, cargando, error: errorGuardar, exito, reset } = usePaginaDiarioViewModel();

  const { emociones: emocionesAPI } = useEmociones();
  const [emocionesSeleccionadas, setEmocionesSeleccionadas] = useState<string[]>([]);
  const [pagTitulo, setPagTitulo] = useState("");
  const [contenidoDiario, setContenidoDiario] = useState("");
  const [modalEmocionesVisible, setModalEmocionesVisible] = useState(false);

  const fechaHoy = formatearFecha(new Date());

  useEffect(() => {
    asegurarDiario();
  }, []);

  const alternarEmocion = (emocion: string) => {
    setEmocionesSeleccionadas((prev) =>
      prev.includes(emocion)
        ? prev.filter((e) => e !== emocion)
        : [...prev, emocion]
    );
  };

  const manejarGuardar = async () => {
    reset();
    const d = diario ?? (await asegurarDiario());
    console.log("[DEBUG nuevaPaginaDiario.manejarGuardar] d (diario):", d ? { diaId: d.diaId, diaTitulo: d.diaTitulo } : null);
    console.log("[DEBUG nuevaPaginaDiario.manejarGuardar] d.diaId valor y tipo:", d?.diaId, typeof d?.diaId);
    if (!d) {
      if (errorDiario) Alert.alert("Error", errorDiario);
      return;
    }
    const primeraEmocion = emocionesSeleccionadas[0];
    const emocionAPI = primeraEmocion
      ? emocionesAPI.find((e) => e.emoNombre === primeraEmocion)
      : undefined;
    const pagEmocionFk = emocionAPI
      ? emocionAPI.emoCodigo
      : primeraEmocion
        ? (EMOCION_ID[primeraEmocion] ?? 1)
        : 0;
    const payload = {
      pagTitulo: pagTitulo.trim(),
      pagContenido: contenidoDiario.trim(),
      pagDiarioFk: d.diaId,
      pagEmocionFk,
    };
    console.log("[DEBUG nuevaPaginaDiario.manejarGuardar] Payload a guardarPagina:", payload);
    const ok = await guardarPagina(payload);
    if (ok) {
      setPagTitulo("");
      setContenidoDiario("");
      setEmocionesSeleccionadas([]);
      router.replace("/(drawer)/diarioScreen");
    } else if (errorGuardar) {
      Alert.alert("Error al guardar", errorGuardar);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.contenedorTitulo}>
            <Feather name="book-open" size={28} color={COLOR_PRINCIPAL} style={styles.iconoTitulo} />
            <Text style={styles.titulo}>Mi diario emocional</Text>
          </View>

          <View style={styles.cajaFrase}>
            <Text style={styles.fraseMotivadora}>
              Escribir sobre tus emociones te ayuda a comprenderlas ❤️
            </Text>
          </View>

          <View style={styles.filaFecha}>
            <Text style={styles.etiquetaFecha}>Fecha</Text>
            <Text style={styles.fecha}>{fechaHoy}</Text>
          </View>

          <Text style={styles.subtitulo}>Cómo te sientes hoy</Text>
          <Pressable
            style={styles.botonSeleccionarEmocion}
            onPress={() => setModalEmocionesVisible(true)}
          >
            <Text style={styles.botonSeleccionarEmocionTexto}>😊 Seleccionar emoción</Text>
          </Pressable>

          <Text style={styles.subtitulo}>Título de esta página</Text>
          <TextInput
            style={styles.inputTitulo}
            placeholder="Agrega un título para esta entrada"
            placeholderTextColor="#9ca3af"
            value={pagTitulo}
            onChangeText={setPagTitulo}
          />

          <Text style={styles.subtitulo}>Reflexiona sobre tu día</Text>
          <View style={styles.contenedorPreguntas}>
            <Text style={styles.pregunta}>¿Qué ocurrió hoy?</Text>
            <Text style={styles.pregunta}>¿Cómo te hizo sentir?</Text>
            <Text style={styles.pregunta}>¿Qué aprendiste?</Text>
          </View>

          <Text style={styles.etiquetaContenido}>Tu reflexión</Text>
          <TextInput
            style={styles.areaTexto}
            placeholder="Escribe aquí lo que viviste, sentiste o aprendiste hoy..."
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={contenidoDiario}
            onChangeText={setContenidoDiario}
          />

          {(errorDiario || errorGuardar) && (
            <Text style={styles.textoError}>{errorDiario || errorGuardar}</Text>
          )}
          <Pressable
            style={[styles.botonGuardar, cargando && styles.botonGuardarDisabled]}
            onPress={manejarGuardar}
            disabled={cargando}
          >
            <Text style={styles.textoBotonGuardar}>
              {cargando ? "Guardando…" : "Guardar"}
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  contenedorTitulo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  iconoTitulo: {
    marginRight: 10,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "700",
    color: COLOR_PRINCIPAL,
    textAlign: "center",
  },
  cajaFrase: {
    marginBottom: 16,
  },
  fraseMotivadora: {
    fontSize: 16,
    color: "#4b5563",
    textAlign: "center",
    lineHeight: 22,
  },
  filaFecha: {
    marginBottom: 20,
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
  contenedorPreguntas: {
    marginBottom: 12,
  },
  pregunta: {
    fontSize: 15,
    color: "#4b5563",
    marginBottom: 6,
    lineHeight: 22,
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
    minHeight: 250,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
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
});
