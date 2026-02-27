import { View, ActivityIndicator, ScrollView,Text } from "react-native";
import PerfilCard from "@/src/components/PerfilCard";
import { usePerfilViewModel } from "@/src/viewModels/perfilViewModel";

import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';


export default function PerfilScreen() {
const { perfil, cargando, recargarPerfil  } = usePerfilViewModel();

if (cargando) {
  return <ActivityIndicator />;
}
 console.log("perfil:", perfil)


if (!perfil) {
  return <Text>No se pudo cargar el perfil</Text>;
}


return <PerfilCard
  nombreCompleto={perfil.nombreCompleto}
  telefono={perfil.telefono}
  correoPersonal={perfil.correoPersonal}
  correoInstitucional={perfil.correoInstitucional}
  numeroDocumento={perfil.numeroDocumento}
  direccion={perfil.direccion}
  
/>;



}
