import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNotificacionesViewModel } from "@/src/viewModels/notificacionesViewModels";
import NotificacionCard from "@/src/components/NotificacionesCard";
import style from "@/src/components/Styles";
import Feather from "@expo/vector-icons/Feather";

export default function NotificacionesScreen() {
  const {
    notificaciones,
    cargando,
    eliminarNotificacion,
    eliminarTodas,
  } = useNotificacionesViewModel();

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

        {notificaciones.length > 0 && (
          <TouchableOpacity
            onPress={eliminarTodas}
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
          data={notificaciones}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <NotificacionCard
              notificacion={item}
              onEliminar={eliminarNotificacion}
            />
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
