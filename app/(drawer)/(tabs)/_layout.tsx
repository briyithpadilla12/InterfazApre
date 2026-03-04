import { Tabs } from 'expo-router';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

import Feather from '@expo/vector-icons/Feather';


export default function TabLayout() {
    
  return (
    <Tabs
      initialRouteName="homeScreen"
      screenOptions={{
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#009e0f',
            headerStyle: {
      backgroundColor: '#fff',
    },
    headerShadowVisible: false,
    headerShown: false,
    tabBarStyle: {
      backgroundColor: '#085394',
    }
    
      }}
    >
       <Tabs.Screen
        name="homeScreen"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => (
            <Feather name='home' color={color} size={24} />
          ),
        }}
      />
    
      <Tabs.Screen
        name="calendarioScreen"
        options={{
          title: 'Calendario',
          tabBarIcon: ({ color }) => (
           <Feather name= 'calendar' color={color} size={24} />
          ),
        }}
      />

      <Tabs.Screen
      name="mensajesScreen"
      options={{
        title: 'Mensajes',
        tabBarIcon : ({color}) => (
       <Feather name= 'message-circle' color={color} size={24} />
        ),
      }}/>

    <Tabs.Screen
    name="notificacionScreen"
    options={{
      title: 'Notificaciones',
      tabBarIcon: ({color}) =>(
        <Feather name= 'bell' color={color} size={24} />
      )
        ,
    }}/>

 <Tabs.Screen
    name="[id]"
    options={{
     tabBarItemStyle: {display : "none"} }}/>
    </Tabs>
  );
}
