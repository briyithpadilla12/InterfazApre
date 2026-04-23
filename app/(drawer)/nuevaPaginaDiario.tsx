import ModalEmociones from "@/src/components/ModalEmociones";
import { useEmociones } from "@/src/context/emocionesContext";
import { subirImagenDesdeUri } from "@/src/services/imagenService";
import { elegirImagen } from "@/src/utils/elegirImagen";
import { useDiarioViewModel } from "@/src/viewModels/diarioViewModel";
import { usePaginaDiarioViewModel } from "@/src/viewModels/paginaDiarioViewModel";
import Feather from "@expo/vector-icons/Feather";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
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

  const { emociones: emocionesAPI, recargar: recargarEmociones } = useEmociones();
  /** Una sola emoción por página; tocar otra sustituye; tocar la misma quita la selección. */
  const [emocionSeleccionada, setEmocionSeleccionada] = useState<number | null>(null);
  const [pagTitulo, setPagTitulo] = useState("");
  const [contenidoDiario, setContenidoDiario] = useState("");
  const [modalEmocionesVisible, setModalEmocionesVisible] = useState(false);
  const [imagenLocalUri, setImagenLocalUri] = useState<string | null>(null);
  const [pagImagenUrl, setPagImagenUrl] = useState<string | null>(null);
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  const fechaHoy = formatearFecha(new Date());

  useEffect(() => {
    asegurarDiario();
  }, []);

  useFocusEffect(
    useCallback(() => {
      void recargarEmociones();
    }, [recargarEmociones])
  );

  const seleccionarEmocionUnica = (emoCodigo: number) => {
    setEmocionSeleccionada((prev) => (prev === emoCodigo ? null : emoCodigo));
  };

  const manejarAgregarImagen = async () => {
    const resultado = await elegirImagen();
    if (!resultado) return;
    setImagenLocalUri(resultado.uri);
    setSubiendoImagen(true);
    try {
      const { url } = await subirImagenDesdeUri(resultado.uri, resultado.mimeType, "diario_pagina");
      setPagImagenUrl(url);
    } catch (err) {
      Alert.alert("Error al subir imagen", (err as Error).message);
      setImagenLocalUri(null);
    } finally {
      setSubiendoImagen(false);
    }
  };

  const quitarImagen = () => {
    setImagenLocalUri(null);
    setPagImagenUrl(null);
  };

  const manejarGuardar = async () => {
    reset();
    const d = diario ?? (await asegurarDiario());
    if (!d) {
      if (errorDiario) Alert.alert("Error", errorDiario);
      return;
    }
    if (
      emocionSeleccionada == null ||
      !emocionesAPI.some((e) => e.emoCodigo === emocionSeleccionada)
    ) {
      Alert.alert(
        "Emoción requerida",
        "Por favor selecciona una emoción y vuelve a intentarlo."
      );
      return;
    }
    const pagEmocionFk = emocionSeleccionada;
    const payload = {
      pagTitulo: pagTitulo.trim(),
      pagContenido: contenidoDiario.trim(),
      pagDiarioFk: d.diaId,
      pagEmocionFk,
      ...(pagImagenUrl ? { pagImagenUrl } : {}),
    };
    const ok = await guardarPagina(payload);
    if (ok) {
      setPagTitulo("");
      setContenidoDiario("");
      setEmocionSeleccionada(null);
      setImagenLocalUri(null);
      setPagImagenUrl(null);
      router.navigate("/(drawer)/diarioScreen");
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
            <Text style={styles.botonSeleccionarEmocionTexto}>
              {emocionSeleccionada == null
                ? "😊 Seleccionar emoción"
                : emocionesAPI.find((e) => e.emoCodigo === emocionSeleccionada)?.emoNombre?.trim() ??
                  `#${emocionSeleccionada}`}
            </Text>
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

          <Text style={styles.subtitulo}>Imagen (opcional)</Text>
          {imagenLocalUri ? (
            <View style={styles.imagenPreviewContenedor}>
              <Image
                source={{ uri: imagenLocalUri }}
                style={styles.imagenPreview}
                contentFit="cover"
              />
              {subiendoImagen && (
                <View style={styles.imagenOverlay}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.imagenOverlayTexto}>Subiendo…</Text>
                </View>
              )}
              <Pressable style={styles.botonQuitarImagen} onPress={quitarImagen}>
                <Feather name="x-circle" size={24} color="#b91c1c" />
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.botonAgregarImagen} onPress={manejarAgregarImagen}>
              <Feather name="camera" size={20} color={COLOR_PRINCIPAL} />
              <Text style={styles.botonAgregarImagenTexto}>Agregar foto</Text>
            </Pressable>
          )}

          {(errorDiario || errorGuardar) && (
            <Text style={styles.textoError}>{errorDiario || errorGuardar}</Text>
          )}
          <Pressable
            style={[styles.botonGuardar, (cargando || subiendoImagen) && styles.botonGuardarDisabled]}
            onPress={manejarGuardar}
            disabled={cargando || subiendoImagen}
          >
            <Text style={styles.textoBotonGuardar}>
              {cargando ? "Guardando…" : "Guardar"}
            </Text>
          </Pressable>
        </ScrollView>

        <ModalEmociones
          visible={modalEmocionesVisible}
          onClose={() => setModalEmocionesVisible(false)}
          seleccionadas={
            emocionSeleccionada != null ? [emocionSeleccionada] : []
          }
          onToggle={seleccionarEmocionUnica}
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
  imagenPreviewContenedor: {
    position: "relative",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 12,
  },
  imagenPreview: {
    width: "100%",
    height: 200,
    borderRadius: 14,
  },
  imagenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  imagenOverlayTexto: {
    color: "#fff",
    fontSize: 13,
    marginTop: 4,
  },
  botonQuitarImagen: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 2,
  },
  botonAgregarImagen: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderStyle: "dashed",
    marginBottom: 8,
  },
  botonAgregarImagenTexto: {
    color: COLOR_PRINCIPAL,
    fontSize: 15,
    fontWeight: "600",
  },
});
