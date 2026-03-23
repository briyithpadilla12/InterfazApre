import {
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { useRestablecerContraViewModel } from "@/src/viewModels/restablecerContraViewModel";

interface ModalRestablecerContraProps {
  visible: boolean;
  onClose: () => void;
  /** ID del aprendiz (devuelto por recuperar-password). Necesario para reset-password. */
  aprendizId: number;
}

export default function ModalRestablecerContra({
  visible,
  onClose,
  aprendizId,
}: ModalRestablecerContraProps) {
  const { restablecerContra, cargando, error, exito, reset } = useRestablecerContraViewModel();
  const [codigo, setCodigo] = useState("");
  const [nuevaContraseña, setNuevaContraseña] = useState("");

  useEffect(() => {
    if (!visible) {
      reset();
      setCodigo("");
      setNuevaContraseña("");
    }
  }, [visible, reset]);

  // Tras éxito, espera un momento y cierra el modal automáticamente.
  useEffect(() => {
    if (!exito) return;
    const id = setTimeout(() => {
      onClose();
    }, 1500);
    return () => clearTimeout(id);
  }, [exito, onClose]);

  const manejarRestablecer = async () => {
    Keyboard.dismiss();
    await restablecerContra({
      aprendizId,
      codigo,
      nuevaPassword: nuevaContraseña,
    });
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={estilos.superposicion}>
          <View style={estilos.contenedorModal}>
            <Text style={estilos.titulo}>Restablecer contraseña</Text>

            <Text style={estilos.etiqueta}>Código de verificación</Text>
            <TextInput
              style={estilos.input}
              placeholderTextColor="#999"
              placeholder="Ingresa el código de 6 dígitos enviado a tu correo"
              value={codigo}
              onChangeText={setCodigo}
              keyboardType="numeric"
              maxLength={6}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!cargando}
            />

            <Text style={estilos.etiqueta}>Ingresa tu nueva contraseña</Text>
            <TextInput
              style={estilos.input}
              placeholderTextColor="#999"
              placeholder="Nueva contraseña"
              value={nuevaContraseña}
              onChangeText={setNuevaContraseña}
              secureTextEntry
              editable={!cargando}
            />

            <Pressable
              style={estilos.boton}
              onPress={manejarRestablecer}
              disabled={cargando || !aprendizId || !codigo.trim() || !nuevaContraseña}
            >
              {cargando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={estilos.textoBoton}>Restablecer contraseña</Text>
              )}
            </Pressable>

            {error && (
              <Text style={estilos.textoError}>{error}</Text>
            )}

            {exito && (
              <Text style={estilos.textoExito}>
                Contraseña restablecida correctamente. Ya puedes iniciar sesión.
              </Text>
            )}

            <Pressable onPress={onClose} disabled={cargando}>
              <Text style={estilos.textoCancelar}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
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
    marginBottom: 16,
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
