import { ScrollView, StyleSheet, Text, View } from "react-native";

const secciones = [
  {
    titulo: "1. IDENTIFICACIÓN DEL RESPONSABLE",
    contenido:
      "La presente Política de Privacidad regula el tratamiento de datos personales en la aplicación Healthy Mind, desarrollada para el SENA como parte de sus procesos de formación y bienestar. Responsable del tratamiento: Servicio Nacional de Aprendizaje - SENA.",
  },
  {
    titulo: "2. ALCANCE",
    contenido:
      "Esta política aplica a todas las personas que acceden y utilizan la aplicación Healthy Mind, la cual ofrece herramientas orientadas al bienestar emocional, tales como registro de usuario, diario personal, test o evaluaciones y contenido de apoyo emocional.",
  },
  {
    titulo: "3. DATOS QUE SE PUEDEN RECOLECTAR",
    contenido:
      "La aplicación puede solicitar información básica (nombre y correo electrónico), información de uso (interacciones y preferencias de navegación) e información relacionada con el bienestar emocional, como estados de ánimo, respuestas a actividades o test y contenido del diario personal, de forma voluntaria.",
  },
  {
    titulo: "4. FINALIDAD DEL USO DE LA INFORMACIÓN",
    contenido:
      "Los datos se utilizan para permitir el acceso y uso de la aplicación, brindar herramientas de seguimiento personal, ofrecer contenidos y recomendaciones acordes al usuario y mejorar continuamente la experiencia dentro de la plataforma.",
  },
  {
    titulo: "5. TRATAMIENTO DE LA INFORMACIÓN",
    contenido:
      "El tratamiento de los datos personales se realizará de manera responsable, segura y conforme a la normativa vigente en Colombia. El usuario decide de forma libre si desea compartir información dentro de la aplicación, especialmente aquella relacionada con su bienestar emocional.",
  },
  {
    titulo: "6. DERECHOS DEL USUARIO",
    contenido:
      "Como titular de sus datos, el usuario puede conocer la información que se tiene sobre él o ella, solicitar actualización o corrección, solicitar eliminación, revocar su autorización en cualquier momento y ser informado sobre el uso de sus datos.",
  },
  {
    titulo: "7. SEGURIDAD DE LA INFORMACIÓN",
    contenido:
      "El SENA adopta medidas de seguridad para proteger la información de los usuarios, evitando accesos no autorizados o usos indebidos.",
  },
  {
    titulo: "8. USO DE SERVICIOS EXTERNOS",
    contenido:
      "En caso de utilizar herramientas tecnológicas de apoyo, estas cumplirán con estándares adecuados de seguridad y protección de datos.",
  },
  {
    titulo: "9. CAMBIOS EN LA POLÍTICA",
    contenido:
      "Esta política podrá actualizarse cuando sea necesario. Se recomienda a los usuarios revisarla periódicamente.",
  },
  {
    titulo: "10. CONTACTO",
    contenido:
      "Para consultas relacionadas con el tratamiento de datos personales, el usuario podrá comunicarse a través de los canales oficiales del SENA.",
  },
];

export default function PoliticaPrivacidadScreen() {
  return (
    <ScrollView style={styles.pantalla} contentContainerStyle={styles.contenido}>
      <View style={styles.bloqueEncabezado}>
        <Text style={styles.etiqueta}>Aplicación: Healthy Mind</Text>
        <Text style={styles.titulo}>
          Política de privacidad y tratamiento de datos personales
        </Text>
        <Text style={styles.descripcion}>
          Aquí se explica qué datos pueden recopilarse, cómo se usan y cuáles son
          tus derechos como titular de la información.
        </Text>
      </View>

      {secciones.map((seccion) => (
        <View key={seccion.titulo} style={styles.tarjeta}>
          <Text style={styles.tituloSeccion}>{seccion.titulo}</Text>
          <Text style={styles.texto}>{seccion.contenido}</Text>
        </View>
      ))}
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
  bloqueEncabezado: {
    backgroundColor: "#E7F0FF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#D0E2FF",
  },
  etiqueta: {
    color: "#085394",
    fontWeight: "600",
    marginBottom: 4,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0C3D78",
    marginBottom: 8,
  },
  descripcion: {
    fontSize: 14,
    lineHeight: 21,
    color: "#1E3A5F",
  },
  tarjeta: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E6ECF5",
  },
  tituloSeccion: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0B4F8A",
    marginBottom: 6,
  },
  texto: {
    fontSize: 14,
    lineHeight: 22,
    color: "#334155",
  },
});
