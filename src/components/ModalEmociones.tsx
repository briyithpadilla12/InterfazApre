import { EMOCIONES_DIARIO } from "@/src/constants/emocionesDiario";
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
  seleccionadas: string[];
  onToggle: (emocion: string) => void;
}

export default function ModalEmociones({
  visible,
  onClose,
  seleccionadas,
  onToggle,
}: ModalEmocionesProps) {
  const { emociones, cargando } = useEmociones();

  const items = emociones.length > 0
    ? emociones.map((e) => ({
        id: e.emoCodigo,
        texto: e.emoNombre,
        emoji: e.emoEmoji ?? "❓",
        colorFondo: e.emoColorFondo ?? "#f9fafb",
      }))
    : EMOCIONES_DIARIO.map((e, i) => ({
        id: i + 1,
        texto: e.texto,
        emoji: e.emoji,
        colorFondo: e.colorFondo,
      }));

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
          ) : (
            <ScrollView
              style={estilos.lista}
              contentContainerStyle={estilos.listaContenido}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {items.map((item) => {
                const seleccionada = seleccionadas.includes(item.texto);
                return (
                  <Pressable
                    key={item.id}
                    style={[
                      estilos.celda,
                      seleccionada && { backgroundColor: item.colorFondo },
                    ]}
                    onPress={() => onToggle(item.texto)}
                  >
                    <Text style={estilos.emoji}>{item.emoji}</Text>
                    <Text
                      style={[
                        estilos.textoEmocion,
                        seleccionada && estilos.textoSeleccionado,
                      ]}
                      numberOfLines={1}
                    >
                      {item.texto}
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
    marginBottom: 16,
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
    paddingHorizontal: 12,
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
    fontSize: 16,
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
});
