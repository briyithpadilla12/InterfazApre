import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";

export interface ActualizarPerfilAprendizDTO {
  aprTipoDocumento: string;
  aprNroDocumento: string;
  aprFechaNac: string;
  aprNombre: string;
  aprSegundoNombre: string;
  aprApellido: string;
  aprSegundoApellido: string;
  aprCorreoInstitucional: string;
  aprCorreoPersonal: string;
  aprDireccion: string;
  aprCiudadFk: string;
  aprTelefono: string;
  aprEps: string;
  aprPatologia: string;
  aprEstadoAprFk: string;
  aprTipoPoblacion: string;
  aprTelefonoAcudiente: string;
  aprAcudNombre: string;
  aprAcudApellido: string;
}

interface PropsFormulario {
  onGuardar: (data: ActualizarPerfilAprendizDTO) => void;
  onCerrar: () => void;
}

export default function FormularioActualizarPerfilAprendiz({
  onGuardar,
  onCerrar,
}: PropsFormulario) {
  const [formulario, setFormulario] = useState<ActualizarPerfilAprendizDTO>({
    aprTipoDocumento: "",
    aprNroDocumento: "",
    aprFechaNac: "",
    aprNombre: "",
    aprSegundoNombre: "",
    aprApellido: "",
    aprSegundoApellido: "",
    aprCorreoInstitucional: "",
    aprCorreoPersonal: "",
    aprDireccion: "",
    aprCiudadFk: "",
    aprTelefono: "",
    aprEps: "",
    aprPatologia: "",
    aprEstadoAprFk: "",
    aprTipoPoblacion: "",
    aprTelefonoAcudiente: "",
    aprAcudNombre: "",
    aprAcudApellido: "",
  });

  const [mensajeError, setMensajeError] = useState("");

  const actualizarCampo = (campo: keyof ActualizarPerfilAprendizDTO, valor: string) => {
    setFormulario((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const formularioCompleto = (): boolean => {
    return Object.values(formulario).every(
      (valor) => valor.trim() !== ""
    );
  };

  const intentarGuardar = () => {
    if (!formularioCompleto()) {
      setMensajeError("Por favor complete todos los campos");
      return;
    }

    setMensajeError("");
    onGuardar(formulario);
  };

  const intentarCerrar = () => {
    if (!formularioCompleto()) {
      setMensajeError("Por favor complete todos los campos");
      return;
    }

    onCerrar();
  };

  const renderInput = (label: string, campo: keyof ActualizarPerfilAprendizDTO, keyboard: any = "default") => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={formulario[campo]}
        onChangeText={(text) => actualizarCampo(campo, text)}
        keyboardType={keyboard}
      />
    </View>
  );

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Completar perfil del aprendiz</Text>

        <ScrollView showsVerticalScrollIndicator={false}>

          {renderInput("Tipo de documento", "aprTipoDocumento")}
          {renderInput("Número de documento", "aprNroDocumento", "numeric")}
          {renderInput("Fecha de nacimiento", "aprFechaNac")}
          {renderInput("Nombre", "aprNombre")}
          {renderInput("Segundo nombre", "aprSegundoNombre")}
          {renderInput("Apellido", "aprApellido")}
          {renderInput("Segundo apellido", "aprSegundoApellido")}
          {renderInput("Correo institucional", "aprCorreoInstitucional", "email-address")}
          {renderInput("Correo personal", "aprCorreoPersonal", "email-address")}
          {renderInput("Dirección", "aprDireccion")}
          {renderInput("Ciudad", "aprCiudadFk")}
          {renderInput("Teléfono", "aprTelefono", "phone-pad")}
          {renderInput("EPS", "aprEps")}
          {renderInput("Patología", "aprPatologia")}
          {renderInput("Estado del aprendiz", "aprEstadoAprFk")}
          {renderInput("Tipo de población", "aprTipoPoblacion")}
          {renderInput("Teléfono acudiente", "aprTelefonoAcudiente", "phone-pad")}
          {renderInput("Nombre acudiente", "aprAcudNombre")}
          {renderInput("Apellido acudiente", "aprAcudApellido")}

          {mensajeError !== "" && (
            <Text style={styles.errorText}>{mensajeError}</Text>
          )}

          <Pressable style={styles.saveButton} onPress={intentarGuardar}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </Pressable>

          <Pressable style={styles.cancelButton} onPress={intentarCerrar}>
            <Text style={styles.cancelButtonText}>Cerrar</Text>
          </Pressable>

        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "92%",
    maxHeight: "90%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
    color: "#111",
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#444",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: "#fafafa",
  },
  saveButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 14,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  cancelButton: {
    marginTop: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 14,
  },
  errorText: {
    marginTop: 10,
    color: "#dc2626",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "600",
  },
});