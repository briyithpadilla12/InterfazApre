import { ScrollView, StyleSheet, Text, View } from "react-native";

const secciones = [
  {
    titulo: "1. Primera impresión: partes de la pantalla",
    contenido: [
      "Cuando entres a la app con tu cuenta verás, en general, tres maneras de moverte:",
      "• Arriba a la izquierda, el menú de tres rayas (☰). Desde ahí abres secciones como Inicio, Diario, pruebas, seguimiento, configuración, etc.",
      "• Abajo de la pantalla, una barra con iconos (Inicio, Citas, Mensajes, Notificaciones). Es un atajo para esas secciones sin abrir el menú.",
      "• A veces verás una barra con título arriba (por ejemplo “Términos y condiciones” o “Cambiar contraseña”). Eso indica que estás en una pantalla informativa o de ajuste; con Atrás o el gesto de volver regresas a donde estabas.",
      "En la práctica solo recuerda: menú a un lado, accesos rápidos abajo y, a veces, un título fijo arriba.",
    ],
  },
  {
    titulo: "2. Si aún no tienes cuenta: regístrate",
    contenido: [
      "1. En la pantalla de inicio, toca “Regístrate” (o el enlace que veas para crear cuenta).",
      "2. Rellena los datos que pida la app (documento, correo, contraseña, etc.).",
      "3. Cuando termine el registro con éxito, la app te guiará a verificar tu cuenta (por ejemplo con un código que debe llegar a tu correo). No te saltes este paso, es muy importante para la activación de tu cuenta.",
      "4. Después podrás iniciar sesión con tu correo y contraseña.",
      "Qué pasa al iniciar sesión: si el correo o la contraseña no son correctos, la app te avisará. Si todo va bien, puede aparecer un mensaje mientras se comprueba que tu perfil esté completo y, si aplica, que tengas ficha. Tú no tienes que saber un paso oculto: la app te guía sola.",
    ],
  },
  {
    titulo: "3. La primera vez que entras: datos y ficha",
    contenido: [
      "Después de entrar, la app pide lo siguiente en un orden lógico:",
      "1. Completar tu información (contacto, ciudad, datos del acudiente, etc.). Cuando acabes, usa el botón “Guardar y continuar”.",
      "2. Elegir o vincularte a una ficha de formación (programa, centro, etc., según lo que muestre la pantalla). Al finalizar con éxito, irás a la pantalla de Inicio.",
      "3. Si tu perfil y ficha ya estaban al día, pasarás directo al Inicio.",
      "Si la app te dice que falta tu documento o que algo no cuadra, lee el mensaje y, si pide que vuelvas a entrar, cierra e inicia sesión otra vez.",
    ],
  },
  {
    titulo: "4. Inicio: qué haces ahí",
    contenido: [
      "En Inicio suelen mostrarse tarjetas o bloques informativos (avisos, contenidos, etc.). Al tocar una tarjeta, se abre más detalle, según el contenido.",
      "El mismo Inicio se abre desde el menú (☰) o desde el icono de Inicio de la barra de abajo: es el mismo sitio.",
    ],
  },
  {
    titulo: "5. Barra de abajo: para qué sirve cada cosa",
    contenido: [
      "• Citas — Consultar o atender tus citas.",
      "• Mensajes — Tu bandeja de mensajes; desde ahí puedes abrir una conversación siempre que tengas una (los mensajes son iniciados por el psicólogo).",
      "• Notificaciones — Avisos. Si no hay nada, la lista sale vacía.",
    ],
  },
  {
    titulo: "6. Menú de tres rayas: qué hay dentro",
    contenido: [
      "• Inicio — Página principal con tarjetas.",
      "• Diario — Tu diario: escribir, leer, editar, borrar entradas; a veces puedes añadir emociones o una imagen. Si al borrar pide confirmación, léela.",
      "• Tests — Cuestionarios o evaluaciones que te toque hacer.",
      "• Mi seguimiento — Información o seguimiento vinculado a tu proceso.",
      "• Configuración — Ajustes, ayuda y textos legales (ver sección 8).",
      "• Sobre nosotros — Información del proyecto o la entidad.",
      "Abajo del menú suelen ir:",
      "• Perfil — Ver o acceder a tu información personal.",
      "• Cerrar sesión — Sales de la cuenta y vuelves a la pantalla de inicio de sesión. Tendrás que volver a entrar con correo y contraseña cuando quieras usar de nuevo la app en tu dispositivo.",
    ],
  },
  {
    titulo: "7. Un poco más sobre el diario",
    contenido: [
      "Puedes crear una entrada nueva, leer lo que guardaste, editar o eliminar (la app siempre pide confirmar el borrado). Cada entrada corresponde a un día o a un texto tuyo, según la uses tú.",
    ],
  },
  {
    titulo: "8. Configuración: en qué tocas para qué",
    contenido: [
      "Dentro de Configuración suelen haber secciones que se abren o cierran. En la práctica:",
      "• Editar tu información — Cambiar datos personales que la app permita modificar.",
      "• Dejar de usar la cuenta / dar de baja — Proceso serio. Te pide un motivo. Tras aceptar, se aplican las reglas de la institución. Se cierra la sesión y para volver a hacer uso de tu cuenta nuevamente, debes registrarte.",
      "• Cambiar contraseña — Pantalla para poner la contraseña actual y la nueva.",
      "• Ayuda, contacto, reportar un problema — Preguntas frecuentes, canales de soporte o formulario para contar un fallo.",
      "• Términos y privacidad — Textos legales para leer con calma.",
      "• Tutorial — Abre esta guía.",
    ],
  },
  {
    titulo: "9. Internet, errores y salir",
    contenido: [
      "• Si no hay conexión o el servicio no responde, la app te lo dirá; a veces podrás reintentar.",
      "• Cerrar sesión = salir de tu cuenta en este teléfono hasta la próxima vez que inicies sesión.",
      "• Dar de baja la cuenta es distinto, con pasos y mensajes que debes leer en pantalla.",
    ],
  },
  {
    titulo: "10. Uso en pocos pasos (resumen)",
    contenido: [
      "1. Creas cuenta (si aplica) y verificas lo que pida la entidad; luego inicias sesión.",
      "2. Completas datos y ficha la primera vez que te lo pida la app.",
      "3. Usas Inicio y la barra de abajo en el día a día.",
      "4. Abres el menú (☰) para Diario, Tests, Seguimiento y Configuración.",
      "5. Cierras sesión al terminar, sobre todo si compartes el dispositivo o por costumbre de seguridad.",
    ],
  },
];

export default function TutorialAppScreen() {
  return (
    <ScrollView style={styles.pantalla} contentContainerStyle={styles.contenido}>
      <View style={styles.bloqueEncabezado}>
        <Text style={styles.etiqueta}>Cómo usar Healthy Mind</Text>
        <Text style={styles.descripcion}>
          Guía sencilla para el aprendiz. Aquí sabrás qué puedes hacer en la app,
          dónde está cada cosa y qué sucede cuando sigues un paso.
        </Text>
      </View>

      {secciones.map((seccion) => (
        <View key={seccion.titulo} style={styles.tarjeta}>
          <Text style={styles.tituloSeccion}>{seccion.titulo}</Text>
          {seccion.contenido.map((parrafo) => (
            <Text key={`${seccion.titulo}-${parrafo}`} style={styles.texto}>
              {parrafo}
            </Text>
          ))}
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
    fontWeight: "700",
    marginBottom: 6,
    fontSize: 16,
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
    marginBottom: 8,
  },
  texto: {
    fontSize: 14,
    lineHeight: 22,
    color: "#334155",
    marginBottom: 6,
  },
});
