import { View, Text, Pressable, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
  },
  chipSeleccionado: {
    backgroundColor: "#085394",
    borderColor: "#085394",
  },
  textoChip: {
    fontSize: 14,
    color: "#4b5563",
    fontWeight: "500",
  },
  textoChipSeleccionado: {
    color: "#fff",
  },
});

interface SelectorEmocionesProps {
  emociones: string[];
  seleccionadas: string[];
  onToggle: (emocion: string) => void;
}

export default function SelectorEmociones({
  emociones,
  seleccionadas,
  onToggle,
}: SelectorEmocionesProps) {
  return (
    <View style={styles.contenedor}>
      {emociones.map((emocion) => {
        const seleccionada = seleccionadas.includes(emocion);
        return (
          <Pressable
            key={emocion}
            style={[styles.chip, seleccionada && styles.chipSeleccionado]}
            onPress={() => onToggle(emocion)}
          >
            <Text
              style={[
                styles.textoChip,
                seleccionada && styles.textoChipSeleccionado,
              ]}
            >
              {emocion}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
