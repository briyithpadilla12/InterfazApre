import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import useChatViewModel from "@/src/viewModels/chatViewModel";
import type { DisplayMessage } from "@/src/models/chat";

export default function ChatScreen() {
  const { appointmentId: paramId } = useLocalSearchParams<{
    appointmentId?: string;
  }>();
  const router = useRouter();
  const appointmentId = paramId ? parseInt(paramId, 10) : null;
  const [textoMensaje, setTextoMensaje] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const {
    mensajes,
    cargando,
    enviando,
    error,
    enviarMensaje,
  } = useChatViewModel(appointmentId);

  const volverAListaMensajes = useCallback(() => {
    router.replace("/(drawer)/(tabs)/mensajesScreen");
  }, [router]);

  useEffect(() => {
    if (!appointmentId || isNaN(appointmentId)) {
      router.back();
    }
  }, [appointmentId, router]);

  useEffect(() => {
    const handler = BackHandler.addEventListener("hardwareBackPress", () => {
      volverAListaMensajes();
      return true;
    });
    return () => handler.remove();
  }, [volverAListaMensajes]);

  useEffect(() => {
    if (mensajes.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [mensajes]);

  const handleEnviar = () => {
    if (!textoMensaje.trim()) return;
    enviarMensaje(textoMensaje);
    setTextoMensaje("");
  };

  if (!appointmentId || isNaN(appointmentId)) {
    return null;
  }

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#085394" />
        <Text style={styles.textoCargando}>Cargando conversación...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.contenedor}
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 60}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={volverAListaMensajes} style={styles.botonVolver}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitulo}>Chat con Psicólogo</Text>
          <Text style={styles.headerSubtitulo}>En línea</Text>
        </View>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorTexto}>{error}</Text>
        </View>
      )}

      {/* Lista de mensajes */}
      <FlatList
        ref={flatListRef}
        data={mensajes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listaMensajes}
        renderItem={({ item }) => (
          <MensajeBurbuja mensaje={item} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTexto}>
              No hay mensajes todavía. Escribe para iniciar la conversación.
            </Text>
          </View>
        }
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje..."
          placeholderTextColor="#888"
          value={textoMensaje}
          onChangeText={setTextoMensaje}
          multiline
          maxLength={1000}
          editable={!enviando}
        />
        <TouchableOpacity
          onPress={handleEnviar}
          disabled={!textoMensaje.trim() || enviando}
          style={[
            styles.botonEnviar,
            (!textoMensaje.trim() || enviando) && styles.botonEnviarDisabled,
          ]}
        >
          <Feather name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function MensajeBurbuja({ mensaje }: { mensaje: DisplayMessage }) {
  const esMio = mensaje.sender === "me";
  return (
    <View
      style={[
        styles.burbujaContainer,
        esMio ? styles.burbujaMia : styles.burbujaOtro,
      ]}
    >
      <View
        style={[
          styles.burbuja,
          esMio ? styles.burbujaMiaBg : styles.burbujaOtroBg,
        ]}
      >
        <Text
          style={[styles.burbujaTexto, esMio ? styles.burbujaTextoMia : styles.burbujaTextoOtro]}
        >
          {mensaje.text}
        </Text>
        <Text
          style={[
            styles.burbujaHora,
            esMio ? styles.burbujaHoraMia : styles.burbujaHoraOtro,
          ]}
        >
          {mensaje.timestamp}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  centrado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
  },
  textoCargando: {
    marginTop: 12,
    color: "#555",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#085394",
    paddingHorizontal: 12,
    paddingVertical: 14,
    paddingTop: Platform.OS === "ios" ? 50 : 14,
  },
  botonVolver: {
    padding: 8,
    marginRight: 8,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitulo: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerSubtitulo: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    marginTop: 2,
  },
  errorBanner: {
    backgroundColor: "#fee",
    padding: 12,
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 8,
  },
  errorTexto: {
    color: "#c00",
    textAlign: "center",
  },
  listaMensajes: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 8,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyTexto: {
    color: "#888",
    textAlign: "center",
  },
  burbujaContainer: {
    marginBottom: 12,
  },
  burbujaMia: {
    alignItems: "flex-end",
  },
  burbujaOtro: {
    alignItems: "flex-start",
  },
  burbuja: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    borderBottomRightRadius: 4,
  },
  burbujaMiaBg: {
    backgroundColor: "#085394",
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 18,
  },
  burbujaOtroBg: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  burbujaTexto: {
    fontSize: 15,
  },
  burbujaTextoMia: {
    color: "#fff",
  },
  burbujaTextoOtro: {
    color: "#333",
  },
  burbujaHora: {
    fontSize: 11,
    marginTop: 4,
  },
  burbujaHoraMia: {
    color: "rgba(255,255,255,0.8)",
  },
  burbujaHoraOtro: {
    color: "#888",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    paddingBottom: Platform.OS === "ios" ? 28 : 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    backgroundColor: "#f5f5f5",
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    marginRight: 8,
  },
  botonEnviar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#085394",
    justifyContent: "center",
    alignItems: "center",
  },
  botonEnviarDisabled: {
    opacity: 0.5,
  },
});
