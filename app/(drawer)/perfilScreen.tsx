import { View, ActivityIndicator, ScrollView, Text, StyleSheet } from "react-native";
import PerfilCard from "@/src/components/PerfilCard";
import { usePerfilViewModel } from "@/src/viewModels/perfilViewModel";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function PerfilScreen() {
  const { perfil, cargando, error, recargarPerfil } = usePerfilViewModel();
  console.log("[DEBUG PerfilScreen] render - perfil:", perfil ? "presente" : "null", "| cargando:", cargando, "| error:", error);

  useFocusEffect(
    useCallback(() => {
      console.log("[DEBUG PerfilScreen] useFocusEffect - llamando recargarPerfil");
      recargarPerfil();
    }, [])
  );

  if (cargando && !perfil) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#085394" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  if (error && !perfil) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorHint}>
          Verifica tu conexión e intenta de nuevo.
        </Text>
      </View>
    );
  }

  if (!perfil) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No se pudo cargar el perfil</Text>
      </View>
    );
  }

  console.log("[DEBUG PerfilScreen] Renderizando PerfilCard con:", {
    nombreCompleto: perfil.nombreCompleto,
    correoPersonal: perfil.correoPersonal,
  });

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <PerfilCard
        nombreCompleto={perfil.nombreCompleto}
        telefono={perfil.telefono}
        correoPersonal={perfil.correoPersonal}
        correoInstitucional={perfil.correoInstitucional}
        tipoDocumento={perfil.tipoDocumento}
        numeroDocumento={perfil.numeroDocumento}
        direccion={perfil.direccion}
        fechaNacimiento={perfil.fechaNacimiento}
        estadoAprendiz={perfil.estadoAprendiz}
        eps={perfil.eps}
        acudienteNombre={perfil.acudienteNombre}
        acudienteApellido={perfil.acudienteApellido}
        acudienteTelefono={perfil.acudienteTelefono}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#dc2626",
    textAlign: "center",
    marginBottom: 8,
  },
  errorHint: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
