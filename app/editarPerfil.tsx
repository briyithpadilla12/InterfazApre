import { View, ActivityIndicator, Text } from "react-native";
import EditarPerfilCard from "@/src/components/EditarPerfilCard";
import { usePerfilViewModel } from "@/src/viewModels/perfilViewModel"
import { useRouter } from "expo-router";


export default function EditarPerfilScreen() {
  const router = useRouter();

  const {
    perfil,
    cargando,
    actualizarCampo,
    guardarPerfil,
  } = usePerfilViewModel();

  if (cargando || perfil === null) return <ActivityIndicator />;

  const handleGuardar = async () => {
    await guardarPerfil();
    router.replace("/(drawer)/perfilScreen");
  };


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
        onGuardar={handleGuardar}
      />
    </View>
  );
}
