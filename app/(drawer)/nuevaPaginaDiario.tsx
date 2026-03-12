import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SelectorEmociones from "@/src/components/SelectorEmociones";

// Mismo formato que la barra de búsqueda (ej: 12/03/2026). Reutilizable luego en búsqueda si se desea.
function formatearFecha(fecha: Date): string {
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const año = fecha.getFullYear();
  return `${dia}/${mes}/${año}`;
}

const EMOCIONES_DISPONIBLES = [
  "Alegría",
  "Tristeza",
  "Ansiedad",
  "Calma",
  "Enojo",
  "Esperanza",
  "Miedo",
  "Gratitud",
  "Confusión",
  "Paz",
];

export default function NuevaPaginaDiarioScreen() {
  const [emocionesSeleccionadas, setEmocionesSeleccionadas] = useState<string[]>([]);
  const [contenidoDiario, setContenidoDiario] = useState("");

  const fechaHoy = formatearFecha(new Date());

  const alternarEmocion = (emocion: string) => {
    setEmocionesSeleccionadas((prev) =>
      prev.includes(emocion)
        ? prev.filter((e) => e !== emocion)
        : [...prev, emocion]
    );
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
          <Text style={styles.titulo}>Diario emocional</Text>

          <View style={styles.filaFecha}>
            <Text style={styles.etiquetaFecha}>Fecha</Text>
            <Text style={styles.fecha}>{fechaHoy}</Text>
          </View>

          <Text style={styles.subtitulo}>
            ¿Cómo te sientes hoy?
          </Text>
          <Text style={styles.subtituloSecundario}>
            Selecciona las emociones que experimentaste.
          </Text>

          <SelectorEmociones
            emociones={EMOCIONES_DISPONIBLES}
            seleccionadas={emocionesSeleccionadas}
            onToggle={alternarEmocion}
          />

          <Text style={styles.etiquetaContenido}>Escribe sobre tu día</Text>
          <TextInput
            style={styles.areaTexto}
            placeholder="Escribe libremente sobre lo que viviste, pensaste o sentiste hoy..."
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={contenidoDiario}
            onChangeText={setContenidoDiario}
          />

          <Pressable style={styles.botonGuardar} onPress={() => {}}>
            <Text style={styles.textoBotonGuardar}>Guardar</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 120,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#085394",
    textAlign: "center",
    marginBottom: 16,
  },
  filaFecha: {
    marginBottom: 18,
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
    marginBottom: 4,
  },
  subtituloSecundario: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
  },
  etiquetaContenido: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginTop: 14,
    marginBottom: 8,
  },
  areaTexto: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: "#111",
    minHeight: 140,
  },
  botonGuardar: {
    backgroundColor: "#085394",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  textoBotonGuardar: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
