import { Link } from "expo-router";
import { Pressable, Text, TextInput, View, StyleSheet } from "react-native";

export default function CambiarContraseña() {
  return (
    <View style={styles.contenedor}>
      

      <View style={styles.cajaInformativa}>
        <Text style={styles.textoInformativo}>
          Por tu seguridad, necesitamos verificar tu contraseña actual antes de establecer una nueva.
        </Text>
      </View>

      <Text style={styles.etiqueta}>Contraseña actual</Text>
      <TextInput
        placeholder="Ingresa tu contraseña actual"
        placeholderTextColor="#9CA3AF"
        style={styles.input}
        secureTextEntry
      />

      <Text style={styles.etiqueta}>Nueva contraseña</Text>
      <TextInput
        placeholder="Mínimo 8 caracteres"
        placeholderTextColor="#9CA3AF"
        style={styles.input}
        secureTextEntry
      />

      <Text style={styles.etiqueta}>Confirmar nueva contraseña</Text>
      <TextInput
        placeholder="Repite la nueva contraseña"
        placeholderTextColor="#9CA3AF"
        style={styles.input}
        secureTextEntry
      />

    <Link asChild href={"/configuracionScreen"}>
      <Pressable style={styles.boton}>
        <Text style={styles.textoBoton}>Cambiar contraseña</Text>
      </Pressable></Link>

    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 30,
  },

  cajaInformativa: {
    backgroundColor: "#E8F1FF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
  },

  textoInformativo: {
    color: "#1F3A8A",
    fontSize: 14,
    lineHeight: 20,
  },

  etiqueta: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 18,
    color: "#111827",
  },

  boton: {
    backgroundColor: "#8FB3D9",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  textoBoton: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
