import { useAuth } from "@/src/context/authContext";
import { Feather } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function DrawerPersonalizado(props: any) {
  const { logout } = useAuth();
  const [cerrandoSesion, setCerrandoSesion] = useState(false);

  const cerrarSesion = async () => {
    if (cerrandoSesion) return;
    setCerrandoSesion(true);
    try {
      await logout();
      router.replace("/");
    } finally {
      setCerrandoSesion(false);
    }
  };
  

  return (
    <View style={{ flex: 1 }}>
      
      <DrawerContentScrollView {...props}>
        <DrawerItem
          label="Inicio"
          icon={({ color }) => <Feather name="home" color={color} size={24} />}
          onPress={() => router.push("/homeScreen")}
        />
      
        <DrawerItem
          label="Diario"
          icon={({ color }) => <Feather name="book" color={color} size={24} />}
          onPress={() => router.push("/diarioScreen")}
        />
       

        <DrawerItem
          label="Tests"
          icon={({ color }) => <Feather name="clipboard" color={color} size={24} />}
          onPress={() => router.push("/testsScreen")}
        />
        <DrawerItem
          label="Mi Seguimiento"
          icon={({ color }) => <Feather name="activity" color={color} size={24} />}
          onPress={() => router.push("/seguimientoScreen")}
        />

         <DrawerItem
  label="Configuración"
  icon={({ color }) => (
    <Feather name="settings" color={color} size={24} />
  )}
  onPress={() => router.push('/configuracionScreen')}
/>

         <DrawerItem
          label="Sobre Nosotros"
          icon={({ color }) => <Feather name="info" color={color} size={24} />}
          onPress={() => router.push("/aboutScreen")}
        />
      </DrawerContentScrollView>

    
      <View style={styles.footer}>
        <DrawerItem
          label="Perfil"
          icon={({ color }) => <Feather name="user" color={color} size={24} />}
          onPress={() => router.push("/perfilScreen")}
        />

        <DrawerItem
          label={cerrandoSesion ? "Cerrando sesión..." : "Cerrar sesión"}
          icon={() =>
            cerrandoSesion ? (
              <ActivityIndicator size="small" color="#d9534f" />
            ) : (
              <Feather name="log-out" color="#d9534f" size={24} />
            )
          }
          onPress={cerrarSesion}
         
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    marginBottom: 20,
  },
});
