import React from "react";
import { Modal, StyleSheet, Text, Pressable, View } from "react-native";

interface ModalEliCuentaProps {
  visible: boolean;
  onClose: () => void;
}

export default function ModalEliCuenta({
  visible,
  onClose,
}: ModalEliCuentaProps) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.fondo}>
        <View style={styles.modal}>

          <Text style={styles.titulo}>¿Eliminar cuenta?</Text>

          <Text style={styles.descripcion}>
            Esta acción no se puede deshacer. Se eliminarán permanentemente:
          </Text>

          <View style={styles.lista}>
            <Text style={styles.item}>• Tu perfil y datos personales</Text>
            <Text style={styles.item}>• Historial de conversaciones</Text>
            <Text style={styles.item}>• Registros del diario emocional</Text>
            <Text style={styles.item}>• Todas las configuraciones</Text>
          </View>

          <View style={styles.contenedorBotones}>
            <Pressable style={styles.botonCancelar} onPress={onClose}>
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </Pressable>

            <Pressable style={styles.botonEliminar} onPress={onClose}>
              <Text style={styles.textoEliminar}>Eliminar</Text>
            </Pressable>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 22,
    elevation: 6,
  },

  titulo: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
    color: "#111827",
  },

  descripcion: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 12,
    textAlign: "center",
  },

  lista: {
    marginBottom: 20,
  },

  item: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
  },

  contenedorBotones: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  botonCancelar: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingVertical: 12,
    borderRadius: 10,
    marginRight: 10,
    alignItems: "center",
  },

  textoCancelar: {
    color: "#374151",
    fontWeight: "500",
  },

  botonEliminar: {
    flex: 1,
    backgroundColor: "#E11D48",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  textoEliminar: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
