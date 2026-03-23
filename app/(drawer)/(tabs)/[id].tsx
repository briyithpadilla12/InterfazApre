import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { cardsInfoViewModel } from "@/src/dependencias";
import { CardInfo } from "@/src/models/cardInfo";
import Feather from "@expo/vector-icons/Feather";

export default function CardDetalle() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const [card, setCard] = useState<CardInfo | null>(null);

  const idValido = typeof id === "string" && id.trim() !== "";

  useEffect(() => {
    if (idValido) {
      cardsInfoViewModel.obtenerCardPorId(id!).then(setCard);
    } else {
      router.replace("/(drawer)/(tabs)/homeScreen");
    }
  }, [id, idValido]);

  const abrirEnlace = async () => {
    const url = card?.carLink?.trim();
    if (!url) return;
    try {
      const puede = await Linking.canOpenURL(url);
      if (puede) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Enlace no válido", "No se puede abrir este enlace.");
      }
    } catch {
      Alert.alert("Error", "No se pudo abrir el enlace.");
    }
  };

  if (!idValido) {
    return null;
  }

  if (!card) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4aa1f3" />
        <Text style={styles.textoCargando}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll}>
      {card.carImagenUrl ? (
        <Image
          source={{ uri: card.carImagenUrl }}
          style={styles.imagen}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imagenPlaceholder}>
          <Text style={styles.placeholderText}>📄</Text>
        </View>
      )}

      <View style={styles.contenido}>
        <Text style={styles.titulo}>{card.carTitulo ?? "Sin título"}</Text>
        <Text style={styles.descripcion}>
          {card.carDescripcion ?? ""}
        </Text>

        {card.carLink ? (
          <TouchableOpacity
            style={styles.botonEnlace}
            onPress={abrirEnlace}
            activeOpacity={0.7}
          >
            <Feather name="external-link" size={20} color="#fff" />
            <Text style={styles.textoBoton}>Abrir enlace externo</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <TouchableOpacity
        style={styles.botonVolver}
        onPress={() => router.back()}
      >
        <Feather name="arrow-left-circle" size={30} color="#085394" />
        <Text style={styles.textoVolver}>Volver</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textoCargando: {
    marginTop: 12,
    fontSize: 16,
    color: "#555",
  },
  scroll: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imagen: {
    width: "100%",
    height: 200,
    backgroundColor: "#f3f4f6",
  },
  imagenPlaceholder: {
    width: "100%",
    height: 120,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 48,
  },
  contenido: {
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#222",
  },
  descripcion: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
    marginBottom: 20,
  },
  botonEnlace: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#4aa1f3",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  textoBoton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  botonVolver: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 20,
    alignSelf: "flex-start",
  },
  textoVolver: {
    fontSize: 16,
    color: "#085394",
    fontWeight: "600",
  },
});
