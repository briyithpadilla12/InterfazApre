import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import style from "@/src/components/Styles";
import SeguimientoService, {
  type SeguimientoApi,
  type RecomendacionApi,
} from "@/src/services/seguimientoService";
import FirmaCanvas from "@/src/components/FirmaCanvas";

const coloresEstado: Record<string, { bg: string; text: string; icon: string }> = {
  criticos:        { bg: "#fef2f2", text: "#991b1b", icon: "#ef4444" },
  "en observacion":{ bg: "#fffbeb", text: "#92400e", icon: "#f59e0b" },
  estable:         { bg: "#f0fdf4", text: "#166534", icon: "#22c55e" },
  finalizado:      { bg: "#f1f5f9", text: "#475569", icon: "#94a3b8" },
  completada:      { bg: "#f1f5f9", text: "#475569", icon: "#94a3b8" },
};

function getColorEstado(raw: string | null) {
  const k = (raw ?? "").trim().toLowerCase();
  if (k.includes("completada")) return coloresEstado.completada;
  for (const [key, val] of Object.entries(coloresEstado)) {
    if (k.includes(key)) return val;
  }
  return coloresEstado.estable;
}

const coloresEstadoRec: Record<string, { bg: string; text: string }> = {
  pendiente:    { bg: "#fef3c7", text: "#92400e" },
  en_progreso:  { bg: "#dbeafe", text: "#1e40af" },
  completada:   { bg: "#d1fae5", text: "#065f46" },
};

function getColorEstadoRec(estado: string | null) {
  const k = (estado ?? "").trim().toLowerCase().replace(/\s/g, "_");
  return coloresEstadoRec[k] ?? coloresEstadoRec.pendiente;
}

