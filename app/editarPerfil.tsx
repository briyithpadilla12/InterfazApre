import { Text, View, TextInput, StyleSheet, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePerfilViewModel } from "@/src/viewModels/perfilViewModel";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function EditarPerfilScreen() {
  const router = useRouter();

  // CAMBIO: uso exactamente tu ViewModel real
  const { perfil, cargando, actualizarCampo, actualizarPerfil, recargarPerfil } =
    usePerfilViewModel();

  useFocusEffect(
    useCallback(() => {
      if (!perfil) recargarPerfil();
    }, [])
  );

  if (cargando && !perfil)
    return (
      <SafeAreaView style={styles.wrapper} edges={["top", "left", "right"]}>
        <ActivityIndicator size="large" color="#085394" />
      </SafeAreaView>
    );

  if (!perfil)
    return (
      <SafeAreaView style={styles.wrapper} edges={["top", "left", "right"]}>
        <ActivityIndicator size="large" color="#085394" />
      </SafeAreaView>
    );

  const handleGuardar = async () => {
    // CAMBIO: en tu ViewModel la función se llama actualizarPerfil, no guardarPerfil
    console.log("Botón guardar presionado");
    await actualizarPerfil();
    router.replace("/(drawer)/perfilScreen");
  };

  return (
    <SafeAreaView style={styles.wrapper} edges={["top", "left", "right"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.field}>
            <Text style={styles.label}>Nombre completo</Text>
            <TextInput
              style={styles.input}
              value={perfil.nombreCompleto}
              onChangeText={(v) => actualizarCampo("nombreCompleto", v)}
              // CAMBIO: ahora se conecta directo al ViewModel
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Documento</Text>
            <TextInput
              style={styles.input}
              value={perfil.numeroDocumento}
              editable={false}
              // CAMBIO: antes usaba nombreCompleto, ahora uso el campo correcto del perfil
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={styles.input}
              value={perfil.telefono}
              keyboardType="phone-pad"
              onChangeText={(v) => actualizarCampo("telefono", v)}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Dirección</Text>
            <TextInput
              style={styles.input}
              value={perfil.direccion}
              onChangeText={(v) => actualizarCampo("direccion", v)}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Fecha de nacimiento</Text>
            <TextInput
              style={styles.input}
              value={perfil.fechaNacimiento}
              editable={false}
              // CAMBIO: antes usaba nombreCompleto
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>EPS</Text>
            <TextInput
              style={styles.input}
              value={perfil.eps}
              onChangeText={(v) => actualizarCampo("eps", v)}
              // CAMBIO: ahora usa el campo real eps del perfil
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Correo personal</Text>
            <TextInput
              style={styles.input}
              value={perfil.correoPersonal}
              keyboardType="email-address"
              onChangeText={(v) => actualizarCampo("correoPersonal", v)}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Correo Institucional</Text>
            <TextInput
              style={styles.input}
              value={perfil.correoInstitucional}
              keyboardType="email-address"
              onChangeText={(v) =>
                actualizarCampo("correoInstitucional", v)
              }
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 10,
              marginBottom: 15,
            }}
          >
            <Pressable onPress={handleGuardar}>
              <Text style={{ color: "blue", fontSize: 20 }}>
                Guardar
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.replace("/(drawer)/perfilScreen")}
            >
              <Text style={{ color: "red", fontSize: 20 }}>
                Cancelar
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    backgroundColor: "#f9fafb",
    color: "#111827",
  },
});