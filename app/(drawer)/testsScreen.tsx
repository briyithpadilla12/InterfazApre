import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import style from "@/src/components/Styles";
import TestService, { type TestResumen } from "@/src/services/testService";

const coloresEstado: Record<string, { bg: string; text: string; label: string }> = {
  asignado:   { bg: "#fef3c7", text: "#92400e", label: "Pendiente" },
  en_progreso:{ bg: "#dbeafe", text: "#1e40af", label: "En progreso" },
  completado: { bg: "#d1fae5", text: "#065f46", label: "Completado" },
};

function BadgeEstado({ estado }: { estado: string | null }) {
  const e = (estado ?? "asignado").toLowerCase();
  const c = coloresEstado[e] ?? coloresEstado.asignado;
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.badgeText, { color: c.text }]}>{c.label}</Text>
    </View>
  );
}

export default function TestsScreen() {
  const router = useRouter();
  const [tests, setTests] = useState<TestResumen[]>([]);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    setLoading(true);
    try { setTests(await TestService.misTests()); } catch { setTests([]); } finally { setLoading(false); }
  }, []);

  useFocusEffect(useCallback(() => { cargar(); }, [cargar]));

  const pendientes = tests.filter((t) => t.testGenEstadoTest !== "completado");
  const completados = tests.filter((t) => t.testGenEstadoTest === "completado");

  return (
    <View style={style.container}>
      <Text style={style.title}>Mis Tests</Text>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={loading ? styles.centered : styles.list}
        showsVerticalScrollIndicator={false}
      >
        {loading && <ActivityIndicator size="large" color="#085394" />}

        {!loading && tests.length === 0 && (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Feather name="clipboard" size={48} color="#6b7280" />
            </View>
            <Text style={styles.emptyTitle}>No tienes tests asignados</Text>
            <Text style={styles.emptyDesc}>Cuando tu psicólogo te asigne una evaluación, aparecerá aquí.</Text>
          </View>
        )}

        {!loading && pendientes.length > 0 && (
          <>
            <Text style={styles.seccionTitulo}>Pendientes</Text>
            {pendientes.map((t) => (
              <Pressable
                key={t.testGenCodigo}
                style={styles.card}
                onPress={() => router.push({ pathname: "/resolverTest", params: { testId: String(t.testGenCodigo) } })}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{t.plantillaNombre ?? "Test"}</Text>
                  <BadgeEstado estado={t.testGenEstadoTest} />
                </View>
                {t.plantillaDescripcion ? <Text style={styles.cardDesc} numberOfLines={2}>{t.plantillaDescripcion}</Text> : null}
                {t.psicologo && <Text style={styles.cardMeta}>Por: {t.psicologo.psiNombre} {t.psicologo.psiApellido}</Text>}
              </Pressable>
            ))}
          </>
        )}

        {!loading && completados.length > 0 && (
          <>
            <Text style={[styles.seccionTitulo, { marginTop: 24 }]}>Completados</Text>
            {completados.map((t) => (
              <View key={t.testGenCodigo} style={[styles.card, { opacity: 0.65 }]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{t.plantillaNombre ?? "Test"}</Text>
                  <BadgeEstado estado={t.testGenEstadoTest} />
                </View>
                {t.fechaRealizacion && (
                  <Text style={styles.cardMeta}>
                    Completado: {new Date(t.fechaRealizacion).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}
                  </Text>
                )}
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 20, paddingBottom: 100 },
  list: { paddingHorizontal: 20, paddingBottom: 100, gap: 12 },
  seccionTitulo: { fontSize: 16, fontWeight: "700", color: "#374151", marginBottom: 8 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 10,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#111", flex: 1, marginRight: 8 },
  cardDesc: { fontSize: 13, color: "#6b7280", marginBottom: 4 },
  cardMeta: { fontSize: 12, color: "#9ca3af" },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: "600" },
  empty: { alignItems: "center" },
  emptyIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#f3f4f6", justifyContent: "center", alignItems: "center", marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#4b5563", textAlign: "center", marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: "#6b7280", textAlign: "center", lineHeight: 20 },
});
