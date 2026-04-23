import Accordion from "@/src/components/AcordionConfi";
import ModalEliCuenta from "@/src/components/ModalEliCuenta";
import { useAuth } from "@/src/context/authContext";
import perfilAprendizServicio from "@/src/services/perfilService";
import { obtenerUserIdDesdeToken } from "@/src/utils/jwt";
import Feather from "@expo/vector-icons/Feather";
import { Link, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

function mensajeErrorEliminar(err: unknown): string {
  const ax = err as { response?: { data?: unknown }; message?: string };
  if (ax.message === "Network Error" || ax.message?.includes?.("timeout")) {
    return "Sin conexión. Revisa tu internet e intenta de nuevo.";
  }
  const data = ax.response?.data;
  if (typeof data === "string" && data.trim()) return data;
  if (data && typeof data === "object" && "message" in data) {
    const m = (data as { message?: unknown }).message;
    if (typeof m === "string" && m.trim()) return m;
  }
  return "No se pudo dar de baja la cuenta. Intenta de nuevo más tarde.";
}

export default function ConfiguracionScreen() {
  const router = useRouter();
  const { token, logout } = useAuth();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const manejarConfirmarEliminacion = useCallback(async (razonEliminacion: string) => {
    const razon = razonEliminacion.trim();
    if (!razon) {
      Alert.alert(
        "Razón requerida",
        "Debes escribir una razón de baja. Es obligatoria para registrar la inactivación."
      );
      return;
    }

    if (!token) {
      Alert.alert("Sesión", "No hay sesión activa.");
      return;
    }
    const userId = obtenerUserIdDesdeToken(token);
    if (!userId) {
      Alert.alert("Error", "No se pudo identificar tu cuenta.");
      return;
    }

    setEliminando(true);
    try {
      const perfil = await perfilAprendizServicio.obtenerPerfil(userId);
      const documento = perfil.numeroDocumento?.trim() ?? "";
      if (!documento) {
        Alert.alert(
          "Datos incompletos",
          "No se encontró tu número de documento en el perfil. Complétalo en «Editar información personal» e intenta de nuevo."
        );
        return;
      }
      await perfilAprendizServicio.cambiarEstadoCuentaPorDocumento(documento, razon);
      await logout();
      setMostrarModal(false);
      router.replace("/");
    } catch (err) {
      Alert.alert("Error", mensajeErrorEliminar(err));
    } finally {
      setEliminando(false);
    }
  }, [token, logout, router]);

  return (
   <ScrollView>
  <View style={styles.container}>
    <Text style={styles.title}>Configuración</Text>

    <Accordion
      title="Perfil"
      icon={<Feather name="user" size={24} color="#085394" />}
    >
      <Link href="/editarPerfil" ><Text>Editar información personal</Text></Link>
        <View>
      <Pressable onPress={() => setMostrarModal(true)}>
        <Text>Eliminar cuenta</Text>
      </Pressable>

      <ModalEliCuenta
        visible={mostrarModal}
        onClose={() => setMostrarModal(false)}
        onConfirmar={manejarConfirmarEliminacion}
        cargando={eliminando}
      />
    </View>
    </Accordion>

    <Accordion
      title="Privacidad y seguridad"
      icon={<Feather name="shield" size={24} color="#085394" />}
    >
      <Link href="/cambiarContra" ><Text>Cambiar contraseña</Text></Link>
    </Accordion>

    

    <Accordion
      title="Soporte y ayuda"
      icon={<Feather name="help-circle" size={24} color="#085394" />}
    >
      <Link href="/preguntas-frecuentes" ><Text>Preguntas frecuentes</Text></Link>
      <Link href="/contactar-soporte" ><Text>Contactar soporte</Text></Link>
      <Link href="/reportar-problema" ><Text>Reportar problema</Text></Link>
      <Link href="/tutorial-app" ><Text>Tutorial de la app</Text></Link>
    </Accordion>

    <Accordion
      title="Información de la app"
      icon={<Feather name="file-text" size={24} color="#085394" />}
    >
      <Link href="/politica-privacidad" ><Text>Políticas de privacidad</Text></Link>
      <Link href="/terminos-condiciones" ><Text>Términos y condiciones</Text></Link>
 
    </Accordion>

  </View>
</ScrollView>


  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    color: "#085394",
    fontWeight: "bold",
    marginBottom: 12,
  },
  text: {
    color: '#0f0d0dff',
  },
});
