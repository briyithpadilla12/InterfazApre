import {  View, StyleSheet, ActivityIndicator } from 'react-native';
import MiCitaCard from '../../src/components/MiscitasCard';
import { useCitasViewModel } from '../../src/viewModels/citasViewModels';


export default function CitasScreen() {
  const { citas, cargando, colorEstado } = useCitasViewModel();

  

  if (cargando || !citas) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#085394" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MiCitaCard
        fecha={citas.fecha}
        psicologo={citas.psicologo}
        estado={citas.estado}
        colorEstado={colorEstado}
      />
    </View>
  );
}
