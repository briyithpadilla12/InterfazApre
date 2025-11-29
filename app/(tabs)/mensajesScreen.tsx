import { Text, View, StyleSheet } from 'react-native';

export default function MensajesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Esta es la vista de mensajes</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#0f0d0dff',
  },
});
