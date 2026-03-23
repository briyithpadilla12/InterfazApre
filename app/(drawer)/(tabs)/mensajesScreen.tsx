import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import useMensajesViewModels from "@/src/viewModels/mensajesViewModels";

export default function MensajesScreen() {
  const router = useRouter();
  const { conversaciones, cargando, error, recargar } = useMensajesViewModels();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await recargar();
    setRefreshing(false);
  };

  const abrirChat = (appointmentId: number) => {
    router.push(`/chat/${appointmentId}`);
  };

  if (cargando && conversaciones.length === 0) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#085394" />
        <Text style={styles.textoCargando}>Cargando mensajes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Mensajes</Text>
        <Text style={styles.subtitulo}>Chat con tu psicólogo</Text>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorTexto}>{error}</Text>
          <TouchableOpacity onPress={recargar} style={styles.botonReintentar}>
            <Text style={styles.botonReintentarTexto}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={conversaciones}
        keyExtractor={(item) => String(item.appointmentId)}
        contentContainerStyle={
          conversaciones.length === 0 ? styles.listaVacia : styles.lista
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#085394"]}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => abrirChat(item.appointmentId)}
            activeOpacity={0.7}
          >
            <View style={styles.avatar}>
              <Feather name="message-circle" size={24} color="#fff" />
            </View>
            <View style={styles.info}>
              <View style={styles.filaNombre}>
                <Text style={styles.nombre} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.hora}>{item.timestamp}</Text>
              </View>
              <Text style={styles.ultimoMensaje} numberOfLines={1}>
                {item.lastMessage}
              </Text>
              {item.ficha && (
                <Text style={styles.ficha}>Ficha: {item.ficha}</Text>
              )}
            </View>
            <Feather name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !cargando ? (
            <View style={styles.empty}>
              <Feather name="inbox" size={64} color="#ccc" />
              <Text style={styles.emptyTitulo}>Sin conversaciones</Text>
              <Text style={styles.emptyTexto}>
                Cuando tu psicólogo inicie una conversación contigo, aparecerá aquí.
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  centrado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  textoCargando: {
    marginTop: 12,
    color: "#555",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#085394",
  },
  subtitulo: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  errorBanner: {
    margin: 16,
    padding: 12,
    backgroundColor: "#fee",
    borderRadius: 8,
    alignItems: "center",
  },
  errorTexto: {
    color: "#c00",
    marginBottom: 8,
    textAlign: "center",
  },
  botonReintentar: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: "#c00",
    borderRadius: 8,
  },
  botonReintentarTexto: {
    color: "#fff",
    fontWeight: "600",
  },
  lista: {
    padding: 16,
    paddingBottom: 32,
  },
  listaVacia: {
    flex: 1,
    paddingBottom: 32,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#085394",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  filaNombre: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  nombre: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  hora: {
    fontSize: 12,
    color: "#888",
    marginLeft: 8,
  },
  ultimoMensaje: {
    fontSize: 14,
    color: "#555",
  },
  ficha: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitulo: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
    marginTop: 16,
    textAlign: "center",
  },
  emptyTexto: {
    fontSize: 14,
    color: "#888",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
});
