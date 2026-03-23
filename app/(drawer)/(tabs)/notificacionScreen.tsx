import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useNotificacionesViewModel } from "@/src/viewModels/notificacionesViewModels";
import { useChatNotifications } from "@/src/context/chatNotificationsContext";
import NotificacionCard from "@/src/components/NotificacionesCard";
import style from "@/src/components/Styles";
import Feather from "@expo/vector-icons/Feather";

export default function NotificacionesScreen() {
  const router = useRouter();
  const {
    notificaciones,
    cargando,
    eliminarNotificacion,
    eliminarTodas,
  } = useNotificacionesViewModel();
  const { notifications: chatNotifications, removeNotification, clearAll: clearChatNotifications } = useChatNotifications();

  // Unir notificaciones de chat (tiempo real) con las de la API
  const notificacionesChat = chatNotifications.map((n) => ({
    id: n.id,
    titulo: n.title,
    mensaje: n.message,
    fecha: n.createdAt.toLocaleString("es-CO", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
    appointmentId: n.appointmentId,
    esChat: true as const,
  }));
  const notificacionesApi = notificaciones.map((n) => ({
    id: `api-${n.id}`,
    idOriginal: n.id,
    titulo: n.titulo,
    mensaje: n.mensaje,
    fecha: n.fecha,
    esChat: false as const,
  }));
  const todas = [...notificacionesChat, ...notificacionesApi];

  const handleEliminar = (item: (typeof todas)[0]) => {
    if (item.esChat) {
      removeNotification(item.id);
    } else {
      eliminarNotificacion(item.idOriginal);
    }
  };

  const handlePresionar = (item: (typeof todas)[0]) => {
    if (item.esChat && item.appointmentId != null) {
      router.push(`/chat/${item.appointmentId}`);
    }
  };

  if (cargando) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={style.container}>
    
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          marginBottom: 10,
        }}
      >
        <Text style={style.title}>Notificaciones</Text>

        {todas.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              eliminarTodas();
              clearChatNotifications();
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "red",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
            }}
          >
            <Feather name="trash-2" size={18} color="white" />
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                marginLeft: 6,
                fontSize: 13,
              }}
            >
              Borrar todas
            </Text>
          </TouchableOpacity>
        )}
      </View>

      
      <View style={{ flex: 1, padding: 20 }}>
        <FlatList
          data={todas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={item.esChat ? 0.7 : 1}
              onPress={() => item.esChat && handlePresionar(item)}
            >
              <NotificacionCard
                notificacion={{
                  id: item.esChat ? 0 : item.idOriginal,
                  titulo: item.titulo,
                  mensaje: item.mensaje,
                  fecha: item.fecha,
                }}
                onEliminar={() => handleEliminar(item)}
              />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: "#83928322",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Feather name="bell" size={50} color="#ffea2cff" />
              </View>

              <Text
                style={{
                  marginTop: 15,
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                No tienes notificaciones
              </Text>

              <Text
                style={{
                  marginTop: 8,
                  fontSize: 15,
                  textAlign: "center",
                }}
              >
                Cuando tengas nuevas notificaciones aparecerán aquí
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}
