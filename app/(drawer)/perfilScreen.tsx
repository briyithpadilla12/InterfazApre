import { View, ActivityIndicator, ScrollView,Text } from "react-native";
import PerfilCard from "../../src/components/PerfilCard";
import { usePerfilViewModel } from "../../src/viewModels/perfilViewModel";

export default function PerfilScreen() {
const { perfil, cargando } = usePerfilViewModel();

if (cargando) {
  return <ActivityIndicator />;
}

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
