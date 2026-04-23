import Accordion from "@/src/components/AcordionConfi";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const preguntas = [
  {
    pregunta: "1. ¿Qué es Healthy Mind?",
    respuesta:
      "Healthy Mind es una aplicación desarrollada para el SENA que busca apoyar el bienestar emocional de los usuarios mediante herramientas como el diario personal, actividades de reflexión y acceso a profesionales de bienestar.",
  },
  {
    pregunta: "2. ¿La aplicación reemplaza la atención de un psicólogo?",
    respuesta:
      "No. Healthy Mind es una herramienta de apoyo que complementa el acompañamiento brindado por los profesionales de bienestar. Si necesitas atención directa o inmediata, puedes comunicarte a través de las líneas oficiales del SENA.",
  },
  {
    pregunta: "3. ¿Cómo puedo comunicarme con un profesional de bienestar?",
    respuesta:
      "Dentro de la aplicación encontrarás opciones para establecer contacto con profesionales del SENA, según la disponibilidad del servicio.",
  },
  {
    pregunta: "4. ¿La información que registro es privada?",
    respuesta:
      "Sí. La información que ingresas en la aplicación es tratada de manera confidencial y protegida por el SENA, conforme a la normativa vigente.",
  },
  {
    pregunta: "5. ¿Es obligatorio compartir información personal o emocional?",
    respuesta:
      "No. Puedes usar la aplicación y decidir qué información deseas compartir. El registro de datos relacionados con tu bienestar es completamente voluntario.",
  },
  {
    pregunta: "6. ¿Puedo eliminar mi información?",
    respuesta:
      "Sí. Puedes solicitar la eliminación de tus datos en cualquier momento, de acuerdo con tus derechos como usuario.",
  },
  {
    pregunta: "7. ¿Qué hago si olvidé mi contraseña?",
    respuesta:
      "Puedes utilizar la opción de recuperación de contraseña disponible en la pantalla de inicio de sesión.",
  },
  {
    pregunta: "8. ¿La aplicación tiene algún costo?",
    respuesta:
      "No. Healthy Mind es una herramienta gratuita ofrecida por el SENA.",
  },
  {
    pregunta: "9. ¿Qué hago si la aplicación no funciona correctamente?",
    respuesta:
      "Puedes intentar cerrar y volver a abrir la aplicación. Si el problema continúa, se recomienda reportarlo a través de los canales oficiales del SENA.",
  },
  {
    pregunta: "10. ¿Dónde puedo consultar los términos y la política de privacidad?",
    respuesta:
      "Dentro de la aplicación encontrarás la sección \"Información de la app\", donde podrás acceder a Términos y Condiciones y a la Política de Privacidad.",
  },
];

export default function PreguntasFrecuentesScreen() {
  return (
    <ScrollView style={styles.pantalla} contentContainerStyle={styles.contenido}>
      <View style={styles.encabezado}>
        <Text style={styles.descripcion}>
          Encuentra respuestas rápidas sobre el uso de Healthy Mind y el alcance
          del acompañamiento ofrecido.
        </Text>
      </View>

      <View style={styles.lista}>
        {preguntas.map((item) => (
          <View key={item.pregunta} style={styles.tarjeta}>
            <Accordion title={item.pregunta}>
              <Text style={styles.respuesta}>{item.respuesta}</Text>
            </Accordion>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: "#F4F8FF",
  },
  contenido: {
    padding: 16,

    paddingBottom: 30,
  },
  encabezado: {
    backgroundColor: "#E7F0FF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#D0E2FF",
  },
  descripcion: {
    fontSize: 14,
    lineHeight: 21,
    color: "#1E3A5F",
  },
  lista: {
    gap: 10,
  },
  tarjeta: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E6ECF5",
  },
  respuesta: {
    fontSize: 14,
    lineHeight: 22,
    color: "#334155",
    paddingRight: 4,
  },
});
