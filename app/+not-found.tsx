import { View, StyleSheet, Text } from 'react-native';
import { Link, Stack } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops! Página no encontrada' ,
        headerShown: false
      }} />
      <View style={styles.container}>
        <Text style={styles.label} >Oops! Ruta no encontrada</Text>
        <Link href="/(tabs)/homeScreen" style={styles.button}>
          Vuelve a la página de inicio
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#3b60b5ff',
  },
  label:{
    marginBottom: 20,
    fontSize: 30,
    color: '#000000ff'
  }
});
