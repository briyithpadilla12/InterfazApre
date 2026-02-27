import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from 'expo-router';
import { useAuth } from "@/src/context/authContext";

export default function DrawerPersonalizado(props: any) {
  
    const { logout } = useAuth()
  
  
  const cerrarSesion = async () => {
    await logout();
    router.replace("/login");
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
          label="Citas"
          icon={({ color }) => <Feather name="book-open" color={color} size={24} />}
          onPress={() => router.push("/citasScreen")}
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
          label="Cerrar sesión"
          icon={() => <Feather name="log-out" color="#d9534f" size={24} />}
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
