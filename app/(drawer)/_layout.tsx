import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DrawerPersonalizado from "@/src/components/DrawerPersonalizado";
import { ChatNotificationsProvider } from "@/src/context/chatNotificationsContext";

export default function RootLayout() {
  return (
    <ChatNotificationsProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <DrawerPersonalizado {...props} />}
        screenOptions={{
          headerShown: true,
          headerTitle: "",
          drawerPosition: "left",
          drawerLabelStyle: { fontSize: 16, fontWeight: "500" },
          headerStyle: { height: 60 },
          drawerStyle: {
            backgroundColor: "#ffffff",
            width: 240,
          },
        }}
      >
        
      </Drawer>
    </GestureHandlerRootView>
    </ChatNotificationsProvider>
  );
}