export default function SeguimientoScreen() {
  const [seg, setSeg] = useState<SeguimientoApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  const [showFirma, setShowFirma] = useState(false);
  const [firmando, setFirmando] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    setErrorCarga(null);
    try {
      const s = await SeguimientoService.miSeguimiento();
      setSeg(s && s.segCodigo > 0 ? s : null);
    } catch (e) {
      setSeg(null);
      const msg = e && typeof e === "object" && "message" in e ? String((e as Error).message) : "No se pudo cargar el seguimiento.";
      setErrorCarga(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { cargar(); }, [cargar]));

  const handleFirma = async (firma: string) => {
    if (!seg) return;
    setFirmando(true);
    try {
      await SeguimientoService.firmarAprendiz(seg.segCodigo, firma);
      setShowFirma(false);
      await cargar();
    } catch { /* silencioso */ } finally { setFirmando(false); }
  };

  if (loading) {
    return (
      <View style={[style.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#085394" />
      </View>
    );
  }

  if (!seg) {
    return (
      <View style={style.container}>
        <Text style={style.title}>Mi Seguimiento</Text>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}><Feather name="activity" size={48} color="#6b7280" /></View>
          {errorCarga ? (
            <>
              <Text style={styles.emptyTitle}>No se pudo obtener el seguimiento</Text>
              <Text style={styles.emptyDesc}>{errorCarga}</Text>
              <Text style={[styles.emptyDesc, { marginTop: 8 }]}>
                Si la sesión expiró, cierra sesión y vuelve a entrar. Si el problema continúa, contacta a tu psicólogo.
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.emptyTitle}>Sin seguimiento activo</Text>
              <Text style={styles.emptyDesc}>
                No tienes un seguimiento asignado en este momento o aún no está vinculado a tu ficha. Si tu psicólogo ya abrió un caso, espera unos minutos y vuelve a abrir esta pantalla.
              </Text>
            </>
          )}
        </View>
      </View>
    );
  }

  const color = getColorEstado(seg.segEstadoSeguimiento);
  const estadoLower = (seg.segEstadoSeguimiento ?? "").toLowerCase();
  /** Incluye casos antiguos: fecha fin + firma profesional aunque el estado siguiera en "Estables". */
  const esFinalizado =
    estadoLower.includes("finalizado") ||
    estadoLower.includes("completada") ||
    (!!seg.fechaFin && !!seg.segFirmaProfesional);

  return (
    <View style={style.container}>
      <Text style={style.title}>Mi Seguimiento</Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, gap: 16 }}>
        {/* Estado */}
        <View style={[styles.estadoCard, { backgroundColor: color.bg }]}>
          <Feather name="activity" size={24} color={color.icon} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.estadoLabel, { color: color.text }]}>Estado del seguimiento</Text>
            <Text style={[styles.estadoValue, { color: color.text }]}>{seg.segEstadoSeguimiento ?? "—"}</Text>
          </View>
        </View>

        {/* Info general */}
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Información general</Text>
          <InfoRow label="Fecha inicio" value={formatFecha(seg.fechaInicio)} />
          {seg.fechaFin && <InfoRow label="Fecha fin" value={formatFecha(seg.fechaFin)} />}
          {seg.segAreaRemitido && <InfoRow label="Área remitida" value={seg.segAreaRemitido} />}
          {seg.segTrimestreActual && <InfoRow label="Trimestre" value={seg.segTrimestreActual} />}
          {seg.segMotivo && <InfoRow label="Motivo" value={seg.segMotivo} />}
          {seg.segDescripcion && (
            <View style={{ marginTop: 8 }}>
              <Text style={styles.infoLabel}>Descripción</Text>
              <Text style={styles.infoValueLong}>{seg.segDescripcion}</Text>
            </View>
          )}
          {seg.psicologo && <InfoRow label="Psicólogo" value={`${seg.psicologo.psiNombre} ${seg.psicologo.psiApellido}`} />}
        </View>

        {/* Recomendaciones */}
        {seg.recomendaciones && seg.recomendaciones.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Recomendaciones</Text>
            {seg.recomendaciones.map((r) => (
              <RecCard key={r.recCodigo} rec={r} />
            ))}
          </View>
        )}

        {/* Firma */}
        {esFinalizado && (
          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Firma</Text>
            {seg.segFirmaAprendiz ? (
              <View style={styles.firmaOk}>
                <Feather name="check-circle" size={20} color="#10b981" />
                <Text style={styles.firmaOkTexto}>Firma registrada correctamente.</Text>
              </View>
            ) : (
              <View>
                <Text style={styles.firmaDescTexto}>
                  Tu psicólogo ha finalizado este seguimiento. Por favor firma para completar el proceso.
                </Text>
                <Pressable style={styles.btnFirma} onPress={() => setShowFirma(true)}>
                  <Feather name="edit-3" size={18} color="#fff" />
                  <Text style={styles.btnFirmaTexto}>Firmar ahora</Text>
                </Pressable>
              </View>
            )}
            {seg.segFirmaProfesional && (
              <View style={[styles.firmaOk, { marginTop: 12 }]}>
                <Feather name="check-circle" size={16} color="#6366f1" />
                <Text style={[styles.firmaOkTexto, { color: "#6366f1" }]}>Firma del profesional registrada.</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <FirmaCanvas
        visible={showFirma}
        onClose={() => setShowFirma(false)}
        onFirmaReady={handleFirma}
        loading={firmando}
      />
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function RecCard({ rec }: { rec: RecomendacionApi }) {
  const c = getColorEstadoRec(rec.recEstado);
  return (
    <View style={styles.recCard}>
      <View style={styles.recHeader}>
        <Text style={styles.recTitulo} numberOfLines={1}>{rec.recTitulo ?? "—"}</Text>
        <View style={[styles.recBadge, { backgroundColor: c.bg }]}>
          <Text style={[styles.recBadgeTexto, { color: c.text }]}>{rec.recEstado ?? "—"}</Text>
        </View>
      </View>
      {rec.recDescripcion && <Text style={styles.recDesc}>{rec.recDescripcion}</Text>}
      {rec.recFechaVencimiento && <Text style={styles.recMeta}>Vence: {formatFecha(rec.recFechaVencimiento)}</Text>}
    </View>
  );
}

function formatFecha(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
  } catch { return iso; }
}

const styles = StyleSheet.create({
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
  emptyIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#f3f4f6", justifyContent: "center", alignItems: "center", marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#4b5563", textAlign: "center", marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: "#6b7280", textAlign: "center", lineHeight: 20 },

  estadoCard: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, borderRadius: 14 },
  estadoLabel: { fontSize: 12, fontWeight: "500" },
  estadoValue: { fontSize: 18, fontWeight: "700", marginTop: 2 },

  card: { backgroundColor: "#fff", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#e5e7eb" },
  cardTitulo: { fontSize: 16, fontWeight: "700", color: "#111", marginBottom: 12 },

  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 6 },
  infoLabel: { fontSize: 13, color: "#6b7280", flex: 1 },
  infoValue: { fontSize: 14, fontWeight: "500", color: "#111", flex: 1.5, textAlign: "right" },
  infoValueLong: { fontSize: 14, color: "#374151", lineHeight: 20, marginTop: 4 },

  recCard: { backgroundColor: "#f9fafb", borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: "#f3f4f6" },
  recHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  recTitulo: { fontSize: 14, fontWeight: "600", color: "#111", flex: 1, marginRight: 8 },
  recBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  recBadgeTexto: { fontSize: 11, fontWeight: "600" },
  recDesc: { fontSize: 13, color: "#6b7280", marginBottom: 4 },
  recMeta: { fontSize: 11, color: "#9ca3af" },

  firmaOk: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 8 },
  firmaOkTexto: { fontSize: 14, color: "#10b981", fontWeight: "500" },
  firmaDescTexto: { fontSize: 14, color: "#6b7280", lineHeight: 20, marginBottom: 12 },
  btnFirma: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#6366f1", paddingVertical: 14, borderRadius: 14 },
  btnFirmaTexto: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
