import { Modal, StyleSheet, Text, Pressable, View, TextInput, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRecuperarContraViewModel } from "../viewModels/recuperarcontra";

interface ModalRecuperarContraProps {
  visible: boolean;
  onClose: () => void;
}

export default function ModalRecuperarContra({
  visible,
  onClose,
}: ModalRecuperarContraProps) {

  const {
    recuperarContra,
    cargando,
    error,
    exito
  } = useRecuperarContraViewModel();

  const [correoElectronico, setCorreoElectronico] = useState("");

  const manejarBoton = async () => {
    await recuperarContra( correoElectronico);
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={estilos.superposicion}>

        <View style={estilos.contenedorModal}>

          <Text style={estilos.titulo}>
            Recuperar contraseña
          </Text>

          <Text style={estilos.etiqueta}>
            Ingrese su correo electrónico
          </Text>

          <TextInput
            style={estilos.input}
            placeholderTextColor="#999"
            value={correoElectronico}
            onChangeText={setCorreoElectronico}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Pressable
            style={estilos.boton}
            onPress={manejarBoton}
            disabled={cargando}
          >
            {cargando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={estilos.textoBoton}>
                Recuperar contraseña
              </Text>
            )}
          </Pressable>

          <Pressable onPress={onClose}>
            <Text style={estilos.textoCancelar}>
              Cancelar
            </Text>
          </Pressable>

          {error && (
            <Text style={estilos.textoError}>
              {error}
            </Text>
          )}

          {exito && (
            <Text style={estilos.textoExito}>
              Por favor revisa tu correo electrónico
            </Text>
          )}

        </View>

      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  superposicion: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  contenedorModal: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 22,
    elevation: 8,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
    marginBottom: 12,
  },
  etiqueta: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#000",
    marginBottom: 16,
    backgroundColor: "#fafafa",
  },
  boton: {
    backgroundColor: "#4f46e5",
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  textoBoton: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  textoCancelar: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    marginTop: 6,
  },
  textoError: {
    marginTop: 10,
    color: "#dc2626",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "500",
  },
  textoExito: {
    marginTop: 10,
    color: "#16a34a",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "500",
  },
});