import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import style from "@/src/components/Styles";

export default function DiarioScreen() {
  const router = useRouter();
  // Por ahora: estado vacío. Después aquí irán las páginas del diario.
  const [paginasDelDiario] = useState<unknown[]>([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const tienePaginas = paginasDelDiario.length > 0;

  return (
    <View style={style.container}>
      <Text style={style.title}>Diario</Text>

      {/* Barra de búsqueda por fecha */}
      <View style={styles.contenedorBusqueda}>
        <Feather name="calendar" size={20} color="#9ca3af" style={styles.iconoBusqueda} />
        <TextInput
          style={styles.inputBusqueda}
          placeholder="Buscar por fecha (ej: 12/03/2026)"
          placeholderTextColor="#9ca3af"
          value={textoBusqueda}
          onChangeText={setTextoBusqueda}
        />
      </View>

      <ScrollView
        style={styles.contenido}
        contentContainerStyle={tienePaginas ? undefined : styles.contenidoCentrado}
        showsVerticalScrollIndicator={false}
      >
        {!tienePaginas && (
          <View style={styles.bloqueBienvenida}>
            <View style={styles.contenedorIcono}>
              <Feather name="book-open" size={48} color="#6b7280" />
            </View>
            <Text style={styles.tituloBienvenida}>¡Bienvenido a tu Diario!</Text>
            <Text style={styles.textoBienvenida}>
              Este es tu espacio personal para expresar tus pensamientos, emociones y experiencias diarias.
            </Text>
            <Text style={styles.textoBienvenida}>
              Toca el botón + para crear una nueva página de diario.
            </Text>
          </View>
        )}
        {/* Aquí después irán las cards cuando tengaPaginas sea true */}
      </ScrollView>

      {/* Botón flotante para crear página (lógica después) */}
      <Pressable
        style={styles.botonFlotante}
        onPress={() => router.push("/nuevaPaginaDiario")}
      >
        <Feather name="plus" size={28} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedorBusqueda: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  iconoBusqueda: {
    marginRight: 10,
  },
  inputBusqueda: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111",
  },
  contenido: {
    flex: 1,
  },
  contenidoCentrado: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  bloqueBienvenida: {
    alignItems: "center",
  },
  contenedorIcono: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  tituloBienvenida: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4b5563",
    textAlign: "center",
    marginBottom: 12,
  },
  textoBienvenida: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 8,
  },
  botonFlotante: {
    position: "absolute",
    bottom: 48,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#085394",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
});
