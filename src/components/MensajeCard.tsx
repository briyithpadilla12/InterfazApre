import style from "@/src/components/Styles";
import Feather from '@expo/vector-icons/Feather';
import { StyleSheet, Text, View } from "react-native";
import { Mensajes } from "../models/mensajes";

interface Props extends Mensajes {}

export default function MensajeCard({ nombre, mensaje, fecha }: Props) {
  return (
    <View style={style.container}>

             <Text style={style.title}>Mensajes</Text>
    <View style={styles.card}>
   
    
      <View style={styles.row}>
        
   
        <View style={styles.avatar}>
          <Feather name="user" size={22} color="white" />
        </View>

      
        <View style={styles.info}>
       
          <View style={styles.nameRow}>
            <Text style={styles.name}>{nombre}</Text>
            <Text style={styles.time}>{fecha}</Text>
          </View>

      
          <Text numberOfLines={1} style={styles.message}>
            {mensaje}
          </Text>

        </View>

      
        <View style={styles.badge}>
          <Text style={styles.badgeText}>1</Text>
        </View>

      </View>
    </View>
    </View>
  
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 16,
    marginVertical: 8,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
    backgroundColor: "#0A66C2",
    justifyContent: "center",
    alignItems: "center",
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    fontWeight: "bold",
    fontSize: 16,
  },

  time: {
    fontSize: 13,
    color: "gray",
  },

  message: {
    color: "#555",
    marginTop: 2,
  },

  subText: {
    color: "#777",
    fontSize: 12,
    marginTop: 3,
  },

  badge: {
    backgroundColor: "#0A66C2",
    width: 22,
    height: 22,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
