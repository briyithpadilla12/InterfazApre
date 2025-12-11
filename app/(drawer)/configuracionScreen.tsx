import { Link } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Feather from '@expo/vector-icons/Feather';
import Accordion from '@/src/components/AcordionConfi';

export default function ConfiguracionScreen() {
  return (
   <ScrollView>
  <View style={styles.container}>
    <Text style={styles.title}>Configuración</Text>

    <Accordion
      title="Perfil"
      icon={<Feather name="user" size={24} color="#085394" />}
    >
      <Link href="/" ><Text>Editar información personal</Text></Link>
      <Link href="/"><Text>Eliminar cuenta</Text></Link>
    </Accordion>

    <Accordion
      title="Privacidad y seguridad"
      icon={<Feather name="shield" size={24} color="#085394" />}
    >
      <Link href="/" ><Text>Cambiar contraseña</Text></Link>
    </Accordion>

    <Accordion
      title="Notificaciones"
      icon={<Feather name="bell" size={24} color="#085394" />}
    >
      <Link href="/" ><Text>Sonido y vibración</Text></Link>
    </Accordion>

    <Accordion
      title="Preferencias"
      icon={<Feather name="sliders" size={24} color="#085394" />}
    >
      <Text>Tema (claro — oscuro)</Text>
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
