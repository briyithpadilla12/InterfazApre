import Constants from "expo-constants";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ContactSupportScreen() {
  const version = Constants.expoConfig?.version;

  const handleEmail = () => {
    Linking.openURL("mailto:healthymindsoporte2@gmail.com");
  };

  const handleCall = () => {
    Linking.openURL("tel:018000910270");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        Si tienes algún inconveniente o necesitas ayuda, puedes comunicarte con
        nosotros a través de los siguientes canales:
      </Text>

      <View style={styles.section}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TouchableOpacity style={styles.button} onPress={handleEmail}>
          <Text style={styles.buttonText}>healthymindsoporte2@gmail.com
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Línea de atención</Text>
        <TouchableOpacity style={styles.button} onPress={handleCall}>
          <Text style={styles.buttonText}>018000 910 270</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Horario de atención</Text>
        <Text style={styles.text}>Lunes a viernes: 7:00 AM - 7:00 PM</Text>
        <Text style={styles.text}>Sábados: 8:00 AM - 1:00 PM</Text>
      </View>

      <Text style={styles.note}>
        Este canal está destinado a soporte técnico de la aplicación.
      </Text>

      <Text style={styles.version}>Versión {version ?? "-"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    
    backgroundColor: "#fff",
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
    color: "#555",
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    color: "#333",
  },
  button: {
    backgroundColor: "#085394",
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  note: {
    fontSize: 12,
    color: "#777",
    marginTop: 20,
  },
  version: {
    marginTop: 30,
    textAlign: "center",
    color: "#aaa",
  },
});
