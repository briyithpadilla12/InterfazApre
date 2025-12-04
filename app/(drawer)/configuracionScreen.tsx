import { Text, View, StyleSheet } from 'react-native';

export default function ConfiguracionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración</Text>
    </View>
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
