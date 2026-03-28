import { useEffect, useRef } from "react";
import { Stack, useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuth } from "@/src/context/authContext";
import { AuthProvider } from "@/src/context/authContext";
import { EmocionesProvider } from "@/src/context/emocionesContext";

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
      {token === null ? (
        <>
          <Stack.Screen name="index" />
          <Stack.Screen
            name="terminos-condiciones"
            options={{ headerShown: true, title: "Términos y condiciones" }}
          />
          <Stack.Screen
            name="politica-privacidad"
            options={{ headerShown: true, title: "Política de privacidad" }}
          />
          <Stack.Screen
            name="preguntas-frecuentes"
            options={{ headerShown: true, title: "Preguntas frecuentes" }}
          />
          <Stack.Screen
            name="contactar-soporte"
            options={{ headerShown: true, title: "Contactar soporte" }}
          />
          <Stack.Screen
            name="cambiarContra"
            options={{ headerShown: true, title: "Cambiar contraseña" }}
          />
          <Stack.Screen
            name="editarPerfil"
            options={{ headerShown: true, title: "Editar perfil" }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="comprobandoPerfil" options={{ headerShown: false }} />
          <Stack.Screen name="completarDatos" options={{ headerShown: false }} />
          <Stack.Screen name="asignarFicha" options={{ headerShown: false }} />
          <Stack.Screen
            name="terminos-condiciones"
            options={{ headerShown: true, title: "Términos y condiciones" }}
          />
          <Stack.Screen
            name="politica-privacidad"
            options={{ headerShown: true, title: "Política de privacidad" }}
          />
          <Stack.Screen
            name="preguntas-frecuentes"
            options={{ headerShown: true, title: "Preguntas frecuentes" }}
          />
          <Stack.Screen
            name="contactar-soporte"
            options={{ headerShown: true, title: "Contactar soporte" }}
          />
          <Stack.Screen
            name="cambiarContra"
            options={{ headerShown: true, title: "Cambiar contraseña" }}
          />
          <Stack.Screen
            name="editarPerfil"
            options={{ headerShown: true, title: "Editar perfil" }}
          />
          <Stack.Screen name="(drawer)" />
        </>
      )}
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