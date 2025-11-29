import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

function CustomDrawerContent(props: any) {
  const { state, navigation } = props;
  const currentRoute = state.routeNames[state.index];

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
     
        <DrawerItem
          label="Inicio"
          icon={({ color }) => <Feather name="home" color={color} size={24} />}
          onPress={() => navigation.navigate("(tabs)")}
        />
        <DrawerItem
          label="Sobre Nosotros"
          icon={({ color }) => <Feather name="info" color={color} size={24} />}
          onPress={() => navigation.navigate("(drawer)/aboutScreen")}
        />
        <DrawerItem
          label="Configuración"
          icon={({ color }) => <Feather name="settings" color={color} size={24} />}
          onPress={() => navigation.navigate("(drawer)/configuracionScreen")}
        />
        <DrawerItem
          label="Diario"
          icon={({ color }) => <Feather name="book" color={color} size={24} />}
          onPress={() => navigation.navigate("(drawer)/diarioScreen")}
        />
        <DrawerItem
          label="Citas"
          icon={({ color }) => <Feather name="book-open" color={color} size={24} />}
          onPress={() => navigation.navigate("(drawer)/citasScreen")}
        />

        <View style={styles.separator} />

     
        <View style={styles.bottomSection}>
          <DrawerItem
            label="Perfil"
            icon={({ color }) => <Feather name="user" color={color} size={24} />}
            onPress={() => console.log("Navegar a perfil")}
          />
          <DrawerItem
            label="Cerrar sesión"
            icon={({ color }) => <Feather name="log-out" color="#d9534f" size={24} />}
            onPress={() => console.log("Cerrar sesión")}
          />
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  bottomSection: {
    marginTop: 10,
  },
});

export default CustomDrawerContent;
