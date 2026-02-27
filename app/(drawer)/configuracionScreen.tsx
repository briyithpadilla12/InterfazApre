import { Link } from 'expo-router';
import { Text, View, StyleSheet , Pressable} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Feather from '@expo/vector-icons/Feather';
import Accordion from '@/src/components/AcordionConfi';
import ModalEliCuenta from "@/src/components/ModalEliCuenta";
import React, { useState } from "react";

export default function ConfiguracionScreen() {

   const [mostrarModal , setMostrarModal] = useState(false)
  return (
   <ScrollView>
  <View style={styles.container}>
    <Text style={styles.title}>Configuración</Text>

    <Accordion
      title="Perfil"
      icon={<Feather name="user" size={24} color="#085394" />}
    >
      <Link href="/editarPerfil" ><Text>Editar información personal</Text></Link>
        <View>
      <Pressable onPress={() => setMostrarModal(true)}>
        <Text>Eliminar cuenta</Text>
      </Pressable>

      <ModalEliCuenta
        visible={mostrarModal}
        onClose={() => setMostrarModal(false)}
      />
    </View>
    </Accordion>

    <Accordion
      title="Privacidad y seguridad"
      icon={<Feather name="shield" size={24} color="#085394" />}
    >
      <Link href="/cambiarContra" ><Text>Cambiar contraseña</Text></Link>
    </Accordion>

    <Accordion
      title="Notificaciones"
      icon={<Feather name="bell" size={24} color="#085394" />}
    >
      <Link href="/" ><Text>Sonido y vibración</Text></Link>
    </Accordion>

    <Accordion
      title="Soporte y ayuda"
      icon={<Feather name="help-circle" size={24} color="#085394" />}
    >
      <Link href="/" ><Text>Preguntas frecuentes</Text></Link>
      <Link href="/" ><Text>Contactar soporte</Text></Link>
      <Link href="/" ><Text>Tutorial de la app</Text></Link>
    </Accordion>

    <Accordion
      title="Información de la app"
      icon={<Feather name="file-text" size={24} color="#085394" />}
    >
      <Link href="/" ><Text>Políticas de privacidad</Text></Link>
      <Link href="/" ><Text>Términos y condiciones</Text></Link>
      <Link href="/" ><Text>Versión de la aplicación</Text></Link>
    </Accordion>

  </View>
</ScrollView>


  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    color: "#085394",
    fontWeight: "bold",
    marginBottom: 12,
  },
  text: {
    color: '#0f0d0dff',
  },
});
