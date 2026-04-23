import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface ModalEliCuentaProps {
  visible: boolean;
  onClose: () => void;
  /** Razón obligatoria en API (RazonEliminacion). */
  onConfirmar: (razonEliminacion: string) => void | Promise<void>;
  cargando?: boolean;
}

export default function ModalEliCuenta({
  visible,
  onClose,
  onConfirmar,
  cargando = false,
}: ModalEliCuentaProps) {
  const [razon, setRazon] = useState("");

  useEffect(() => {
    if (visible) setRazon("");
  }, [visible]);

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={cargando ? undefined : onClose}
    >
      <View style={styles.fondo}>
        <View style={styles.modal}>
        <Text style={styles.titulo}>¿Eliminar cuenta?</Text>

          <Text style={styles.descripcion}>
            Tu cuenta dejará de estar activa y no podrás iniciar sesión con ella.
         .
          </Text>

          <View style={styles.lista}>
          <Text style={styles.item}>• Tu perfil y datos personales</Text>
            <Text style={styles.item}>• Historial de conversaciones</Text>
            <Text style={styles.item}>• Registros del diario emocional</Text>
            <Text style={styles.item}>• Todas las configuraciones</Text>
          </View>

          <Text style={styles.labelRazon}>Razón de la eliminación (obligatoria)</Text>
          <TextInput
            style={styles.inputRazon}
            placeholder="Ej.: Ya no usaré la aplicación"
            placeholderTextColor="#9ca3af"
            value={razon}
            onChangeText={setRazon}
            editable={!cargando}
            multiline
            maxLength={500}
            textAlignVertical="top"
          />

          <View style={styles.contenedorBotones}>
            <Pressable
              style={[styles.botonCancelar, cargando && styles.botonDeshabilitado]}
              onPress={onClose}
              disabled={cargando}
            >
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </Pressable>

            <Pressable
              style={[styles.botonEliminar, cargando && styles.botonDeshabilitado]}
              onPress={() => void onConfirmar(razon.trim())}
              disabled={cargando}
            >
              {cargando ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.textoEliminar}>Eliminar</Text>
              )}
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
    marginBottom: 14,
  },

  labelRazon: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },

  inputRazon: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#111827",
    minHeight: 72,
    marginBottom: 18,
    backgroundColor: "#f9fafb",
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

  botonDeshabilitado: {
    opacity: 0.65,
  },
});
