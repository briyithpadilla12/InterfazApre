import { Text, View, StyleSheet } from 'react-native';

export default function NotificacionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Esta es la vista de notificaciones</Text>
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
