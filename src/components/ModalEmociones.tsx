import { useEmociones } from "@/src/context/emocionesContext";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface ModalEmocionesProps {
  visible: boolean;
  onClose: () => void;
  /** Códigos `emoCodigo` de la API (mismo catálogo que gestión de emociones). */
  seleccionadas: number[];
  onToggle: (emoCodigo: number) => void;
}

export default function ModalEmociones({
  visible,
  onClose,
  seleccionadas,
  onToggle,
}: ModalEmocionesProps) {
  const { emociones, cargando, error, recargar } = useEmociones();

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={estilos.superposicion}>
        <View style={estilos.contenedorModal}>
          <Text style={estilos.titulo}>¿Cómo te sientes hoy?</Text>

          {cargando ? (
            <ActivityIndicator size="large" color="#085394" style={{ marginVertical: 40 }} />
          ) : error ? (
            <View style={estilos.estadoVacio}>
              <Text style={estilos.textoError}>{error}</Text>
              <Pressable style={estilos.botonReintentar} onPress={() => void recargar()}>
                <Text style={estilos.textoBotonReintentar}>Reintentar</Text>
              </Pressable>
            </View>
          ) : emociones.length === 0 ? (
            <View style={estilos.estadoVacio}>
              <Text style={estilos.textoEstadoVacio}>
                No hay emociones activas en el sistema. Un administrador puede crearlas en gestión de emociones.
              </Text>
              <Pressable style={estilos.botonReintentar} onPress={() => void recargar()}>
                <Text style={estilos.textoBotonReintentar}>Actualizar lista</Text>
              </Pressable>
            </View>
          ) : (
            <ScrollView
              style={estilos.lista}
              contentContainerStyle={estilos.listaContenido}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {emociones.map((e) => {
                const seleccionada = seleccionadas.includes(e.emoCodigo);
                const colorFondo = e.emoColorFondo ?? "#f9fafb";
                const emoji = e.emoEmoji ?? "❓";
                return (
                  <Pressable
                    key={e.emoCodigo}
                    style={[
                      estilos.celda,
                      seleccionada && { backgroundColor: colorFondo },
                    ]}
                    onPress={() => onToggle(e.emoCodigo)}
                  >
                    <Text style={estilos.emoji}>{emoji}</Text>
                    <Text
                      style={[
                        estilos.textoEmocion,
                        seleccionada && estilos.textoSeleccionado,
                      ]}
                      numberOfLines={2}
                    >
                      {e.emoNombre.trim()}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

          <Pressable style={estilos.botonCerrar} onPress={onClose}>
            <Text style={estilos.textoBotonCerrar}>Listo</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  superposicion: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  contenedorModal: {
    width: "88%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    elevation: 8,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
    marginBottom: 14,
  },
  lista: {
    maxHeight: 380,
    marginBottom: 12,
  },
  listaContenido: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  celda: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  emoji: {
    fontSize: 22,
    marginRight: 8,
  },
  textoEmocion: {
    flex: 1,
    fontSize: 15,
    color: "#374151",
    fontWeight: "500",
  },
  textoSeleccionado: {
    color: "#111",
    fontWeight: "600",
  },
  botonCerrar: {
    backgroundColor: "#085394",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  textoBotonCerrar: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  estadoVacio: {
    paddingVertical: 24,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  textoEstadoVacio: {
    fontSize: 14,
    color: "#4b5563",
    textAlign: "center",
    lineHeight: 20,
  },
  textoError: {
    fontSize: 14,
    color: "#b91c1c",
    textAlign: "center",
    marginBottom: 12,
  },
  botonReintentar: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#e0f2fe",
  },
  textoBotonReintentar: {
    color: "#085394",
    fontSize: 15,
     fontWeight: "600",
  },
});
