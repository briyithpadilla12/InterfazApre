import { useEffect, useRef } from "react";
import { Stack, useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuth } from "@/src/context/authContext";
import { AuthProvider } from "@/src/context/authContext";

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
        <Stack.Screen name="index" />
      ) : (
        <>
          <Stack.Screen name="comprobandoPerfil" options={{ headerShown: false }} />
          <Stack.Screen name="completarDatos" options={{ headerShown: false }} />
          <Stack.Screen name="asignarFicha" options={{ headerShown: false }} />
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
        <RootNavigation />
      </AuthProvider>
    </SafeAreaProvider>
  );
}