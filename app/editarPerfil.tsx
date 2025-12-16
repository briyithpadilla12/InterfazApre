import { View, ActivityIndicator, Text } from "react-native";
import EditarPerfilCard from "@/src/components/EditarPerfilCard";
import { usePerfilViewModel } from "@/src/viewModels/perfilViewModel"


export default function EditarPerfilScreen() {
  const {
    perfil,
    cargando,
    error,
    actualizarCampo,
    guardarPerfil,
  } = usePerfilViewModel();

  if (cargando) return <ActivityIndicator />;
  if (error || !perfil) return <Text>Error al cargar perfil</Text>;

  return (
    <View style={{ padding: 20 }}>
             
      <EditarPerfilCard
      
        nombreCompleto={perfil.nombreCompleto}
        direccion={perfil.direccion}
        correoPersonal={perfil.correoPersonal}
        correoInstitucional={perfil.correoInstitucional}
        telefono={perfil.telefono}

        onCambiarDireccion={(v) => actualizarCampo("direccion", v)}
        onCambiarCorreoPersonal={(v) => actualizarCampo("correoPersonal", v)}
        onCambiarCorreoInstitucional={(v) =>
          actualizarCampo("correoInstitucional", v)
        }
        onCambiarTelefono={(v) => actualizarCampo("telefono", v)}

        onGuardar={guardarPerfil}
      />
    </View>
  );
}
