import { Feather } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {View , StyleSheet} from 'react-native'

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: true,
          headerTitle:'',
          drawerPosition: "left",
          drawerActiveTintColor: "#009e0f",
          drawerInactiveTintColor: "#7a7a7a",
          drawerLabelStyle: {
            fontSize: 16,
            fontWeight: "500",

          },
          headerStyle: { height: 60 },
          
          
          drawerStyle: {
            backgroundColor: "#ffffff",
            width: 240,
          },
          
        }}
      >
         <Drawer.Screen 
    name="(tabs)" 
    options={{ drawerLabel: "Inicio",
         drawerIcon: ({ color }) => (
            <Feather name="home"  color={color} size={24} />
          ),
     }} 
  />
  <Drawer.Screen 
    name="(drawer)/aboutScreen" 
    options={{ drawerLabel: "Sobre Nosotros" ,
         drawerIcon: ({ color }) => (
            <Feather name="info"  color={color}  size={24}/>
          ),
    }} 
  />
  <Drawer.Screen 
    name="(drawer)/configuracionScreen" 
    options={{ drawerLabel: "Configuración" ,
        drawerIcon: ({ color }) => (
            <Feather name="settings"  color={color} size={24} />
          ),
    }} 
  />
  <Drawer.Screen 
    name="(drawer)/diarioScreen" 
    options={{ drawerLabel: "Diario",
         drawerIcon: ({ color }) => (
            <Feather name="book"  color={color}  size={24}/>
          ),
     }} 
  />

   <Drawer.Screen 
    name="(drawer)/citasScreen" 
    options={{ drawerLabel: "Citas" ,
         drawerIcon: ({ color }) => (
            <Feather name="book-open"  color={color}  size={24}/>
          ),
    }} 
  />
  
  <Drawer.Screen name="+not-found"options={{drawerItemStyle: { display: "none" }}}/>

      </Drawer>
    </GestureHandlerRootView>
  );
}
