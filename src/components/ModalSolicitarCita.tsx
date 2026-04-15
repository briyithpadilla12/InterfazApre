import { View, Text, StyleSheet, Pressable, Modal, TextInput, ActivityIndicator } from "react-native";
import Collapsible from "react-native-collapsible";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { SolicitarCita as SolicitarCitaType } from "../models/citas";

interface ModalCitasProps {
  visible: boolean;
  onClose: () => void;
  onSolicitar: (cita: SolicitarCitaType) => Promise<boolean>;
  errorEnvioCita: string | null;
  exitoEnvioCita: string | null;
  cargandoEnvioCita: boolean;
}

export function ModalSolicitarCita({
  onClose,
  visible,
  onSolicitar,
  errorEnvioCita,
  exitoEnvioCita,
  cargandoEnvioCita,
}: ModalCitasProps) {
  const [open, setOpen] = useState(false);
  const [tipoCita, setTipoCita] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");

  const solicitarCita = async () => {
    if (!tipoCita.trim() || !descripcion.trim()) return;
    const ok = await onSolicitar({
      tipoCita: tipoCita.toLowerCase(),
      motivoSolicitud: descripcion.trim(),
    });
    if (ok) {
      setTipoCita("");
      setDescripcion("");
      onClose();
    }
  };
   

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >

      <View style={styles.overlay}>

        <View style={styles.modal}>

          <Text style={styles.titulo}>Solicitar cita</Text>

         

          <Pressable onPress={() => setOpen(!open)}>
            <View style={styles.select}>

              <TextInput
                placeholder="Selecciona el tipo de cita"
                editable={false}
                pointerEvents="none"
                value={tipoCita ? tipoCita.charAt(0).toUpperCase() + tipoCita.slice(1) : ""}
                style={styles.inputSelect}
              />

              <Feather
                name={open ? "chevron-up" : "chevron-down"}
                size={22}
                color="#333"
              />

            </View>
          </Pressable>

          <Collapsible collapsed={!open}>

            <View style={styles.dropdown}>

              <Pressable
                style={styles.opcion}
                onPress={() => {
                  setTipoCita("presencial");
                  setOpen(false);
                }}
              >
                <Text style={styles.textoOpcion}>Presencial</Text>
              </Pressable>

              <Pressable
                style={styles.opcion}
                onPress={() => {
                  setTipoCita("chat");
                  setOpen(false);
                }}
              >
                <Text style={styles.textoOpcion}>Chat</Text>
              </Pressable>

            </View>

          </Collapsible>

         

          <Text style={styles.label}>
            Por favor ingrese el motivo de su solicitud
          </Text>


          <TextInput
            style={styles.inputDescripcion}
            multiline
            numberOfLines={4}
            placeholder="Describe brevemente el motivo de tu cita"
            onChangeText={setDescripcion}
            value={descripcion}
          />
             {errorEnvioCita && (
            <Text style={{color : "red"}}>{errorEnvioCita}</Text>
          )}

          {exitoEnvioCita && (
            <Text style={{color : "green"}}>{exitoEnvioCita}</Text>
          )}

        

          <View style={styles.botones}>

            <Pressable style={styles.botonCancelar} onPress={onClose}>
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </Pressable>

            <Pressable style={styles.botonEnviar} onPress={() => solicitarCita()} disabled={cargandoEnvioCita}>
      {cargandoEnvioCita ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: "white", fontWeight: "600" }}>
                  Enviar solicitud
                </Text>
              )}
            </Pressable>

          </View>

        </View>

      </View>

    </Modal>
  );
}

const styles = StyleSheet.create({

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },

  modal: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    elevation: 6
  },

  titulo: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center"
  },

  select: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 10
  },

  inputSelect: {
    flex: 1,
    fontSize: 15
  },

  dropdown: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15
  },

  opcion: {
    paddingVertical: 12,
    paddingHorizontal: 14
  },

  textoOpcion: {
    fontSize: 15
  },

  label: {
    fontSize: 14,
    marginBottom: 6,
    marginTop: 10
  },

  inputDescripcion: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    height: 90,
    textAlignVertical: "top",
    marginBottom: 20
  },

  botones: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  botonCancelar: {
    paddingVertical: 12,
    paddingHorizontal: 18
  },

  textoCancelar: {
    fontSize: 15,
    color: "#666"
  },

  botonEnviar: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8
  },

  textoEnviar: {
    color: "white",
    fontWeight: "600"
  }

});