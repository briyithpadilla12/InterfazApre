import { AuthProvider, useAuth } from "@/src/context/authContext";
import { EmocionesProvider } from "@/src/context/emocionesContext";
import { Stack, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

function RootNavigation() {
  const { token, cargando } = useAuth();
  const router = useRouter();
  const redirectDone = useRef(false);

  useEffect(() => {
    if (!cargando && token && !redirectDone.current) {
      redirectDone.current = true;
      router.replace("/comprobandoPerfil");
    }
    if (!token) {
      redirectDone.current = false;
    }
  }, [token, cargando, router]);

  if (cargando) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="comprobandoPerfil" options={{ headerShown: false }} />
      <Stack.Screen name="completarDatos" options={{ headerShown: false }} />
      <Stack.Screen name="asignarFicha" options={{ headerShown: false }} />
      <Stack.Screen
        name="terminos-condiciones"
        options={{ headerShown: true, title: "Términos y condiciones", headerTintColor: "#085394", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="politica-privacidad"
        options={{ headerShown: true, title: "Política de privacidad", headerTintColor: "#085394" , headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="preguntas-frecuentes"
        options={{ headerShown: true, title: "Preguntas frecuentes" , headerTintColor: "#085394" , headerTitleAlign: "center"}}
      />
      <Stack.Screen
        name="contactar-soporte"
        options={{ headerShown: true, title: "Contactar soporte", headerTintColor: "#085394" , headerTitleAlign: "center" }}
      />
        <Stack.Screen
        name="reportar-problema"
        options={{ headerShown: true, title: "Reportar problema", headerTintColor: "#085394" , headerTitleAlign: "center"}}
      />
      <Stack.Screen
        name="cambiarContra"
        options={{ headerShown: true, title: "Cambiar contraseña", headerTintColor: "#085394", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="editarPerfil"
        options={{ headerShown: true, title: "Editar perfil", headerTintColor: "#085394" , headerTitleAlign: "center"}}
      />
      <Stack.Screen
        name="tutorial-app"
        options={{ headerShown: true, title: "Tutorial de la app", headerTintColor: "#085394", headerTitleAlign: "center" }}
      />
      <Stack.Screen name="(drawer)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <EmocionesProvider>
          <RootNavigation />
        </EmocionesProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}