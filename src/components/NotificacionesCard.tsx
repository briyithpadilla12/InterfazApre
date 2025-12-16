import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Notificacion } from "../models/notificaciones";
import Feather from '@expo/vector-icons/Feather';


interface Props {
  notificacion: Notificacion;
  onEliminar: (id: number) => void;
}

export default function NotificacionCard({ notificacion, onEliminar }: Props) {
  return (
    
    <View style={styles.card}>
         
      <Text style={styles.titulo}>{notificacion.titulo}</Text>
      <Text>{notificacion.mensaje}</Text>
      <Text style={styles.fecha}>{notificacion.fecha}</Text>

      <TouchableOpacity
  style={styles.boton}
  onPress={() => onEliminar(notificacion.id)}
>
  <Feather name="trash-2" size={20} color="red" />
</TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f0f0f0ff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  titulo: {
    fontWeight: "bold",
    fontSize: 16,
  },
  fecha: {
    fontSize: 12,
    color: "#777",
    marginTop: 5,
  },
  boton: {
    marginTop: 10,
    alignSelf: "flex-end",
  },
  textoBoton: {
    color: "red",
    fontWeight: "bold",
  },
});
