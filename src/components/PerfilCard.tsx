import { Perfil } from "@/src/models/perfil";
import { View, Text, StyleSheet} from "react-native"

interface Props extends Perfil {}

export default function PerfilCard(props: Props) {
  const {
    nombre,
    rol,
    programa,
    correoPersonal,
    correoSena,
    numeroID,
    direccion,
    municipio,
    telefono,
  } = props;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>

      <View style={styles.card}>
        <View style={styles.infoSection}>
          <Text style={styles.name}>{nombre}</Text>
          <Text style={styles.role}>{rol}</Text>
          <Text style={styles.program}>{programa}</Text>

          <Text style={styles.item}>{correoPersonal}</Text>
          <Text style={styles.item}>{correoSena}</Text>
          <Text style={styles.item}>{numeroID}</Text>
          <Text style={styles.item}>{direccion}</Text>
          <Text style={styles.item}>{municipio}</Text>

          <View style={styles.separator} />

          <Text style={styles.phone}>Cel. {telefono}</Text>
        </View>
      </View>
    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  title: {
    fontSize: 22,
    color: "#085394",
    fontWeight: "bold",
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    alignItems: "center",
  },

  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },

  avatar: {
    width: 45,
    height: 45,
  },

  infoSection: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#085394",
    marginBottom: 4,
  },

  role: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
  },

  program: {
    fontSize: 14,
    color: "#444",
    marginBottom: 10,
  },

  item: {
    fontSize: 13,
    color: "#333",
    marginBottom: 2,
  },

  separator: {
    width: "90%",
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 10,
  },

  phone: {
    fontSize: 14,
    color: "#085394",
    fontWeight: "bold",
    marginTop: 5,
  },
});
