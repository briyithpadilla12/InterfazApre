import MensajeCard from '@/src/components/MensajeCard';
import useMensajesViewModels from '@/src/viewModels/mensajesViewModels';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function MensajesScreen() {

    const { mensajes, cargar  } = useMensajesViewModels()

    if(cargar || !mensajes){
         return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="large" color="#085394" />
            </View>
          );
    }

  return (
  
    <MensajeCard
      nombre ={mensajes.nombre}
      fecha = {mensajes.fecha}
      mensaje = {mensajes?.mensaje}
      id = {mensajes.id}
    />
  );
}

const styles = StyleSheet.create({

  text: {
    color: '#0f0d0dff',
  },
});
