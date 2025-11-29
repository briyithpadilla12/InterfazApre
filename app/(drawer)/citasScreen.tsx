import { Text, View, StyleSheet } from 'react-native';
import MiCitaCard from '../../src/components/MiscitasCard';


export default function CitasScreen() {
  return (
      <View style={{ flex: 1 }}>
      <MiCitaCard
        fecha="27 de noviembre, 10:00 am"
        psicologo="Juana Pérez"
        estado="Confirmada"
      />
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
