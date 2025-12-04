import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { Citas } from "../models/citas";
interface Props extends Citas {
  colorEstado: string
}

export default function MiCitaCard(prop: Props) {
  const {
    fecha,
    psicologo,
    estado,
    colorEstado

  } = prop;



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Citas</Text>
      <Text style={styles.subtitle}>Gestiona tus citas con psicólogos</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <MaterialIcons name="event" size={22} color="#4b5563" />
          <Text style={styles.label}>
            <Text style={styles.bold}>Fecha:</Text> {fecha}
          </Text>
        </View>


        <View style={styles.row}>
          <Feather name="user" size={22} color="#4b5563" />
          <Text style={styles.label}>
            <Text style={styles.bold}>Psicólogo de ficha:</Text> {psicologo}
          </Text>
        </View>

        <View style={styles.row}>
          <Feather name="check-circle" size={22} color="#767676ff" />
          <Text style={styles.label}>
            <Text style={styles.bold}>Estado:</Text>
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: colorEstado + '20' }]}>
            <Text style={[styles.statusText, { color: colorEstado }]}>
              {estado}
            </Text>
          </View>

        </View>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    color: "#085394",
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: "#374151",
    marginLeft: 10,
  },
  bold: {
    fontWeight: "600",
  },
  statusBadge: {
    marginLeft: 10,
    backgroundColor: "#dcfce7",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: "#22c55e",
    fontWeight: "600",
    fontSize: 14,
  },
});
