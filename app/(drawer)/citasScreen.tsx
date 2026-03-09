import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable } from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { useCitasViewModel } from "@/src/viewModels/citasViewModels";

import { ModalSolicitarCita } from "@/src/components/ModalSolicitarCita";

export default function MiCitaCard() {

  const {
    citas,
    cargando,
    obtenerColorEstado,
    CancelarSolicitud,
    cargandoCancelar,
    SolicitarCita,
    errorEnvioCita,
    exitoEnvioCita,
    cargandoEnvioCita,
  } = useCitasViewModel();
  const [abrirModal , setAbrirModal] = useState(false)
  
 
  if (cargando) {
    return (
      <View style={styles.container}>
        <Text>Cargando citas...</Text>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Mis Citas</Text>
        <Text style={styles.subtitle}>
          Gestiona tus citas con psicólogos
        </Text>

        {citas.length > 0 ? (
          citas.map((item, index) => {
            const color = obtenerColorEstado(item.citEstadoCita);
            return (
              <View key={index} style={styles.card}>
                <View style={styles.row}>
                  <MaterialIcons name="event" size={22} color="#4b5563" />
                  <Text style={styles.label}>
                    <Text style={styles.bold}>Fecha:</Text>{" "}
                    {item.citFechaProgramada ?? "----"}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Feather name="user" size={22} color="#4b5563" />
                  <Text style={styles.label}>
                    <Text style={styles.bold}>Psicólogo de ficha:</Text>{" "}
                    {item.psicologo?.psiNombre ?? "—"}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Feather name="check-circle" size={22} color="#767676" />
                  <Text style={styles.label}>
                    <Text style={styles.bold}>Estado:</Text>
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: color + "20" }]}>
                    <Text style={[styles.statusText, { color }]}>
                      {item.citEstadoCita}
                    </Text>
                  </View>
                </View>

                {item.citEstadoCita?.toLowerCase() === "pendiente" &&
                  item.citId != null && (
                    <Pressable
                      style={styles.botonCancelar}
                      onPress={() => CancelarSolicitud(item.citId!)}
                      disabled={cargandoCancelar === item.citId}
                    >
                      {cargandoCancelar === item.citId ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.textoBotonCancelar}>Cancelar solicitud</Text>
                      )}
                    </Pressable>
                  )}
              </View>
            );
          })
        ) : (
          <Text style={styles.sinCitas}>No tienes citas registradas</Text>
        )}
      </ScrollView>

      <Pressable
        style={styles.botonFlotante}
        onPress={() => setAbrirModal(true)}
      >
        <Feather name="plus" size={28} color="#fff" />
        <Text style={styles.botonFlotanteTexto}>Solicitar cita</Text>
      </Pressable>

      <ModalSolicitarCita
        visible={abrirModal}
        onClose={() => setAbrirModal(false)}
        onSolicitar={SolicitarCita}
        errorEnvioCita={errorEnvioCita}
        exitoEnvioCita={exitoEnvioCita}
        cargandoEnvioCita={cargandoEnvioCita}
      />
    </View>
  );
}





const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
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
    marginBottom: 30,
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
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },

  statusText: {
    fontWeight: "600",
    fontSize: 14,
  },

  botonCancelar: {
    backgroundColor: "#dc2626",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: "flex-start",
  },

  textoBotonCancelar: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  sinCitas: {
    color: "#6b7280",
    marginTop: 8,
  },
  botonFlotante: {
    position: "absolute",
    bottom: 24,
    right: 20,
    backgroundColor: "#085394",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  botonFlotanteTexto: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
  },
});