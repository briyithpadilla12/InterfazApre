import { Text, View, TextInput, StyleSheet , Button} from "react-native";
import { Link } from "expo-router";
import Feather from '@expo/vector-icons/Feather';

interface Props {
  nombreCompleto: string;
  direccion: string;
  correoPersonal: string;
  correoInstitucional : string
  telefono : string

  onCambiarDireccion: (valor: string) => void;
  onCambiarCorreoPersonal: (valor: string) => void;
  onCambiarCorreoInstitucional: (valor: string) => void;
  onCambiarTelefono: (valor: string) => void;
  onGuardar: () => void;
}

export default function EditarPerfilCard({
  nombreCompleto,
  direccion,
  correoPersonal,
  correoInstitucional,
  telefono,
  onCambiarDireccion,
  onCambiarCorreoPersonal,
  onCambiarCorreoInstitucional,
  onCambiarTelefono,
  onGuardar
  
}: Props) {
  return (
    <View style={styles.card}>
       <Link href={"/(drawer)/perfilScreen"} style={{ alignSelf: "flex-end" }} asChild>

            <Feather name="arrow-left-circle" size={30} color="#085394"    />
            </Link>
      <View style={styles.field}>
        <Text style={styles.label}>Nombre completo</Text>
        <TextInput
          style={styles.input}
          value={nombreCompleto}
          editable={false}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Dirección</Text>
        <TextInput
          style={styles.input}
          value={direccion}
          onChangeText={onCambiarDireccion}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Correo personal</Text>
        <TextInput
          style={styles.input}
          value={correoPersonal}
          keyboardType="email-address"
          onChangeText={onCambiarCorreoPersonal}
        />
      </View>

       <View style={styles.field}>
        <Text style={styles.label}>Correo Institucional</Text>
        <TextInput
          style={styles.input}
          value={correoInstitucional}
          keyboardType="email-address"
          onChangeText={onCambiarCorreoInstitucional}
        />
      </View>

       <View style={styles.field}>
        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          value={telefono}
          keyboardType="email-address"
          onChangeText={onCambiarTelefono}
        />
      </View>
      <Button title="Guardar" onPress={onGuardar} />
    </View>
  );
}


const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    backgroundColor: "#f9fafb",
    color: "#111827",
  },
});
