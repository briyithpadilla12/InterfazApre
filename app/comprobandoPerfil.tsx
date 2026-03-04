import { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/context/authContext";
import { obtenerUserIdDesdeToken } from "@/src/utils/jwt";
import perfilAprendizServicio from "@/src/services/perfilService";
import { perfilRequiereCompletar } from "@/src/utils/perfilCompleto";

export default function ComprobandoPerfilScreen() {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace("/");
      return;
    }

    const verificar = async () => {
      const userId = obtenerUserIdDesdeToken(token);
      if (!userId) {
        router.replace("/(drawer)/(tabs)/homeScreen");
        return;
      }
      try {
        const perfil = await perfilAprendizServicio.obtenerPerfil(userId);
        if (perfilRequiereCompletar(perfil) && perfil.numeroDocumento) {
          console.log("[DEBUG ComprobandoPerfil] Perfil incompleto, redirigiendo a completarDatos con documento:", perfil.numeroDocumento);
          router.replace({
            pathname: "/completarDatos",
            params: { documento: perfil.numeroDocumento },
          });
        } else {
          router.replace("/(drawer)/(tabs)/homeScreen");
        }
      } catch {
        router.replace("/(drawer)/(tabs)/homeScreen");
      }
    };

    verificar();
  }, [token, router]);

  return (
    <View style={styles.contenedor}>
      <ActivityIndicator size="large" color="#085394" />
      <Text style={styles.texto}>Verificando tu perfil...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  texto: {
    fontSize: 16,
    color: "#555",
  },
});
