import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { captureRef } from "react-native-view-shot";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";

interface Props {
  visible: boolean;
  onClose: () => void;
  onFirmaReady: (base64OrUri: string) => void | Promise<void>;
  loading?: boolean;
}

interface Point { x: number; y: number }

export default function FirmaCanvas({ visible, onClose, onFirmaReady, loading }: Props) {
  const [modo, setModo] = useState<"elegir" | "dibujar" | "imagen">("elegir");
  const [paths, setPaths] = useState<Point[][]>([]);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [imagenUri, setImagenUri] = useState<string | null>(null);
  const canvasRef = useRef<View>(null);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => {
      const { locationX, locationY } = e.nativeEvent;
      setCurrentPath([{ x: locationX, y: locationY }]);
    },
    onPanResponderMove: (e) => {
      const { locationX, locationY } = e.nativeEvent;
      setCurrentPath((prev) => [...prev, { x: locationX, y: locationY }]);
    },
    onPanResponderRelease: () => {
      setPaths((prev) => [...prev, currentPath]);
      setCurrentPath([]);
    },
  });

  const limpiarCanvas = () => { setPaths([]); setCurrentPath([]); };

  const guardarDibujo = async () => {
    if (!canvasRef.current) return;
    try {
      const uri = await captureRef(canvasRef, { format: "png", quality: 1, result: "base64" });
      await onFirmaReady(`data:image/png;base64,${uri}`);
    } catch { /* silencioso */ }
  };

  const seleccionarImagen = async () => {
    const permisos = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permisos.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      if (asset.base64) {
        setImagenUri(asset.uri);
        setModo("imagen");
      }
    }
  };

  const guardarImagen = async () => {
    if (!imagenUri) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], base64: true, quality: 0.8 });
    if (!result.canceled && result.assets[0]?.base64) {
      await onFirmaReady(`data:image/png;base64,${result.assets[0].base64}`);
    } else if (imagenUri) {
      await onFirmaReady(imagenUri);
    }
  };

  const reset = () => { setModo("elegir"); limpiarCanvas(); setImagenUri(null); };

  const allPts = [...paths, currentPath];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.titulo}>Firma del aprendiz</Text>
            <Pressable onPress={() => { reset(); onClose(); }}><Feather name="x" size={24} color="#6b7280" /></Pressable>
          </View>

          {modo === "elegir" && (
            <View style={styles.elegirContainer}>
              <Text style={styles.elegirTexto}>¿Cómo deseas firmar?</Text>
              <Pressable style={styles.opcionGrande} onPress={() => setModo("dibujar")}>
                <View style={styles.opcionIcono}><Feather name="edit-3" size={28} color="#6366f1" /></View>
                <Text style={styles.opcionLabel}>Dibujar firma</Text>
                <Text style={styles.opcionDesc}>Dibuja con el dedo sobre la pantalla</Text>
              </Pressable>
              <Pressable style={styles.opcionGrande} onPress={seleccionarImagen}>
                <View style={styles.opcionIcono}><Feather name="image" size={28} color="#10b981" /></View>
                <Text style={styles.opcionLabel}>Subir imagen</Text>
                <Text style={styles.opcionDesc}>Selecciona una imagen de tu galería</Text>
              </Pressable>
            </View>
          )}

          {modo === "dibujar" && (
            <View style={{ flex: 1 }}>
              <View ref={canvasRef} style={styles.canvas} collapsable={false} {...panResponder.panHandlers}>
                {allPts.map((path, pi) =>
                  path.map((pt, idx) => {
                    if (idx === 0) return null;
                    return (
                      <View
                        key={`${pi}-${idx}`}
                        style={{
                          position: "absolute",
                          left: pt.x - 1.5,
                          top: pt.y - 1.5,
                          width: 3,
                          height: 3,
                          borderRadius: 1.5,
                          backgroundColor: "#111",
                        }}
                      />
                    );
                  })
                )}
                {paths.length === 0 && currentPath.length === 0 && (
                  <Text style={styles.canvasPlaceholder}>Dibuja tu firma aquí</Text>
                )}
              </View>
              <View style={styles.botonesRow}>
                <Pressable style={styles.btnSecundario} onPress={limpiarCanvas}><Text style={styles.btnSecundarioTexto}>Limpiar</Text></Pressable>
                <Pressable style={styles.btnSecundario} onPress={reset}><Text style={styles.btnSecundarioTexto}>Cambiar método</Text></Pressable>
                <Pressable
                  style={[styles.btnPrimario, (paths.length === 0 || loading) && { opacity: 0.5 }]}
                  disabled={paths.length === 0 || loading}
                  onPress={guardarDibujo}
                >
                  {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.btnPrimarioTexto}>Guardar</Text>}
                </Pressable>
              </View>
            </View>
          )}

          {modo === "imagen" && imagenUri && (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
              <Image source={{ uri: imagenUri }} style={styles.preview} resizeMode="contain" />
              <View style={[styles.botonesRow, { marginTop: 16 }]}>
                <Pressable style={styles.btnSecundario} onPress={reset}><Text style={styles.btnSecundarioTexto}>Cambiar</Text></Pressable>
                <Pressable
                  style={[styles.btnPrimario, loading && { opacity: 0.5 }]}
                  disabled={loading}
                  onPress={async () => { await onFirmaReady(imagenUri); }}
                >
                  {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.btnPrimarioTexto}>Confirmar</Text>}
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  container: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, height: "85%", padding: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  titulo: { fontSize: 18, fontWeight: "700", color: "#111" },

  elegirContainer: { flex: 1, justifyContent: "center", gap: 16 },
  elegirTexto: { fontSize: 16, fontWeight: "600", color: "#374151", textAlign: "center", marginBottom: 8 },
  opcionGrande: { backgroundColor: "#f9fafb", borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "#e5e7eb", alignItems: "center" },
  opcionIcono: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#eef2ff", justifyContent: "center", alignItems: "center", marginBottom: 10 },
  opcionLabel: { fontSize: 16, fontWeight: "600", color: "#111", marginBottom: 4 },
  opcionDesc: { fontSize: 13, color: "#6b7280", textAlign: "center" },

  canvas: { flex: 1, backgroundColor: "#fafafa", borderRadius: 12, borderWidth: 2, borderColor: "#d1d5db", borderStyle: "dashed", overflow: "hidden", justifyContent: "center", alignItems: "center" },
  canvasPlaceholder: { fontSize: 14, color: "#9ca3af" },

  preview: { width: "100%", height: 300, borderRadius: 12, backgroundColor: "#f3f4f6" },

  botonesRow: { flexDirection: "row", justifyContent: "center", gap: 12, paddingTop: 12 },
  btnPrimario: { backgroundColor: "#6366f1", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, minWidth: 100, alignItems: "center" },
  btnPrimarioTexto: { color: "#fff", fontWeight: "600", fontSize: 14 },
  btnSecundario: { backgroundColor: "#e5e7eb", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  btnSecundarioTexto: { color: "#374151", fontWeight: "600", fontSize: 14 },
});
