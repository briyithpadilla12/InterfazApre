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
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            ¿Estás segura de eliminar tu cuenta?
          </Text>
           <Text style={styles.modalText}>
            Esta acción no se puede deshacer. Se eliminarán permanentemente:
          </Text>
         <View style={styles.centeredView}>
           <Text style={styles.modalText}>
            - Tu perfil y datos personales
          </Text>
          <Text style={styles.modalText}>
            - Historial de conversaciones
          </Text>
          <Text style={styles.modalText}>
            - Registros del diario personal
          </Text>
          <Text style={styles.modalText}>
            - Todas las configuraciones
          </Text>
         </View>

       <View>
           <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={onClose}
          >
            <Text style={styles.textStyle}>Cancelar</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.buttonEliminar]}
            onPress={onClose}
          >
            <Text style={styles.textStyle}>Eliminar</Text>
          </Pressable>
       </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
   buttonEliminar: {
    backgroundColor: '#b60b0bff',
  },


  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
