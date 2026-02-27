import React from "react";
import { Modal, StyleSheet, Text, Pressable, View } from "react-native";

interface ModalCodRegistroProps {
  visible: boolean;
  onClose: () => void;
}


export default function ModalCodRegistroProps(
  {visible, onClose} : ModalCodRegistroProps) {
 
    <Modal
    animationType="fade"
    transparent
    visible
    onRequestClose={onClose}
    >
      <Text>Registro exitoso</Text>
      <Text>Por favor ingrese el código de verificación que fue enviado a su correo electrónico</Text>
      

    </Modal>




}