import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import TestService, {
  type PreguntaApi,
  type RespuestaItem,
  type TestConPreguntas,
} from "@/src/services/testService";

const { width: SCREEN_W } = Dimensions.get("window");

const COLORES_OPCIONES = [
  { bg: "#6366f1", pressed: "#4f46e5" },
  { bg: "#f59e0b", pressed: "#d97706" },
  { bg: "#10b981", pressed: "#059669" },
  { bg: "#ef4444", pressed: "#dc2626" },
  { bg: "#8b5cf6", pressed: "#7c3aed" },
  { bg: "#06b6d4", pressed: "#0891b2" },
];

type Fase = "cargando" | "quiz" | "confirmar" | "enviando" | "listo" | "error";

export default function ResolverTestScreen() {
  const router = useRouter();
  const { testId } = useLocalSearchParams<{ testId: string }>();
  const tid = Number(testId);

  const [fase, setFase] = useState<Fase>("cargando");
  const [testData, setTestData] = useState<TestConPreguntas | null>(null);
  const [preguntaIdx, setPreguntaIdx] = useState(0);
  const [respuestas, setRespuestas] = useState<Map<number, number>>(new Map());
  const [errorMsg, setErrorMsg] = useState("");

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const cargar = useCallback(async () => {
    try {
      setFase("cargando");
      const data = await TestService.preguntas(tid);
      setTestData(data);
      setFase("quiz");
    } catch {
      setErrorMsg("No se pudo cargar el test.");
      setFase("error");
    }
  }, [tid]);

  useEffect(() => { cargar(); }, [cargar]);

  const preguntas = testData?.preguntas ?? [];
  const totalPreguntas = preguntas.length;
  const preguntaActual: PreguntaApi | undefined = preguntas[preguntaIdx];
  const progreso = totalPreguntas > 0 ? ((preguntaIdx + 1) / totalPreguntas) : 0;

  const animarTransicion = (next: () => void) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      next();
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    });
  };

  const seleccionarOpcion = (preguntaId: number, opcionId: number) => {
    setRespuestas((prev) => new Map(prev).set(preguntaId, opcionId));
    if (preguntaIdx < totalPreguntas - 1) {
      animarTransicion(() => setPreguntaIdx((i) => i + 1));
    } else {
      setFase("confirmar");
    }
  };

  const enviarRespuestas = async () => {
    setFase("enviando");
    try {
      const items: RespuestaItem[] = [];
      respuestas.forEach((opcionId, preguntaId) => items.push({ preguntaId, opcionId }));
      await TestService.responder(tid, items);
      setFase("listo");
    } catch {
      setErrorMsg("Error al enviar las respuestas.");
      setFase("error");
    }
  };

  if (fase === "cargando") {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.cargandoTexto}>Cargando test...</Text>
      </View>
    );
  }

  if (fase === "error") {
    return (
      <View style={styles.centrado}>
        <Feather name="alert-circle" size={48} color="#ef4444" />
        <Text style={styles.errorTexto}>{errorMsg}</Text>
        <Pressable style={styles.btnPrimario} onPress={() => router.back()}>
          <Text style={styles.btnPrimarioTexto}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  if (fase === "listo") {
    return (
      <View style={styles.centrado}>
        <View style={styles.checkCircle}>
          <Feather name="check" size={48} color="#fff" />
        </View>
        <Text style={styles.listoTitulo}>¡Test completado!</Text>
        <Text style={styles.listoDesc}>Tus respuestas han sido registradas correctamente.</Text>
        <Pressable style={styles.btnPrimario} onPress={() => router.back()}>
          <Text style={styles.btnPrimarioTexto}>Volver a mis tests</Text>
        </Pressable>
      </View>
    );
  }

  if (fase === "confirmar") {
    return (
      <View style={styles.centrado}>
        <Feather name="check-square" size={48} color="#6366f1" />
        <Text style={styles.confirmarTitulo}>¿Enviar respuestas?</Text>
        <Text style={styles.confirmarDesc}>
          Has respondido {respuestas.size} de {totalPreguntas} preguntas.
        </Text>
        <View style={{ flexDirection: "row", gap: 12, marginTop: 20 }}>
          <Pressable style={styles.btnSecundario} onPress={() => setFase("quiz")}>
            <Text style={styles.btnSecundarioTexto}>Revisar</Text>
          </Pressable>
          <Pressable style={styles.btnPrimario} onPress={enviarRespuestas}>
            <Text style={styles.btnPrimarioTexto}>Enviar</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (fase === "enviando") {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.cargandoTexto}>Enviando respuestas...</Text>
      </View>
    );
  }

  if (!preguntaActual) return null;

  return (
    <View style={styles.container}>
      {/* Barra de progreso */}
      <View style={styles.progresoContenedor}>
        <View style={styles.progresoFondo}>
          <View style={[styles.progresoRelleno, { width: `${progreso * 100}%` }]} />
        </View>
        <Text style={styles.progresoTexto}>{preguntaIdx + 1} / {totalPreguntas}</Text>
      </View>

      {/* Pregunta */}
      <Animated.View style={[styles.preguntaContenedor, { opacity: fadeAnim }]}>
        <Text style={styles.preguntaTipo}>{labelTipo(preguntaActual.plaPrgTipo)}</Text>
        <Text style={styles.preguntaTexto}>{preguntaActual.plaPrgTexto}</Text>
      </Animated.View>

      {/* Opciones */}
      <ScrollView contentContainerStyle={styles.opcionesContenedor} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {preguntaActual.opciones
            .sort((a, b) => a.plaOpcOrden - b.plaOpcOrden)
            .map((opc, idx) => {
              const color = COLORES_OPCIONES[idx % COLORES_OPCIONES.length];
              const seleccionada = respuestas.get(preguntaActual.plaPrgCodigo) === opc.plaOpcCodigo;
              return (
                <Pressable
                  key={opc.plaOpcCodigo}
                  onPress={() => seleccionarOpcion(preguntaActual.plaPrgCodigo, opc.plaOpcCodigo)}
                  style={({ pressed }) => [
                    styles.opcionBtn,
                    { backgroundColor: pressed ? color.pressed : color.bg },
                    seleccionada && styles.opcionSeleccionada,
                  ]}
                >
                  <Text style={styles.opcionLetra}>{String.fromCharCode(65 + idx)}</Text>
                  <Text style={styles.opcionTexto}>{opc.plaOpcTexto}</Text>
                  {seleccionada && <Feather name="check-circle" size={20} color="#fff" style={{ marginLeft: "auto" }} />}
                </Pressable>
              );
            })}
        </Animated.View>
      </ScrollView>

      {/* Navegación */}
      <View style={styles.navContenedor}>
        <Pressable
          onPress={() => animarTransicion(() => setPreguntaIdx((i) => Math.max(0, i - 1)))}
          disabled={preguntaIdx === 0}
          style={[styles.navBtn, preguntaIdx === 0 && { opacity: 0.3 }]}
        >
          <Feather name="chevron-left" size={24} color="#374151" />
          <Text style={styles.navTexto}>Anterior</Text>
        </Pressable>

        {preguntaIdx < totalPreguntas - 1 ? (
          <Pressable
            onPress={() => animarTransicion(() => setPreguntaIdx((i) => Math.min(totalPreguntas - 1, i + 1)))}
            style={styles.navBtn}
          >
            <Text style={styles.navTexto}>Siguiente</Text>
            <Feather name="chevron-right" size={24} color="#374151" />
          </Pressable>
        ) : (
          <Pressable
            onPress={() => setFase("confirmar")}
            style={[styles.navBtn, { backgroundColor: "#6366f1", borderRadius: 12, paddingHorizontal: 16 }]}
          >
            <Text style={[styles.navTexto, { color: "#fff" }]}>Finalizar</Text>
            <Feather name="send" size={18} color="#fff" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

function labelTipo(tipo: string): string {
  const m: Record<string, string> = {
    si_no: "Sí / No",
    verdadero_falso: "Verdadero / Falso",
    opcion_multiple: "Opción múltiple",
    escala: "Escala",
  };
  return m[tipo] ?? tipo;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f2f5" },
  centrado: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32, backgroundColor: "#f0f2f5" },
  cargandoTexto: { marginTop: 12, fontSize: 15, color: "#6b7280" },
  errorTexto: { marginTop: 12, fontSize: 16, color: "#374151", textAlign: "center" },

  progresoContenedor: { paddingHorizontal: 20, paddingTop: 12, flexDirection: "row", alignItems: "center", gap: 10 },
  progresoFondo: { flex: 1, height: 8, backgroundColor: "#e5e7eb", borderRadius: 4, overflow: "hidden" },
  progresoRelleno: { height: "100%", backgroundColor: "#6366f1", borderRadius: 4 },
  progresoTexto: { fontSize: 13, fontWeight: "600", color: "#6b7280", minWidth: 42, textAlign: "right" },

  preguntaContenedor: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 12 },
  preguntaTipo: { fontSize: 12, color: "#6366f1", fontWeight: "600", textTransform: "uppercase", marginBottom: 6 },
  preguntaTexto: { fontSize: 22, fontWeight: "700", color: "#111827", lineHeight: 30 },

  opcionesContenedor: { paddingHorizontal: 20, paddingBottom: 20, gap: 12 },
  opcionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  opcionSeleccionada: { borderWidth: 3, borderColor: "#fff" },
  opcionLetra: { width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.3)", textAlign: "center", lineHeight: 32, fontSize: 16, fontWeight: "700", color: "#fff", marginRight: 14 },
  opcionTexto: { fontSize: 16, fontWeight: "600", color: "#fff", flex: 1 },

  navContenedor: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1, borderColor: "#e5e7eb", backgroundColor: "#fff" },
  navBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 10 },
  navTexto: { fontSize: 15, fontWeight: "600", color: "#374151" },

  checkCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#10b981", justifyContent: "center", alignItems: "center", marginBottom: 20 },
  listoTitulo: { fontSize: 24, fontWeight: "700", color: "#111", marginBottom: 8 },
  listoDesc: { fontSize: 15, color: "#6b7280", textAlign: "center", marginBottom: 24 },

  confirmarTitulo: { fontSize: 22, fontWeight: "700", color: "#111", marginTop: 16, marginBottom: 8 },
  confirmarDesc: { fontSize: 15, color: "#6b7280", textAlign: "center" },

  btnPrimario: { backgroundColor: "#6366f1", paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14 },
  btnPrimarioTexto: { color: "#fff", fontSize: 16, fontWeight: "600" },
  btnSecundario: { backgroundColor: "#e5e7eb", paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14 },
  btnSecundarioTexto: { color: "#374151", fontSize: 16, fontWeight: "600" },
});
