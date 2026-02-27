import { Stack } from "expo-router";
import { useAuth } from "@/src/context/authContext";
import { AuthProvider } from "@/src/context/authContext";

function RootNavigation() {
  const { token, cargando } = useAuth();

  if (cargando) {
    return null; 
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {token === null ? (
        <Stack.Screen name="index" />
      ) : (
        <Stack.Screen name="(drawer)" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}