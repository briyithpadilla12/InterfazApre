import { View, ActivityIndicator, ScrollView } from "react-native";
import PerfilCard from "../../src/components/PerfilCard";
import { usePerfilViewModel } from "../../src/viewModels/perfilViewModel";

export default function PerfilScreen() {
  const { perfil, cargando } = usePerfilViewModel();

  if (cargando || !perfil) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#085394" />
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <PerfilCard
        nombre={perfil.nombre}
        rol={perfil.rol}
        programa={perfil.programa}
        correoPersonal={perfil.correoPersonal}
        correoSena={perfil.correoSena}
        numeroID={perfil.numeroID}
        direccion={perfil.direccion}
        municipio={perfil.municipio}
        telefono={perfil.telefono}
      />
    </ScrollView>
  );
}
