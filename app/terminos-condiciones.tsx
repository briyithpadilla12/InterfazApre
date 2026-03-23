import { ScrollView, StyleSheet, Text, View } from "react-native";

const secciones = [
  {
    titulo: "1. OBJETO",
    contenido:
      "Los presentes Términos y Condiciones regulan el acceso y uso de la aplicación Healthy Mind, desarrollada para el SENA como una herramienta orientada al bienestar emocional de sus usuarios. El uso de la aplicación implica la aceptación de estos términos.",
  },
  {
    titulo: "2. NATURALEZA DE LA APLICACIÓN",
    contenido:
      "Healthy Mind es una aplicación diseñada para apoyar el bienestar emocional de los usuarios, ofreciendo espacios como registro de emociones, diario personal y actividades o contenidos de apoyo. Además, facilita la comunicación con profesionales de bienestar de la entidad.",
  },
  {
    titulo: "3. USO ADECUADO DE LA APLICACIÓN",
    contenido:
      "El usuario se compromete a utilizar la aplicación de manera responsable, proporcionar información veraz, no realizar acciones que afecten el funcionamiento de la plataforma y no suplantar la identidad de otras personas.",
  },
  {
    titulo: "4. REGISTRO Y ACCESO",
    contenido:
      "Para acceder a ciertas funcionalidades, el usuario deberá registrarse proporcionando información básica. El usuario es responsable de mantener la confidencialidad de sus datos de acceso y de notificar cualquier uso no autorizado de su cuenta.",
  },
  {
    titulo: "5. RESPONSABILIDAD SOBRE EL CONTENIDO",
    contenido:
      "El usuario es responsable de la información que registre dentro de la aplicación, incluyendo el contenido del diario personal y las respuestas a actividades. El SENA podrá intervenir en caso de detectar usos inadecuados que afecten la seguridad o el propósito de la plataforma.",
  },
  {
    titulo: "6. ALCANCE DE LA HERRAMIENTA",
    contenido:
      "Healthy Mind brinda a los usuarios un espacio personal para el seguimiento de sus emociones y acceso a herramientas y contenidos de apoyo. También facilita el acercamiento con profesionales de bienestar del SENA, de acuerdo con la disponibilidad del servicio. La aplicación es un complemento al acompañamiento brindado por la entidad. En situaciones que requieran atención inmediata, se recomienda contactar las líneas oficiales de atención del SENA.",
  },
  {
    titulo: "7. DISPONIBILIDAD DEL SERVICIO",
    contenido:
      "El SENA procurará mantener la aplicación disponible; sin embargo, no garantiza que el servicio esté libre de interrupciones o errores.",
  },
  {
    titulo: "8. PROPIEDAD INTELECTUAL",
    contenido:
      "Todos los contenidos de la aplicación, incluyendo diseño, estructura, textos y funcionalidades, son propiedad del SENA o se utilizan con autorización. No está permitido reproducir, distribuir o modificar estos contenidos sin autorización previa.",
  },
  {
    titulo: "9. SUSPENSIÓN O TERMINACIÓN DEL ACCESO",
    contenido:
      "El SENA podrá suspender o limitar el acceso a la aplicación en caso de incumplimiento de estos términos o por uso indebido de la plataforma.",
  },
  {
    titulo: "10. MODIFICACIONES",
    contenido:
      "Estos términos podrán ser actualizados en cualquier momento. Se recomienda a los usuarios revisarlos periódicamente.",
  },
  {
    titulo: "11. RELACIÓN CON LA POLÍTICA DE PRIVACIDAD",
    contenido:
      "El uso de la aplicación también está sujeto a la Política de Privacidad, donde se explica cómo se recopila y utiliza la información del usuario.",
  },
  {
    titulo: "12. CONTACTO",
    contenido:
      "Para dudas o inquietudes relacionadas con el uso de la aplicación, el usuario podrá comunicarse a través de los canales oficiales del SENA.",
  },
];

export default function TerminosCondicionesScreen() {
  return (
    <ScrollView style={styles.pantalla} contentContainerStyle={styles.contenido}>
      <View style={styles.bloqueEncabezado}>
        <Text style={styles.etiqueta}>Aplicación: Healthy Mind</Text>
        <Text style={styles.titulo}>Términos y condiciones de uso</Text>
        <Text style={styles.descripcion}>
          Este documento establece las reglas para el uso responsable de la
          aplicación y la relación con el acompañamiento brindado por el SENA.
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
