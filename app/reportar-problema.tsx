import type { PrioridadReporte } from "@/src/models/reporte";
import { useReportarProblemaViewModel } from "@/src/viewModels/reportarProblemaViewModel";
import { useRouter } from "expo-router";
import { useCallback } from "react";
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

export default function ReportarProblemaScreen() {
  const router = useRouter();
  const {
    titulo,
    setTitulo,
    descripcion,
    setDescripcion,
    categoria,
    setCategoria,
    prioridad,
    setPrioridad,
    prioridades,
    cargando,
    error,
    enviar,
    reset,
  } = useReportarProblemaViewModel();

  const alEnviar = useCallback(async () => {
    const ok = await enviar();
    if (ok) {
      reset();
      Alert.alert(
        "Reporte enviado",
        "Hemos registrado tu reporte. El equipo lo revisará pronto.",
        [{ text: "Entendido", onPress: () => router.back() }]
      );
    }
  }, [enviar, reset, router]);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={72}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.intro}>
            Cuéntanos qué ocurrió. Tu mensaje se registra y el equipo de soporte
            podrá atenderlo.
          </Text>

          <Text style={styles.label}>Título *</Text>
          <TextInput
            style={styles.input}
            placeholder="Resumen breve"
            placeholderTextColor="#9ca3af"
            value={titulo}
            onChangeText={setTitulo}
            maxLength={200}
            editable={!cargando}
          />

          <Text style={styles.label}>Descripción *</Text>
          <TextInput
            style={[styles.input, styles.inputMultilinea]}
            placeholder="Describe el problema: qué hacías, qué esperabas y qué pasó…"
            placeholderTextColor="#9ca3af"
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
            textAlignVertical="top"
            maxLength={4000}
            editable={!cargando}
          />

          <Text style={styles.label}>Categoria del problema *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej.: error al guardar, sugerencia, accesibilidad…"
            placeholderTextColor="#9ca3af"
            value={categoria}
            onChangeText={setCategoria}
            maxLength={200}
            editable={!cargando}
          />

          <Text style={styles.label}>Prioridad</Text>
          <View style={styles.filaPrioridad}>
            {prioridades.map((p) => {
              const activa = prioridad === p.value;
              return (
                <Pressable
                  key={p.value}
                  style={[styles.prioridadChip, activa && styles.prioridadChipActiva]}
                  onPress={() => setPrioridad(p.value as PrioridadReporte)}
                  disabled={cargando}
                >
                  <Text
                    style={[
                      styles.prioridadTexto,
                      activa && styles.prioridadTextoActivo,
                    ]}
                  >
                    {p.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {error ? <Text style={styles.errorTexto}>{error}</Text> : null}

          <Pressable
            style={[styles.boton, cargando && styles.botonDeshabilitado]}
            onPress={alEnviar}
            disabled={cargando}
          >
            {cargando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.botonTexto}>Enviar reporte</Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flex: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 20,
   
    paddingBottom: 40,
  },
  intro: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111",
    backgroundColor: "#f9fafb",
    marginBottom: 16,
  },
  inputMultilinea: {
    minHeight: 120,
  },
  filaPrioridad: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  prioridadChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
  },
  prioridadChipActiva: {
    borderColor: COLOR_PRINCIPAL,
    backgroundColor: "#e8f0f8",
  },
  prioridadTexto: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  prioridadTextoActivo: {
    color: COLOR_PRINCIPAL,
    fontWeight: "700",
  },
  errorTexto: {
    color: "#b91c1c",
    fontSize: 14,
    marginBottom: 12,
  },
  boton: {
    backgroundColor: COLOR_PRINCIPAL,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  botonDeshabilitado: {
    opacity: 0.7,
  },
  botonTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
